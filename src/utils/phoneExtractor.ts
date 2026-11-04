/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Phone extraction and formatting utilities for LeadHunter Chrome Extension
 */

export interface ExtractedPhone {
  raw: string;
  normalized: string;
  e164: string;
  country: 'VN' | 'INTL';
  carrier?: string;
  zaloUrl?: string;
  whatsappUrl?: string;
  callUrl: string;
  contextSnippet?: string;
}

// Regex tối ưu cho số điện thoại Việt Nam và Quốc tế
// Hỗ trợ định dạng: 09x, 08x, 03x, 07x, 05x, (+84), +84, 84, cách nhau bằng dấu chấm, gạch ngang, khoảng trắng, ngoặc đơn
export const VN_PHONE_REGEX = /(?:(?:\+84|84|0|\(\+84\)|\(0\))(?:\s|\.|\-)?)(?:\(?)?(3[2-9]|5[5689]|7[06-9]|8[1-9]|9\d)(?:\))?(?:(?:\s|\.|\-)?\d){7}\b/g;

// Regex cho số cố định (Landline) Việt Nam: (024) 3xxx.xxxx, 028.xxx.xxxx, (028)...
export const VN_LANDLINE_REGEX = /(?:\(?(?:\+84|84|0)?(2[48])\)?)(?:(?:\s|\.|\-)?\d){8}\b/g;

// Regex cho số quốc tế chung (+1, +44, +81, ...)
export const INTL_PHONE_REGEX = /\+(?:[1-9]\d{0,2})(?:[\s.-]?\d{1,4}){2,5}\b/g;

export const CARRIER_PREFIXES: Record<string, string[]> = {
  Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
  Mobifone: ['089', '090', '093', '070', '079', '077', '076', '078'],
  Vinaphone: ['088', '091', '094', '083', '084', '085', '081', '082'],
  Vietnamobile: ['092', '056', '058'],
  Gmobile: ['099', '059'],
  Itelecom: ['087'],
  Wintel: ['055'],
};

/**
 * Làm sạch chuỗi số: loại bỏ khoảng trắng, dấu chấm, gạch ngang, ngoặc đơn
 */
export function sanitizePhone(input: string): string {
  if (!input) return '';
  return input.replace(/[\s\.\-\(\)]/g, '').trim();
}

/**
 * Chuẩn hóa số điện thoại về định dạng nội địa chuẩn 0xxxxxxxxx hoặc quốc tế
 */
export function normalizePhone(raw: string): { normalized: string; e164: string; country: 'VN' | 'INTL' } {
  let cleaned = sanitizePhone(raw);

  // Xử lý tiền tố quốc tế Việt Nam
  if (cleaned.startsWith('+84')) {
    cleaned = '0' + cleaned.slice(3);
  } else if (cleaned.startsWith('84') && cleaned.length >= 11 && !raw.includes('+')) {
    cleaned = '0' + cleaned.slice(2);
  } else if ((cleaned.startsWith('24') || cleaned.startsWith('28')) && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }

  // Nếu là số di động VN (10 chữ số bắt đầu bằng 03, 05, 07, 08, 09) hoặc cố định (11 số 02x)
  if (/^0[3|5|7|8|9]\d{8}$/.test(cleaned) || /^02[48]\d{8}$/.test(cleaned)) {
    const e164 = '+84' + cleaned.slice(1);
    return {
      normalized: cleaned,
      e164,
      country: 'VN',
    };
  }

  // Số quốc tế
  const intlCleaned = sanitizePhone(raw);
  const formattedE164 = intlCleaned.startsWith('+') ? intlCleaned : `+${intlCleaned}`;
  return {
    normalized: cleaned,
    e164: formattedE164,
    country: 'INTL',
  };
}

/**
 * Nhận diện nhà mạng viễn thông tại Việt Nam
 */
export function detectCarrier(normalizedPhone: string): string {
  if (!normalizedPhone || normalizedPhone.length < 3) return 'Quốc tế / Khác';

  if (normalizedPhone.startsWith('024')) return 'VNPT / Cố định Hà Nội';
  if (normalizedPhone.startsWith('028')) return 'VNPT / Cố định TP.HCM';

  const prefix3 = normalizedPhone.slice(0, 3);
  for (const [carrier, prefixes] of Object.entries(CARRIER_PREFIXES)) {
    if (prefixes.includes(prefix3)) {
      return carrier;
    }
  }

  return 'Khác / Chưa rõ';
}

/**
 * Định dạng số điện thoại đẹp mắt để hiển thị: 0912 345 678 hoặc 0987.654.321
 */
