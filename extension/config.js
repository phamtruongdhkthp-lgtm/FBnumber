/**
 * LeadHunter VN - Configuration & Shared Constants
 * Tương thích Manifest V3 - Hỗ trợ Facebook Profile UID -> Phone Extractor & Web Scraper
 */

const LeadHunterConfig = {
  VERSION: '1.1.0',

  // Cấu hình mặc định khi cài đặt lần đầu
  DEFAULT_SETTINGS: {
    apiToken: '',
    webhookUrl: 'https://webhook.site/demo-crm-leads',
    fbLookupEndpoint: 'https://api.yourcrm.com/v1/facebook/uid-to-phone',
    affiliateId: '',
    autoScan: true,
    facebookInject: true, // Tự động gắn icon lấy SĐT cạnh tên Facebook
    highlightColor: '#10b981',
    enableZalo: true,
    enableWhatsapp: true,
  },

  // Regex phát hiện số điện thoại Việt Nam tối ưu
  REGEX: {
    VN_MOBILE: /(?:(?:\+84|84|0|\(\+84\)|\(0\))(?:\s|\.|\-)?)(?:\(?)?(3[2-9]|5[5689]|7[06-9]|8[1-9]|9\d)(?:\))?(?:(?:\s|\.|\-)?\d){7}\b/g,
    VN_LANDLINE: /(?:\(?(?:\+84|84|0)?(2[48])\)?)(?:(?:\s|\.|\-)?\d){8}\b/g,
    INTL: /\+(?:[1-9]\d{0,2})(?:[\s.-]?\d{1,4}){2,5}\b/g,
  },

  // Danh mục tiền tố các nhà mạng viễn thông Việt Nam
  CARRIERS: {
    Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
    Mobifone: ['089', '090', '093', '070', '079', '077', '076', '078'],
    Vinaphone: ['088', '091', '094', '083', '084', '085', '081', '082'],
    Vietnamobile: ['092', '056', '058'],
    Gmobile: ['099', '059'],
    Itelecom: ['087'],
    Wintel: ['055'],
  },

  // Selectors nhận diện tên người dùng trên Facebook
  FB_SELECTORS: {
    AUTHOR_LINKS: [
      'a[role="link"][tabindex="0"]',
      'h2 a[role="link"]',
      'h3 a[role="link"]',
      'h4 a[role="link"]',
      'strong a[role="link"]',
      'span[dir="auto"] > a[role="link"]',
      'a[href*="/user/"]',
      'a[href*="profile.php"]',
      'div[role="article"] a[role="link"]',
    ],
  },

  // Hành động truyền thông giữa Content Script <-> Background <-> Popup
  ACTIONS: {
    LEADS_FOUND: 'LEADS_FOUND',
    GET_TAB_LEADS: 'GET_TAB_LEADS',
    SEND_LEAD_CRM: 'SEND_LEAD_CRM',
    SEND_BATCH_CRM: 'SEND_BATCH_CRM',
    LOOKUP_FB_PHONE: 'LOOKUP_FB_PHONE',
    TEST_CONNECTION: 'TEST_CONNECTION',
    RESCAN_PAGE: 'RESCAN_PAGE',
  },

  STORAGE_KEYS: {
    SETTINGS: 'leadhunter_settings',
    TAB_LEADS: 'leadhunter_tab_leads_',
    FB_CACHE: 'leadhunter_fb_cache_',
  },

  sanitizePhone(str) {
    if (!str) return '';
    return str.replace(/[\s\.\-\(\)]/g, '').trim();
  },

  normalizePhone(raw) {
    let cleaned = this.sanitizePhone(raw);
    if (cleaned.startsWith('+84')) {
      cleaned = '0' + cleaned.slice(3);
    } else if (cleaned.startsWith('84') && cleaned.length >= 11 && !raw.includes('+')) {
      cleaned = '0' + cleaned.slice(2);
    } else if ((cleaned.startsWith('24') || cleaned.startsWith('28')) && cleaned.length === 10) {
      cleaned = '0' + cleaned;
    }

    if (/^0[35789]\d{8}$/.test(cleaned) || /^02[48]\d{8}$/.test(cleaned)) {
      return {
        normalized: cleaned,
        e164: '+84' + cleaned.slice(1),
        country: 'VN',
      };
    }

    const intlCleaned = this.sanitizePhone(raw);
    return {
      normalized: cleaned,
      e164: intlCleaned.startsWith('+') ? intlCleaned : `+${intlCleaned}`,
      country: 'INTL',
    };
  },

  detectCarrier(phone) {
    if (!phone || phone.length < 3) return 'Quốc tế';
    if (phone.startsWith('024')) return 'VNPT (Hà Nội)';
    if (phone.startsWith('028')) return 'VNPT (TP.HCM)';

    const prefix = phone.slice(0, 3);
    for (const [carrier, prefixes] of Object.entries(this.CARRIERS)) {
      if (prefixes.includes(prefix)) {
        return carrier;
      }
    }
    return 'Khác';
  },

  extractFbIdentifier(url) {
    if (!url) return null;
    const idMatch = url.match(/[?&]id=(\d+)/);
    if (idMatch && idMatch[1]) return idMatch[1];
    const userMatch = url.match(/\/user\/(\d+)/);
    if (userMatch && userMatch[1]) return userMatch[1];
    const msgMatch = url.match(/\/messages\/t\/(\d+)/);
    if (msgMatch && msgMatch[1]) return msgMatch[1];
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://facebook.com/${url.replace(/^\//, '')}`);
      const part = parsed.pathname.split('/').filter(Boolean)[0];
      if (part && !['groups', 'events', 'watch', 'marketplace', 'friends', 'notifications'].includes(part)) {
        return part;
      }
    } catch (_) {}
    return null;
  },
};

if (typeof self !== 'undefined') self.LeadHunterConfig = LeadHunterConfig;
if (typeof module !== 'undefined' && module.exports) module.exports = LeadHunterConfig;
