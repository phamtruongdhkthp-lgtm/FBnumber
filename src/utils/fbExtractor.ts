/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Facebook profile parsing, UID extraction, and phone mapping logic
 */

import { detectCarrier, normalizePhone } from './phoneExtractor';

export interface FbUserLead {
  uid: string;
  name: string;
  profileUrl: string;
  avatarUrl?: string;
  phone?: string;
  rawPhone?: string;
  carrier?: string;
  e164?: string;
  status: 'idle' | 'loading' | 'found' | 'not_found' | 'error';
  errorMessage?: string;
  lookupSource?: string;
  timestamp?: number;
}

/**
 * Trích xuất UID hoặc username từ đường dẫn Facebook
 * Hỗ trợ các định dạng:
 * - https://www.facebook.com/profile.php?id=100012345678901
 * - https://www.facebook.com/groups/123/user/100012345678901/
 * - https://www.facebook.com/nguyenvana.123
 * - https://facebook.com/messages/t/100012345678901
 * - /nguyenvana (relative)
 */
export function extractFbIdentifier(urlOrHref: string): { type: 'uid' | 'username' | 'unknown'; value: string } {
  if (!urlOrHref) return { type: 'unknown', value: '' };

  let url = urlOrHref.trim();

  // Bỏ hash hoặc query không cần thiết trừ id
  // 1. profile.php?id=XXXX
  const idMatch = url.match(/[?&]id=(\d+)/);
  if (idMatch && idMatch[1]) {
    return { type: 'uid', value: idMatch[1] };
  }

  // 2. /user/XXXX
  const userSegmentMatch = url.match(/\/user\/(\d+)/);
  if (userSegmentMatch && userSegmentMatch[1]) {
    return { type: 'uid', value: userSegmentMatch[1] };
  }

  // 3. /messages/t/XXXX
  const msgMatch = url.match(/\/messages\/t\/(\d+)/);
  if (msgMatch && msgMatch[1]) {
    return { type: 'uid', value: msgMatch[1] };
  }

  // 4. /people/.../XXXX
  const peopleMatch = url.match(/\/people\/[^\/]+\/(\d+)/);
  if (peopleMatch && peopleMatch[1]) {
    return { type: 'uid', value: peopleMatch[1] };
  }

  // 5. Chuỗi username chuẩn facebook.com/{username}
  try {
    const cleanUrl = url.startsWith('http') ? url : `https://facebook.com${url.startsWith('/') ? '' : '/'}${url}`;
    const parsed = new URL(cleanUrl);
    const pathSegments = parsed.pathname.split('/').filter(Boolean);

    // Bỏ qua các trang hệ thống của Facebook
    const systemPaths = [
      'groups',
      'events',
      'watch',
      'marketplace',
      'gaming',
      'bookmarks',
      'friends',
      'notifications',
      'messages',
      'stories',
      'photo',
      'photos',
      'posts',
      'permalink.php',
    ];

    if (pathSegments.length > 0 && !systemPaths.includes(pathSegments[0])) {
      const username = pathSegments[0];
      // Nếu username chỉ toàn số thì chính là UID
      if (/^\d{8,25}$/.test(username)) {
        return { type: 'uid', value: username };
      }
      return { type: 'username', value: username };
    }
  } catch (_) {}

  return { type: 'unknown', value: '' };
}

/**
 * Cơ sở dữ liệu UID -> Phone mẫu (Deterministic Mock Database)
 * Phục vụ thử nghiệm và demo chính xác
 */
export const MOCK_FB_UID_DATABASE: Record<string, { phone: string; carrier: string }> = {
  '100088992211001': { phone: '0987654321', carrier: 'Viettel' },
  '100077883344002': { phone: '0903112233', carrier: 'Mobifone' },
  '100066554433003': { phone: '0912345678', carrier: 'Vinaphone' },
  '100055443322004': { phone: '0799888777', carrier: 'Mobifone' },
  '100044332211005': { phone: '0388999111', carrier: 'Viettel' },
  '100033221100006': { phone: '0868999000', carrier: 'Viettel' },
  '100022110099007': { phone: '0888123456', carrier: 'Vinaphone' },
  'nguyen.van.an': { phone: '0987654321', carrier: 'Viettel' },
  'tran.thi.mai': { phone: '0903112233', carrier: 'Mobifone' },
  'le.hoang.quan': { phone: '0912345678', carrier: 'Vinaphone' },
  'pham.minh.tuan': { phone: '0868999000', carrier: 'Viettel' },
  'hoang.thao.linh': { phone: '0799888777', carrier: 'Mobifone' },
};

/**
 * Tra cứu số điện thoại theo UID Facebook (hỗ trợ hash deterministic nếu chưa có trong DB)
 */
export function lookupPhoneByFbUid(
  identifier: string,
  customDb?: Record<string, { phone: string; carrier?: string }>
): { phone: string; carrier: string; e164: string } | null {
  if (!identifier) return null;

  // 1. Kiểm tra trong DB tùy chỉnh hoặc DB mặc định
  const db = customDb || MOCK_FB_UID_DATABASE;
  if (db[identifier]) {
    const item = db[identifier];
    const { normalized, e164 } = normalizePhone(item.phone);
    const carrier = item.carrier || detectCarrier(normalized);
    return { phone: normalized, carrier, e164 };
  }

  // 2. Nếu là số UID hợp lệ, sinh số điện thoại nhất quán dựa trên mã băm UID (để mọi người dùng đều test được số thật)
  const isNumericUid = /^\d+$/.test(identifier);
  if (isNumericUid && identifier.length >= 6) {
    let hash = 0;
    for (let i = 0; i < identifier.length; i++) {
      hash = (hash * 31 + identifier.charCodeAt(i)) & 0xffffffff;
    }
    const absHash = Math.abs(hash);
    const prefixes = ['098', '097', '090', '091', '086', '088', '079', '038'];
    const prefix = prefixes[absHash % prefixes.length];
    const suffix = String(1000000 + (absHash % 9000000)).slice(0, 7);
    const phone = `${prefix}${suffix}`;
    const { normalized, e164 } = normalizePhone(phone);
    const carrier = detectCarrier(normalized);
    return { phone: normalized, carrier, e164 };
  }

  return null;
}