export function formatPhoneDisplay(normalized: string): string {
  if (normalized.length === 10 && normalized.startsWith('0')) {
    return `${normalized.slice(0, 4)} ${normalized.slice(4, 7)} ${normalized.slice(7)}`;
  }
  return normalized;
}

/**
 * Quét toàn bộ số điện thoại từ một đoạn văn bản hoặc HTML
 */
export function extractPhonesFromText(text: string): ExtractedPhone[] {
  if (!text) return [];

  const foundMap = new Map<string, ExtractedPhone>();

  // 1. Quét số di động VN
  const vnMatches = text.matchAll(VN_PHONE_REGEX);
  for (const match of vnMatches) {
    const raw = match[0].trim();
    const { normalized, e164, country } = normalizePhone(raw);
    
    // Kiểm tra tính hợp lệ tối thiểu của độ dài
    if (normalized.length >= 10 && !foundMap.has(normalized)) {
      const carrier = country === 'VN' ? detectCarrier(normalized) : 'Quốc tế';
      foundMap.set(normalized, {
        raw,
        normalized,
        e164,
        country,
        carrier,
        zaloUrl: `https://zalo.me/${normalized}`,
        whatsappUrl: `https://wa.me/${e164.replace('+', '')}`,
        callUrl: `tel:${normalized}`,
        contextSnippet: extractContext(text, match.index ?? 0, raw.length),
      });
    }
  }

  // 2. Quét số cố định VN
  const landlineMatches = text.matchAll(VN_LANDLINE_REGEX);
  for (const match of landlineMatches) {
    const raw = match[0].trim();
    const { normalized, e164, country } = normalizePhone(raw);
    if (!foundMap.has(normalized)) {
      foundMap.set(normalized, {
        raw,
        normalized,
        e164,
        country,
        carrier: detectCarrier(normalized),
        callUrl: `tel:${normalized}`,
        contextSnippet: extractContext(text, match.index ?? 0, raw.length),
      });
    }
  }

  // 3. Quét số quốc tế (+...)
  const intlMatches = text.matchAll(INTL_PHONE_REGEX);
  for (const match of intlMatches) {
    const raw = match[0].trim();
    // Bỏ qua nếu đã quét ở trên hoặc độ dài quá ngắn
    if (raw.replace(/\D/g, '').length < 8) continue;
    
    const { normalized, e164, country } = normalizePhone(raw);
    if (!foundMap.has(normalized) && !foundMap.has(e164)) {
      foundMap.set(normalized, {
        raw,
        normalized,
        e164,
        country,
        carrier: 'Quốc tế',
        whatsappUrl: `https://wa.me/${e164.replace('+', '')}`,
        callUrl: `tel:${e164}`,
        contextSnippet: extractContext(text, match.index ?? 0, raw.length),
      });
    }
  }

  return Array.from(foundMap.values());
}

/**
 * Trích xuất đoạn ngữ cảnh xung quanh số điện thoại (trước và sau ~30 ký tự)
 */
function extractContext(text: string, index: number, length: number): string {
  const start = Math.max(0, index - 25);
  const end = Math.min(text.length, index + length + 25);
  let snippet = text.slice(start, end).replace(/\s+/g, ' ').trim();
  if (start > 0) snippet = '...' + snippet;
  if (end < text.length) snippet = snippet + '...';
  return snippet;
}

/**
 * Xuất danh sách sang định dạng CSV
 */
export function exportToCSV(phones: ExtractedPhone[], options?: { affiliateId?: string; sourceUrl?: string }): string {
  const headers = ['STT', 'Số điện thoại', 'Định dạng E.164', 'Quốc gia', 'Nhà mạng', 'Zalo Link', 'WhatsApp Link', 'Affiliate ID', 'Nguồn Website', 'Thời gian'];
  const rows = phones.map((p, idx) => {
    const zalo = p.zaloUrl ? (options?.affiliateId ? `${p.zaloUrl}?ref=${options.affiliateId}` : p.zaloUrl) : '';
    const whatsapp = p.whatsappUrl || '';
    const source = options?.sourceUrl || 'Chrome Extension Scan';
    const timestamp = new Date().toISOString();
    return [
      idx + 1,
      `"${p.normalized}"`,
      `"${p.e164}"`,
      `"${p.country}"`,
      `"${p.carrier || ''}"`,
      `"${zalo}"`,
      `"${whatsapp}"`,
      `"${options?.affiliateId || ''}"`,
      `"${source}"`,
      `"${timestamp}"`,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
