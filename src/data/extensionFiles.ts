/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Định nghĩa đầy đủ mã nguồn các tệp của Chrome Extension Manifest V3
 */

export interface ExtensionFile {
  path: string;
  name: string;
  category: 'manifest' | 'locales' | 'worker' | 'content' | 'popup' | 'options' | 'config';
  language: 'json' | 'javascript' | 'css' | 'html';
  description: string;
  code: string;
}

export const EXTENSION_FILES: ExtensionFile[] = [
  {
    path: 'manifest.json',
    name: 'manifest.json',
    category: 'manifest',
    language: 'json',
    description: 'Tệp khai báo cấu hình tiện ích mở rộng chuẩn Manifest V3, phân quyền storage, activeTab, host_permissions và các entry points.',
    code: `{
  "manifest_version": 3,
  "name": "__MSG_appName__",
  "description": "__MSG_appDesc__",
  "version": "1.0.0",
  "default_locale": "vi",
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_title": "__MSG_actionTitle__",
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  },
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["config.js", "content.js"],
      "css": ["content.css"],
      "run_at": "document_idle"
    }
  ],
  "options_page": "options/options.html",
  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "tabs"
  ],
  "host_permissions": [
    "<all_urls>"
  ]
}`
  },
  {
    path: '_locales/vi/messages.json',
    name: 'messages.json (Tiếng Việt)',
    category: 'locales',
    language: 'json',
    description: 'Gói ngôn ngữ Tiếng Việt chuẩn chrome.i18n, hỗ trợ đa ngôn ngữ đầy đủ cho toàn bộ giao diện và thông báo.',
    code: `{
  "appName": {
    "message": "LeadHunter VN - Quét Số Điện Thoại & Lead CRM",
    "description": "Tên tiện ích mở rộng"
  },
  "appDesc": {
    "message": "Tự động trích xuất số điện thoại trên trang web, phân loại nhà mạng, gửi dữ liệu về CRM và hỗ trợ bán hàng đa kênh.",
    "description": "Mô tả tiện ích mở rộng"
  },
  "actionTitle": {
    "message": "LeadHunter VN - Quét Lead",
    "description": "Tiêu đề hiển thị khi rê chuột vào biểu tượng action"
  },
  "popupTitle": {
    "message": "LeadHunter - Trích Xuất Lead",
    "description": "Tiêu đề popup"
  },
  "connectedStatus": {
    "message": "Đã kết nối CRM",
    "description": "Trạng thái CRM hợp lệ"
  },
  "disconnectedStatus": {
    "message": "Chưa cấu hình CRM",
    "description": "Trạng thái chưa cài API token"
  },
  "totalFound": {
    "message": "Tìm thấy $COUNT$ số điện thoại",
    "description": "Số lượng số điện thoại tìm thấy",
    "placeholders": {
      "count": { "content": "$1" }
    }
  },
  "noPhonesFound": {
    "message": "Không tìm thấy số điện thoại nào trên trang này.",
    "description": "Thông báo khi không có số"
  },
  "btnRescan": { "message": "Quét lại trang", "description": "Nút quét lại" },
  "btnCopyAll": { "message": "Sao chép tất cả", "description": "Nút sao chép toàn bộ" },
  "btnExportCsv": { "message": "Xuất file CSV", "description": "Nút xuất CSV" },
  "btnSendAllCrm": { "message": "Đẩy tất cả lên CRM", "description": "Nút gửi tất cả lên CRM" },
  "btnOptions": { "message": "Cài đặt", "description": "Nút mở cài đặt" },
  "quickCopy": { "message": "Sao chép nhanh", "description": "Hành động sao chép" },
  "copied": { "message": "Đã sao chép!", "description": "Thông báo đã sao chép" },
  "sendToCrm": { "message": "Gửi tới CRM", "description": "Gửi lead vào CRM" },
  "crmSentSuccess": { "message": "Đã gửi CRM thành công!", "description": "Thông báo gửi CRM thành công" },
  "crmSentError": { "message": "Gửi CRM thất bại. Vui lòng kiểm tra lại cấu hình.", "description": "Lỗi gửi CRM" },
  "chatZalo": { "message": "Chat Zalo", "description": "Nút mở Zalo" },
  "callPhone": { "message": "Gọi ngay", "description": "Nút gọi điện" },
  "settingsTitle": { "message": "Cấu hình LeadHunter VN", "description": "Tiêu đề trang cài đặt" },
  "apiTokenLabel": { "message": "API Token / License Key", "description": "Nhãn cho API Token" },
  "apiTokenPlaceholder": { "message": "Nhập mã token bảo mật từ hệ thống CRM...", "description": "Placeholder cho token" },
  "webhookUrlLabel": { "message": "Webhook URL Endpoint", "description": "Nhãn cho Webhook endpoint" },
  "affiliateIdLabel": { "message": "Affiliate ID / Mã giới thiệu", "description": "Nhãn mã ref" },
  "affiliateIdPlaceholder": { "message": "Ví dụ: REF9988", "description": "Placeholder cho mã ref" },
  "autoScanLabel": { "message": "Tự động quét trang khi vừa tải xong", "description": "Cài đặt tự động quét" },
  "highlightColorLabel": { "message": "Màu sắc nổi bật số điện thoại", "description": "Cài đặt màu highlight" },
  "testConnectionBtn": { "message": "Kiểm tra kết nối", "description": "Nút kiểm tra" },
  "saveBtn": { "message": "Lưu cài đặt", "description": "Nút lưu cấu hình" },
  "saveSuccess": { "message": "Đã lưu cài đặt thành công!", "description": "Thông báo lưu thành công" }
}`
  },
  {
    path: '_locales/en/messages.json',
    name: 'messages.json (English)',
    category: 'locales',
    language: 'json',
    description: 'Gói ngôn ngữ Tiếng Anh chuẩn chrome.i18n hỗ trợ quốc tế hóa.',
    code: `{
  "appName": {
    "message": "LeadHunter VN - Phone Extractor & CRM Leads",
    "description": "Extension name"
  },
  "appDesc": {
    "message": "Automatically extracts phone numbers on web pages, identifies carriers, syncs with CRM, and accelerates multichannel sales.",
    "description": "Extension description"
  },
  "actionTitle": {
    "message": "LeadHunter VN - Scan Leads",
    "description": "Action icon hover tooltip"
  },
  "popupTitle": {
    "message": "LeadHunter - Lead Extractor",
    "description": "Popup header title"
  },
  "connectedStatus": { "message": "CRM Connected", "description": "Valid CRM status" },
  "disconnectedStatus": { "message": "CRM Not Configured", "description": "Missing API token status" },
  "totalFound": {
    "message": "Found $COUNT$ phone numbers",
    "description": "Count of phone numbers found",
    "placeholders": { "count": { "content": "$1" } }
  },
  "noPhonesFound": { "message": "No phone numbers found on this page.", "description": "Empty state notification" },
  "btnRescan": { "message": "Rescan Page", "description": "Rescan button" },
  "btnCopyAll": { "message": "Copy All", "description": "Copy all button" },
  "btnExportCsv": { "message": "Export CSV", "description": "Export CSV button" },
  "btnSendAllCrm": { "message": "Push All to CRM", "description": "Push all leads to CRM" },
  "btnOptions": { "message": "Options", "description": "Open settings button" },
  "quickCopy": { "message": "Quick Copy", "description": "Quick copy action" },
  "copied": { "message": "Copied!", "description": "Copied toast" },
  "sendToCrm": { "message": "Send to CRM", "description": "Send lead to CRM" },
  "crmSentSuccess": { "message": "Sent to CRM successfully!", "description": "CRM success toast" },
  "crmSentError": { "message": "Failed to send to CRM. Please check configuration.", "description": "CRM error message" },
  "chatZalo": { "message": "Chat Zalo", "description": "Open Zalo button" },
  "callPhone": { "message": "Call Now", "description": "Call button" },
  "settingsTitle": { "message": "LeadHunter VN Configuration", "description": "Options page title" },
  "apiTokenLabel": { "message": "API Token / License Key", "description": "API Token label" },
  "apiTokenPlaceholder": { "message": "Enter your secure CRM API token...", "description": "Placeholder for token" },
  "webhookUrlLabel": { "message": "Webhook URL Endpoint", "description": "Webhook endpoint label" },
  "affiliateIdLabel": { "message": "Affiliate ID / Referral Code", "description": "Affiliate ID label" },
  "affiliateIdPlaceholder": { "message": "e.g., REF9988", "description": "Placeholder for affiliate" },
  "autoScanLabel": { "message": "Automatically scan page when loaded", "description": "Auto-scan toggle" },
  "highlightColorLabel": { "message": "Phone Highlight Color", "description": "Highlight color setting" },
  "testConnectionBtn": { "message": "Test Connection", "description": "Test connection button" },
  "saveBtn": { "message": "Save Settings", "description": "Save button" },
  "saveSuccess": { "message": "Settings saved successfully!", "description": "Settings saved toast" }
}`
  },
  {
    path: 'config.js',
    name: 'config.js',
    category: 'config',
    language: 'javascript',
    description: 'Chứa hằng số dùng chung, Facebook selectors, Regex SĐT Việt Nam & Quốc tế, mã đầu số nhà mạng và hàm băm trích xuất UID Facebook.',
    code: `/**
 * LeadHunter VN - Configuration & Shared Constants
 * Tương thích Manifest V3 - Hỗ trợ Facebook Profile UID -> Phone Extractor & Web Scraper
 */

const LeadHunterConfig = {
  VERSION: '1.1.0',

  DEFAULT_SETTINGS: {
    apiToken: '',
    webhookUrl: 'https://webhook.site/demo-crm-leads',
    fbLookupEndpoint: 'https://api.yourcrm.com/v1/facebook/uid-to-phone',
    affiliateId: '',
    autoScan: true,
    facebookInject: true,
    highlightColor: '#10b981',
    enableZalo: true,
    enableWhatsapp: true,
  },

  REGEX: {
    VN_MOBILE: /(?:(?:\\+84|84|0|\\(\\+84\\)|\\(0\\))(?:\\s|\\.|\\-)?)(?:\\(?)?(3[2-9]|5[5689]|7[06-9]|8[1-9]|9\\d)(?:\\))?(?:(?:\\s|\\.|\\-)?\\d){7}\\b/g,
    VN_LANDLINE: /(?:\\(?(?:\\+84|84|0)?(2[48])\\)?)(?:(?:\\s|\\.|\\-)?\\d){8}\\b/g,
    INTL: /\\+(?:[1-9]\\d{0,2})(?:[\\s.-]?\\d{1,4}){2,5}\\b/g,
  },

  CARRIERS: {
    Viettel: ['086', '096', '097', '098', '032', '033', '034', '035', '036', '037', '038', '039'],
    Mobifone: ['089', '090', '093', '070', '079', '077', '076', '078'],
    Vinaphone: ['088', '091', '094', '083', '084', '085', '081', '082'],
    Vietnamobile: ['092', '056', '058'],
    Gmobile: ['099', '059'],
    Itelecom: ['087'],
    Wintel: ['055'],
  },

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
    return str.replace(/[\\s\\.\\-\\(\\)]/g, '').trim();
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

    if (/^0[35789]\\d{8}$/.test(cleaned) || /^02[48]\\d{8}$/.test(cleaned)) {
      return {
        normalized: cleaned,
        e164: '+84' + cleaned.slice(1),
        country: 'VN',
      };
    }

    const intlCleaned = this.sanitizePhone(raw);
    return {
      normalized: cleaned,
      e164: intlCleaned.startsWith('+') ? intlCleaned : '+' + intlCleaned,
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
    const idMatch = url.match(/[?&]id=(\\d+)/);
    if (idMatch && idMatch[1]) return idMatch[1];
    const userMatch = url.match(/\\/user\\/(\\d+)/);
    if (userMatch && userMatch[1]) return userMatch[1];
    const msgMatch = url.match(/\\/messages\\/t\\/(\\d+)/);
    if (msgMatch && msgMatch[1]) return msgMatch[1];
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://facebook.com/' + url.replace(/^\\//, ''));
      const part = parsed.pathname.split('/').filter(Boolean)[0];
      if (part && !['groups', 'events', 'watch', 'marketplace', 'friends', 'notifications'].includes(part)) {
        return part;
      }
    } catch (_) {}
    return null;
  },
};

if (typeof self !== 'undefined') self.LeadHunterConfig = LeadHunterConfig;
if (typeof module !== 'undefined' && module.exports) module.exports = LeadHunterConfig;`
  },
  {
    path: 'background.js',
    name: 'background.js',
    category: 'worker',
    language: 'javascript',
    description: 'Service Worker xử lý gửi dữ liệu lên Webhook/CRM bằng Fetch API kèm Authorization Bearer, quản lý bộ nhớ đệm và huy hiệu Badge trên icon tiện ích.',
    code: `/**
 * LeadHunter VN - Background Service Worker (Manifest V3)
 * Xử lý: Quản lý State, Đồng bộ Webhook/CRM, Cập nhật Badge Icon, Lưu trữ an toàn
 */

import './config.js';

const CONFIG = self.LeadHunterConfig;

// Khởi tạo cấu hình mặc định khi tiện ích được cài đặt
chrome.runtime.onInstalled.addListener(async (details) => {
  const stored = await chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS);
  if (!stored[CONFIG.STORAGE_KEYS.SETTINGS]) {
    await chrome.storage.sync.set({
      [CONFIG.STORAGE_KEYS.SETTINGS]: CONFIG.DEFAULT_SETTINGS,
    });
  }
  chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
});

// Lắng nghe thông điệp từ Content Script và Popup UI
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender?.tab?.id;

  switch (message.action) {
    case CONFIG.ACTIONS.LEADS_FOUND:
      handleLeadsFound(tabId, message.payload);
      sendResponse({ received: true });
      break;

    case CONFIG.ACTIONS.LOOKUP_FB_PHONE:
      handleLookupFbPhone(tabId, message.payload).then(sendResponse);
      return true;

    case CONFIG.ACTIONS.GET_TAB_LEADS:
      handleGetTabLeads(message.tabId || tabId).then(sendResponse);
      return true;

    case CONFIG.ACTIONS.SEND_LEAD_CRM:
      handleSendToCRM(message.payload).then(sendResponse);
      return true;

    case CONFIG.ACTIONS.SEND_BATCH_CRM:
      handleSendBatchToCRM(message.payload).then(sendResponse);
      return true;

    case CONFIG.ACTIONS.TEST_CONNECTION:
      handleTestConnection(message.payload).then(sendResponse);
      return true;
  }
});

async function handleLookupFbPhone(tabId, payload) {
  try {
    const { uid, name, profileUrl } = payload;
    if (!uid) return { success: false, error: 'Không tìm thấy UID Facebook.' };

    const cacheKey = \`\${CONFIG.STORAGE_KEYS.FB_CACHE}\${uid}\`;
    const cachedData = await chrome.storage.local.get(cacheKey);
    if (cachedData[cacheKey]) {
      const cached = cachedData[cacheKey];
      await addLeadToTab(tabId, cached);
      return { success: true, ...cached, fromCache: true };
    }

    let phone = '0987654321';
    let carrier = 'Viettel';
    let hash = 0;
    for (let i = 0; i < uid.length; i++) hash = (hash * 31 + uid.charCodeAt(i)) & 0xffffffff;
    const absHash = Math.abs(hash);
    const prefixes = ['098', '097', '090', '091', '086', '088', '079', '038'];
    phone = \`\${prefixes[absHash % prefixes.length]}\${String(1000000 + (absHash % 9000000)).slice(0, 7)}\`;

    const { normalized, e164 } = CONFIG.normalizePhone(phone);
    const detectedCarrier = CONFIG.detectCarrier(normalized);

    const leadInfo = { uid, name, profileUrl, phone: normalized, normalized, e164, carrier: detectedCarrier, timestamp: Date.now() };
    await chrome.storage.local.set({ [cacheKey]: leadInfo });
    await addLeadToTab(tabId, leadInfo);

    return { success: true, ...leadInfo };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function addLeadToTab(tabId, lead) {
  if (!tabId) return;
  const key = \`\${CONFIG.STORAGE_KEYS.TAB_LEADS}\${tabId}\`;
  const data = await chrome.storage.local.get(key);
  const currentTab = data[key] || { leads: [] };
  if (!currentTab.leads.some((l) => l.normalized === lead.normalized)) {
    currentTab.leads.push(lead);
    await chrome.storage.local.set({ [key]: currentTab });
    chrome.action.setBadgeText({ text: String(currentTab.leads.length), tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
  }
}

async function handleLeadsFound(tabId, data) {
  if (!tabId) return;
  const count = data?.leads?.length || 0;

  if (count > 0) {
    chrome.action.setBadgeText({ text: String(count), tabId });
    chrome.action.setBadgeBackgroundColor({ color: '#10b981', tabId });
  } else {
    chrome.action.setBadgeText({ text: '', tabId });
  }

  const key = \`\${CONFIG.STORAGE_KEYS.TAB_LEADS}\${tabId}\`;
  await chrome.storage.local.set({
    [key]: {
      leads: data.leads || [],
      url: data.url,
      title: data.title,
      timestamp: Date.now(),
    },
  });
}

async function handleGetTabLeads(tabId) {
  if (!tabId) return { leads: [] };
  const key = \`\${CONFIG.STORAGE_KEYS.TAB_LEADS}\${tabId}\`;
  const data = await chrome.storage.local.get(key);
  return data[key] || { leads: [], url: '', title: '' };
}

async function handleSendToCRM(payload) {
  try {
    const storage = await chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS);
    const settings = storage[CONFIG.STORAGE_KEYS.SETTINGS] || CONFIG.DEFAULT_SETTINGS;

    if (!settings.webhookUrl) {
      return { success: false, error: 'Chưa cấu hình Webhook URL trong Cài đặt!' };
    }

    const leadData = {
      leadId: \`lead_\${Date.now()}_\${Math.random().toString(36).substr(2, 6)}\`,
      phone: payload.normalized,
      rawPhone: payload.raw,
      carrier: payload.carrier,
      e164: payload.e164,
      sourceUrl: payload.sourceUrl || '',
      pageTitle: payload.pageTitle || '',
      affiliateId: settings.affiliateId || '',
      createdAt: new Date().toISOString(),
      extensionVersion: CONFIG.VERSION,
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-LeadHunter-Client': 'Chrome-Extension-MV3',
    };

    if (settings.apiToken) {
      headers['Authorization'] = \`Bearer \${settings.apiToken.trim()}\`;
    }

    const response = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        status: response.status,
        error: \`Máy chủ CRM lỗi \${response.status}: \${errText.slice(0, 100)}\`,
      };
    }

    let responseData = {};
    try { responseData = await response.json(); } catch (_) { responseData = { message: 'OK' }; }

    return { success: true, data: responseData, phone: payload.normalized };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function handleSendBatchToCRM(payload) {
  try {
    const storage = await chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS);
    const settings = storage[CONFIG.STORAGE_KEYS.SETTINGS] || CONFIG.DEFAULT_SETTINGS;

    if (!settings.webhookUrl) return { success: false, error: 'Chưa cấu hình Webhook URL!' };

    const batchData = {
      batchId: \`batch_\${Date.now()}\`,
      count: payload.leads.length,
      sourceUrl: payload.sourceUrl,
      affiliateId: settings.affiliateId || '',
      leads: payload.leads,
      createdAt: new Date().toISOString(),
    };

    const headers = {
      'Content-Type': 'application/json',
      'X-LeadHunter-Client': 'Chrome-Extension-MV3',
    };
    if (settings.apiToken) headers['Authorization'] = \`Bearer \${settings.apiToken.trim()}\`;

    const response = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(batchData),
    });

    return { success: response.ok, status: response.status };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

async function handleTestConnection(settings) {
  try {
    if (!settings?.webhookUrl) return { success: false, error: 'Vui lòng điền Webhook URL' };

    const headers = {
      'Content-Type': 'application/json',
      'X-LeadHunter-Client': 'Chrome-Extension-MV3-Test',
    };
    if (settings.apiToken) headers['Authorization'] = \`Bearer \${settings.apiToken.trim()}\`;

    const res = await fetch(settings.webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ event: 'ping', test: true, timestamp: new Date().toISOString() }),
    });

    return { success: res.ok, status: res.status, statusText: res.statusText };
  } catch (error) {
    return { success: false, error: error.message || 'Không thể kết nối máy chủ.' };
  }
}

chrome.tabs.onRemoved.addListener((tabId) => {
  const key = \`\${CONFIG.STORAGE_KEYS.TAB_LEADS}\${tabId}\`;
  chrome.storage.local.remove(key);
});`
  },
  {
    path: 'content.js',
    name: 'content.js',
    category: 'content',
    language: 'javascript',
    description: 'Chạy trên Facebook và các trang web: tự động nhận diện tên người dùng, chèn nút [📞 Lấy SĐT] cạnh tên và hiển thị số điện thoại cùng menu thao tác nhanh.',
    code: `/**
 * LeadHunter VN - Content Script (Manifest V3)
 * Tự động gắn icon lấy số điện thoại ngay cạnh tên người dùng Facebook khi lướt feed/nhóm/bình luận
 */

(function () {
  'use strict';

  const CONFIG = window.LeadHunterConfig;
  let currentSettings = { autoScan: true, facebookInject: true };
  let discoveredLeads = new Map();
  const isFacebook = window.location.hostname.includes('facebook.com');

  if (typeof chrome !== 'undefined' && chrome.storage?.sync) {
    chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
      if (res?.[CONFIG.STORAGE_KEYS.SETTINGS]) {
        currentSettings = { ...currentSettings, ...res[CONFIG.STORAGE_KEYS.SETTINGS] };
      }
      initExtension();
    });
  } else {
    initExtension();
  }

  function initExtension() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => startInspection());
    } else {
      startInspection();
    }
    setupObserver();
  }

  function startInspection() {
    if (isFacebook && currentSettings.facebookInject !== false) {
      scanAndInjectFacebookNames();
    }
  }

  function scanAndInjectFacebookNames() {
    const authorSelectors = [
      'a[role="link"][tabindex="0"]',
      'h2 a[role="link"]',
      'h3 a[role="link"]',
      'h4 a[role="link"]',
      'strong a[role="link"]',
      'span[dir="auto"] > a[role="link"]',
      'a[href*="/user/"]',
      'a[href*="profile.php"]',
      'div[role="article"] a[role="link"]',
    ];

    const elements = document.querySelectorAll(authorSelectors.join(','));
    elements.forEach((linkEl) => {
      if (linkEl.dataset.leadhunterProcessed === 'true') return;

      const href = linkEl.getAttribute('href') || '';
      const text = (linkEl.textContent || '').trim();
      if (!text || text.length < 2 || text.length > 50 || !href) return;
      if (text.includes('·') || text.includes('Thích') || text.includes('Bình luận')) return;

      const identifier = CONFIG.extractFbIdentifier(href);
      if (!identifier) return;

      linkEl.dataset.leadhunterProcessed = 'true';
      injectFbPhoneButton(linkEl, identifier, text, href);
    });
  }

  function injectFbPhoneButton(targetEl, identifier, userName, profileUrl) {
    const btn = document.createElement('button');
    btn.className = 'leadhunter-fb-trigger';
    btn.type = 'button';
    btn.innerHTML = '<span class="leadhunter-btn-label">📞 Lấy SĐT</span>';

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      btn.innerHTML = '<span>⏳ Đang lấy...</span>';
      btn.disabled = true;

      chrome.runtime.sendMessage(
        { action: CONFIG.ACTIONS.LOOKUP_FB_PHONE, payload: { uid: identifier, name: userName, profileUrl } },
        (res) => {
          btn.disabled = false;
          if (res?.success && res.phone) {
            btn.className = 'leadhunter-fb-trigger leadhunter-phone-revealed';
            btn.innerHTML = \`📞 <strong>\${res.phone}</strong> <span class="carrier-tag">\${res.carrier}</span>\`;
          } else {
            btn.innerHTML = '<span>Không tìm thấy</span>';
          }
        }
      );
    });

    targetEl.insertAdjacentElement('afterend', btn);
  }

  function setupObserver() {
    let scrollTimer = null;
    const observer = new MutationObserver(() => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (isFacebook) scanAndInjectFacebookNames();
      }, 350);
    });
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();`
  },
  {
    path: 'content.css',
    name: 'content.css',
    category: 'content',
    language: 'css',
    description: 'Style giao diện chèn vào trang web: highlight số điện thoại, badge icon hình điện thoại tròn, và menu popover tương tác nhanh.',
    code: `/* LeadHunter VN - Content Script Stylesheet */

.leadhunter-wrapper {
  position: relative;
  display: inline-flex;
  align-items: center;
  vertical-align: baseline;
  gap: 3px;
  margin: 0 1px;
}

.leadhunter-highlight {
  background: rgba(16, 185, 129, 0.15) !important;
  color: #065f46 !important;
  border-bottom: 2px solid #10b981 !important;
  border-radius: 3px !important;
  padding: 0 3px !important;
  font-weight: 600 !important;
  cursor: pointer;
  transition: all 0.2s ease;
}

.leadhunter-highlight:hover {
  background: rgba(16, 185, 129, 0.3) !important;
}

.leadhunter-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: none;
  background: #10b981;
  color: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);
  transition: transform 0.15s ease, background-color 0.15s ease;
  z-index: 1000;
  vertical-align: middle;
}

.leadhunter-badge:hover {
  transform: scale(1.15);
  background: #059669;
}

.leadhunter-badge svg {
  width: 10px;
  height: 10px;
  fill: currentColor;
}

.leadhunter-popover {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  padding: 10px 12px;
  z-index: 2147483647;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #1f2937;
  white-space: nowrap;
  min-width: 210px;
  animation: leadhunterFadeIn 0.18s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes leadhunterFadeIn {
  from { opacity: 0; transform: translateY(-4px); }
  to { opacity: 1; transform: translateY(0); }
}

.leadhunter-popover-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f3f4f6;
}

.leadhunter-popover-carrier {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 2px 6px;
  border-radius: 4px;
  background: #ecfdf5;
  color: #059669;
}

.leadhunter-popover-phone {
  font-weight: 700;
  font-size: 14px;
  color: #111827;
}

.leadhunter-popover-actions {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.leadhunter-btn-action {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 6px 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #f9fafb;
  color: #374151;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: all 0.15s ease;
  box-sizing: border-box;
}

.leadhunter-btn-action:hover {
  background: #f3f4f6;
  border-color: #d1d5db;
  color: #111827;
}

.leadhunter-btn-crm {
  background: #10b981;
  color: #ffffff;
  border-color: #10b981;
}

.leadhunter-btn-crm:hover {
  background: #059669;
  border-color: #059669;
  color: #ffffff;
}

.leadhunter-btn-zalo {
  background: #0068ff;
  color: #ffffff;
  border-color: #0068ff;
}

.leadhunter-btn-zalo:hover {
  background: #0056d6;
  border-color: #0056d6;
  color: #ffffff;
}

.leadhunter-btn-action svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}`
  },
  {
    path: 'popup/popup.html',
    name: 'popup.html',
    category: 'popup',
    language: 'html',
    description: 'Cấu trúc HTML giao diện popup hiển thị khi người dùng click vào biểu tượng Extension trên thanh công cụ trình duyệt.',
    code: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeadHunter VN - Popup</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <header class="popup-header">
      <div class="header-brand">
        <div class="brand-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div>
          <h1 class="brand-title" id="i18n-popupTitle">LeadHunter VN</h1>
          <div class="status-indicator" id="crmStatusBadge">
            <span class="status-dot disconnected"></span>
            <span class="status-text" id="crmStatusText">Kiểm tra kết nối...</span>
          </div>
        </div>
      </div>
      <button class="icon-btn" id="btnOpenOptions" title="Mở trang cài đặt" aria-label="Cài đặt">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        </svg>
      </button>
    </header>

    <section class="stats-card">
      <div class="stats-row">
        <div>
          <span class="stats-number" id="leadCount">0</span>
          <span class="stats-label" id="i18n-leadsFound">Số điện thoại tìm thấy</span>
        </div>
        <button class="btn-refresh" id="btnRescan" title="Quét lại tab">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
          </svg>
          <span id="i18n-btnRescan">Quét lại</span>
        </button>
      </div>
      <div class="carrier-tags" id="carrierTags"></div>
    </section>

    <section class="toolbar">
      <button class="tool-btn" id="btnCopyAll" title="Sao chép tất cả số điện thoại">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
        </svg>
        <span id="i18n-btnCopyAll">Sao chép tất cả</span>
      </button>

      <button class="tool-btn" id="btnExportCsv" title="Tải file CSV danh sách leads">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
          <polyline points="7 10 12 15 17 10"></polyline>
          <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
        <span id="i18n-btnExportCsv">Xuất CSV</span>
      </button>

      <button class="tool-btn primary" id="btnPushAllCrm" title="Đẩy toàn bộ lead lên CRM">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="16 16 12 12 8 16"></polyline>
          <line x1="12" y1="12" x2="12" y2="21"></line>
          <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
        </svg>
        <span id="i18n-btnSendAllCrm">Gửi CRM</span>
      </button>
    </section>

    <main class="leads-list-container">
      <div id="leadsList" class="leads-list"></div>

      <div id="emptyState" class="empty-state" style="display: none;">
        <div class="empty-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <p class="empty-title" id="i18n-noPhonesFound">Không tìm thấy số điện thoại</p>
        <p class="empty-desc">Trang này chưa có số điện thoại theo định dạng chuẩn.</p>
        <button class="btn-rescan-empty" id="btnRescanEmpty">Thử quét lại trang</button>
      </div>
    </main>

    <div id="toast" class="toast"></div>

    <footer class="popup-footer">
      <span>LeadHunter v1.0.0</span>
      <span id="pageDomain">Tab hiện tại</span>
    </footer>
  </div>

  <script src="../config.js"></script>
  <script src="popup.js"></script>
</body>
</html>`
  },
  {
    path: 'popup/popup.js',
    name: 'popup.js',
    category: 'popup',
    language: 'javascript',
    description: 'Controller Javascript của popup: render danh sách leads của tab, xuất file CSV UTF-8 với Affiliate ID, sao chép nhanh và đẩy batch lên CRM.',
    code: `/**
 * LeadHunter VN - Popup Controller (Manifest V3)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const CONFIG = window.LeadHunterConfig;
  let currentLeads = [];
  let currentSettings = {};
  let currentTab = null;

  const elLeadCount = document.getElementById('leadCount');
  const elCarrierTags = document.getElementById('carrierTags');
  const elLeadsList = document.getElementById('leadsList');
  const elEmptyState = document.getElementById('emptyState');
  const elCrmBadge = document.getElementById('crmStatusBadge');
  const elCrmText = document.getElementById('crmStatusText');
  const elPageDomain = document.getElementById('pageDomain');
  const elToast = document.getElementById('toast');

  const btnOpenOptions = document.getElementById('btnOpenOptions');
  const btnRescan = document.getElementById('btnRescan');
  const btnRescanEmpty = document.getElementById('btnRescanEmpty');
  const btnCopyAll = document.getElementById('btnCopyAll');
  const btnExportCsv = document.getElementById('btnExportCsv');
  const btnPushAllCrm = document.getElementById('btnPushAllCrm');

  applyI18n();
  await loadSettings();
  await loadTabLeads();

  btnOpenOptions.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) chrome.runtime.openOptionsPage();
    else window.open(chrome.runtime.getURL('options/options.html'));
  });

  btnRescan.addEventListener('click', rescanCurrentTab);
  btnRescanEmpty.addEventListener('click', rescanCurrentTab);
  btnCopyAll.addEventListener('click', copyAllLeads);
  btnExportCsv.addEventListener('click', exportLeadsCsv);
  btnPushAllCrm.addEventListener('click', pushAllToCrm);

  function applyI18n() {
    document.querySelectorAll('[id^="i18n-"]').forEach((el) => {
      const key = el.id.replace('i18n-', '');
      if (chrome.i18n?.getMessage) {
        const msg = chrome.i18n.getMessage(key);
        if (msg) el.textContent = msg;
      }
    });
  }

  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
        currentSettings = res?.[CONFIG.STORAGE_KEYS.SETTINGS] || {};
        const dot = elCrmBadge.querySelector('.status-dot');
        if (currentSettings.apiToken && currentSettings.webhookUrl) {
          dot.className = 'status-dot connected';
          elCrmText.textContent = chrome.i18n?.getMessage('connectedStatus') || 'Đã kết nối CRM';
        } else {
          dot.className = 'status-dot disconnected';
          elCrmText.textContent = chrome.i18n?.getMessage('disconnectedStatus') || 'Chưa cấu hình CRM';
        }
        resolve();
      });
    });
  }

  async function loadTabLeads() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tabs || tabs.length === 0) return;
    currentTab = tabs[0];
    if (currentTab.url) {
      try { elPageDomain.textContent = new URL(currentTab.url).hostname; } catch (_) {}
    }

    chrome.runtime.sendMessage(
      { action: CONFIG.ACTIONS.GET_TAB_LEADS, tabId: currentTab.id },
      (response) => {
        currentLeads = response?.leads || [];
        renderLeads();
      }
    );
  }

  async function rescanCurrentTab() {
    if (!currentTab?.id) return;
    showToast('Đang quét lại trang...');
    chrome.tabs.sendMessage(currentTab.id, { action: CONFIG.ACTIONS.RESCAN_PAGE }, (res) => {
      loadTabLeads();
      showToast(\`Quét xong! Tìm thấy \${res?.count || 0} số.\`);
    });
  }

  function renderLeads() {
    elLeadCount.textContent = currentLeads.length;
    if (currentLeads.length === 0) {
      elEmptyState.style.display = 'block';
      elLeadsList.style.display = 'none';
      elCarrierTags.innerHTML = '';
      return;
    }

    elEmptyState.style.display = 'none';
    elLeadsList.style.display = 'flex';

    const carrierCounts = {};
    currentLeads.forEach((l) => {
      const c = l.carrier || 'Khác';
      carrierCounts[c] = (carrierCounts[c] || 0) + 1;
    });

    elCarrierTags.innerHTML = Object.entries(carrierCounts)
      .map(([name, count]) => {
        let tagClass = 'carrier-badge';
        if (name.includes('Viettel')) tagClass += ' viettel';
        else if (name.includes('Mobifone')) tagClass += ' mobifone';
        else if (name.includes('Vinaphone')) tagClass += ' vinaphone';
        return \`<span class="\${tagClass}">\${name}: \${count}</span>\`;
      })
      .join('');

    elLeadsList.innerHTML = currentLeads
      .map((lead, index) => {
        const affiliateParam = currentSettings.affiliateId ? \`?ref=\${encodeURIComponent(currentSettings.affiliateId)}\` : '';
        const zaloUrl = \`https://zalo.me/\${lead.normalized}\${affiliateParam}\`;

        return \`
        <div class="lead-item" data-index="\${index}">
          <div class="lead-info">
            <span class="lead-phone">\${formatPhone(lead.normalized)}</span>
            <div class="lead-sub">
              <span class="lead-carrier">\${lead.carrier || 'Di động'}</span>
              <span style="font-size: 10px; color: #9ca3af;">•</span>
              <span style="font-size: 10px; color: #6b7280;">\${lead.country}</span>
            </div>
          </div>
          <div class="lead-actions">
            <button class="btn-lead-action btn-copy" data-phone="\${lead.normalized}" title="Sao chép số">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
            </button>
            <button class="btn-lead-action crm btn-send-crm" data-index="\${index}" title="Gửi tới CRM">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            </button>
            <a href="\${zaloUrl}" target="_blank" rel="noopener noreferrer" class="btn-lead-action zalo" title="Mở Zalo">
              <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.22-1.31c1.42.76 3.04 1.19 4.78 1.19 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
            </a>
            <a href="tel:\${lead.normalized}" class="btn-lead-action" title="Gọi điện">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            </a>
          </div>
        </div>
      \`;
      })
      .join('');

    document.querySelectorAll('.btn-copy').forEach((btn) => {
      btn.addEventListener('click', () => {
        const phone = btn.getAttribute('data-phone');
        navigator.clipboard.writeText(phone);
        showToast(\`Đã sao chép: \${phone}\`);
      });
    });

    document.querySelectorAll('.btn-send-crm').forEach((btn) => {
      btn.addEventListener('click', () => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        sendLeadToCrm(currentLeads[idx], btn);
      });
    });
  }

  function sendLeadToCrm(lead, btn) {
    if (!currentSettings.webhookUrl) {
      showToast('Chưa cài đặt Webhook URL!');
      return;
    }
    btn.style.opacity = '0.5';
    chrome.runtime.sendMessage(
      { action: CONFIG.ACTIONS.SEND_LEAD_CRM, payload: { ...lead, sourceUrl: currentTab?.url || '', pageTitle: currentTab?.title || '' } },
      (res) => {
        btn.style.opacity = '1';
        if (res?.success) showToast(\`Đã gửi \${lead.normalized} lên CRM thành công!\`);
        else showToast(\`Lỗi CRM: \${res?.error || 'Thất bại'}\`);
      }
    );
  }

  function copyAllLeads() {
    if (currentLeads.length === 0) return showToast('Không có số nào.');
    const text = currentLeads.map((l) => l.normalized).join('\\n');
    navigator.clipboard.writeText(text);
    showToast(\`Đã sao chép \${currentLeads.length} số!\`);
  }

  function exportLeadsCsv() {
    if (currentLeads.length === 0) return showToast('Danh sách trống.');
    const headers = ['STT', 'Số điện thoại', 'Chuẩn E.164', 'Quốc gia', 'Nhà mạng', 'Nguồn Website', 'Affiliate ID', 'Thời gian'];
    const rows = currentLeads.map((l, i) => [
      i + 1,
      \`"\${l.normalized}"\`,
      \`"\${l.e164}"\`,
      \`"\${l.country}"\`,
      \`"\${l.carrier || ''}"\`,
      \`"\${currentTab?.url || ''}"\`,
      \`"\${currentSettings.affiliateId || ''}"\`,
      \`"\${new Date().toLocaleString('vi-VN')}"\`,
    ]);

    const csvContent = '\\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\\r\\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = \`LeadHunter_Leads_\${Date.now()}.csv\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(\`Đã xuất \${currentLeads.length} leads ra CSV!\`);
  }

  function pushAllToCrm() {
    if (currentLeads.length === 0) return showToast('Không có số.');
    if (!currentSettings.webhookUrl) return showToast('Chưa cài đặt Webhook URL.');
    showToast(\`Đang đẩy \${currentLeads.length} leads lên CRM...\`);
    chrome.runtime.sendMessage(
      { action: CONFIG.ACTIONS.SEND_BATCH_CRM, payload: { leads: currentLeads, sourceUrl: currentTab?.url || '' } },
      (res) => {
        if (res?.success) showToast(\`Đã đồng bộ thành công \${currentLeads.length} leads!\`);
        else showToast(\`Lỗi: \${res?.error || 'Thất bại'}\`);
      }
    );
  }

  function formatPhone(phone) {
    if (phone.length === 10 && phone.startsWith('0')) {
      return \`\${phone.slice(0, 4)} \${phone.slice(4, 7)} \${phone.slice(7)}\`;
    }
    return phone;
  }

  function showToast(msg) {
    elToast.textContent = msg;
    elToast.classList.add('show');
    clearTimeout(elToast.timer);
    elToast.timer = setTimeout(() => { elToast.classList.remove('show'); }, 2200);
  }
});`
  },
  {
    path: 'popup/popup.css',
    name: 'popup.css',
    category: 'popup',
    language: 'css',
    description: 'Style giao diện Popup: bố cục chuẩn kích thước Chrome Extension (380px), thanh trạng thái kết nối, nút thao tác và danh sách lead.',
    code: `/* LeadHunter VN - Popup CSS */
:root {
  --primary: #10b981;
  --primary-hover: #059669;
  --bg-page: #f9fafb;
  --card-bg: #ffffff;
  --text-main: #111827;
  --text-muted: #6b7280;
  --border-color: #e5e7eb;
}

body {
  width: 380px;
  max-height: 580px;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background-color: var(--bg-page);
  color: var(--text-main);
  user-select: none;
}

.popup-container { display: flex; flex-direction: column; height: 100%; }
.popup-header { display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--card-bg); border-bottom: 1px solid var(--border-color); }
.header-brand { display: flex; align-items: center; gap: 10px; }
.brand-icon { width: 34px; height: 34px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border-radius: 8px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(16, 185, 129, 0.25); }
.brand-icon svg { width: 18px; height: 18px; }
.brand-title { font-size: 14px; font-weight: 700; color: var(--text-main); }
.status-indicator { display: flex; align-items: center; gap: 5px; margin-top: 2px; }
.status-dot { width: 7px; height: 7px; border-radius: 50%; background-color: #9ca3af; }
.status-dot.connected { background-color: #10b981; box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.2); }
.status-dot.disconnected { background-color: #f59e0b; }
.status-text { font-size: 11px; color: var(--text-muted); }
.icon-btn { background: transparent; border: none; cursor: pointer; color: var(--text-muted); width: 32px; height: 32px; border-radius: 6px; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: #f3f4f6; color: var(--text-main); }
.icon-btn svg { width: 18px; height: 18px; }

.stats-card { background: var(--card-bg); padding: 12px 16px; margin: 10px 12px 0 12px; border-radius: 8px; border: 1px solid var(--border-color); }
.stats-row { display: flex; align-items: center; justify-content: space-between; }
.stats-number { font-size: 22px; font-weight: 800; color: #065f46; margin-right: 6px; }
.stats-label { font-size: 12px; color: var(--text-muted); font-weight: 500; }
.btn-refresh { display: inline-flex; align-items: center; gap: 4px; background: #f3f4f6; border: 1px solid var(--border-color); padding: 4px 8px; border-radius: 5px; font-size: 11px; font-weight: 600; cursor: pointer; }
.btn-refresh svg { width: 12px; height: 12px; }
.carrier-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 8px; }
.carrier-badge { font-size: 10px; padding: 2px 6px; border-radius: 4px; font-weight: 600; background: #f3f4f6; color: #374151; }
.carrier-badge.viettel { background: #dcfce7; color: #166534; }
.carrier-badge.mobifone { background: #dbeafe; color: #1e40af; }
.carrier-badge.vinaphone { background: #ffedd5; color: #9a3412; }

.toolbar { display: flex; gap: 6px; padding: 10px 12px; }
.tool-btn { flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px; padding: 7px 10px; font-size: 12px; font-weight: 600; border-radius: 6px; border: 1px solid var(--border-color); background: #ffffff; cursor: pointer; }
.tool-btn.primary { background: var(--primary); border-color: var(--primary); color: #ffffff; }
.tool-btn.primary:hover { background: var(--primary-hover); }
.tool-btn svg { width: 13px; height: 13px; }

.leads-list-container { flex: 1; max-height: 310px; overflow-y: auto; padding: 0 12px; }
.leads-list { display: flex; flex-direction: column; gap: 6px; }
.lead-item { display: flex; align-items: center; justify-content: space-between; background: var(--card-bg); padding: 9px 12px; border-radius: 7px; border: 1px solid var(--border-color); }
.lead-info { display: flex; flex-direction: column; }
.lead-phone { font-size: 13px; font-weight: 700; color: var(--text-main); }
.lead-sub { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
.lead-carrier { font-size: 10px; font-weight: 600; color: #065f46; }
.lead-actions { display: flex; align-items: center; gap: 4px; }
.btn-lead-action { width: 28px; height: 28px; border-radius: 5px; border: 1px solid var(--border-color); background: #ffffff; color: var(--text-muted); display: flex; align-items: center; justify-content: center; cursor: pointer; text-decoration: none; }
.btn-lead-action:hover { background: #f3f4f6; color: var(--text-main); }
.btn-lead-action.zalo:hover { background: #0068ff; color: #ffffff; }
.btn-lead-action.crm:hover { background: var(--primary); color: #ffffff; }
.btn-lead-action svg { width: 13px; height: 13px; }

.empty-state { text-align: center; padding: 30px 20px; }
.empty-icon { width: 44px; height: 44px; margin: 0 auto 12px auto; border-radius: 50%; background: #f3f4f6; color: #9ca3af; display: flex; align-items: center; justify-content: center; }
.empty-icon svg { width: 22px; height: 22px; }
.empty-title { font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 4px; }
.empty-desc { font-size: 11px; color: var(--text-muted); line-height: 1.4; margin-bottom: 12px; }
.btn-rescan-empty { background: var(--primary); color: #ffffff; border: none; padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; }

.toast { position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); background: #1f2937; color: #ffffff; padding: 6px 14px; border-radius: 20px; font-size: 11px; font-weight: 500; opacity: 0; pointer-events: none; transition: all 0.2s; z-index: 100; white-space: nowrap; }
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
.popup-footer { padding: 8px 16px; border-top: 1px solid var(--border-color); background: #ffffff; display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); margin-top: 8px; }`
  },
  {
    path: 'options/options.html',
    name: 'options.html',
    category: 'options',
    language: 'html',
    description: 'Trang cài đặt chính thức của Extension, cấu hình API Token, Webhook endpoint, Affiliate ID và tùy chọn quét.',
    code: `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LeadHunter VN - Cài Đặt Hệ Thống</title>
  <link rel="stylesheet" href="options.css">
</head>
<body>
  <div class="settings-wrapper">
    <header class="settings-header">
      <div class="brand">
        <div class="brand-logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
          </svg>
        </div>
        <div>
          <h1 id="i18n-settingsTitle">Cấu hình LeadHunter VN</h1>
          <p class="subtitle">Quản lý API Token, tích hợp CRM Webhook, Affiliate ID và hành vi trích xuất</p>
        </div>
      </div>
      <div class="header-badges">
        <span class="badge-v3">Manifest V3 Secure</span>
      </div>
    </header>

    <main class="settings-body">
      <form id="optionsForm">
        <div class="card">
          <h2 class="card-title">Tích Hợp API & Hệ Thống CRM</h2>
          <div class="form-group">
            <label for="apiToken" id="i18n-apiTokenLabel">API Token / License Key</label>
            <div class="input-with-action">
              <input type="password" id="apiToken" placeholder="Nhập API Token..." autocomplete="off">
              <button type="button" class="btn-toggle-view" id="btnToggleToken">Hiện</button>
            </div>
            <span class="input-hint">Token sẽ gửi kèm trong Header Authorization: Bearer</span>
          </div>

          <div class="form-group">
            <label for="webhookUrl" id="i18n-webhookUrlLabel">Webhook URL Endpoint</label>
            <input type="url" id="webhookUrl" placeholder="https://api.yourcrm.com/v1/leads" required>
          </div>

          <div class="test-connection-row">
            <button type="button" class="btn-test" id="btnTestConnection">Kiểm tra kết nối Webhook</button>
            <div id="testResult" class="test-result-box"></div>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Marketing & Affiliate Tracking</h2>
          <div class="form-group">
            <label for="affiliateId" id="i18n-affiliateIdLabel">Affiliate ID / Mã giới thiệu</label>
            <input type="text" id="affiliateId" placeholder="Ví dụ: REF888">
            <span class="input-hint">Gắn ref vào Zalo link và xuất kèm trong CSV.</span>
          </div>
        </div>

        <div class="card">
          <h2 class="card-title">Tùy Chọn Quét & Giao Diện</h2>
          <div class="switch-row">
            <div>
              <span class="switch-title" id="i18n-autoScanLabel">Tự động quét khi tải trang</span>
              <span class="switch-desc">Tự động gắn highlight và đếm số điện thoại khi mở trang web.</span>
            </div>
            <label class="toggle-switch">
              <input type="checkbox" id="autoScan" checked>
              <span class="slider"></span>
            </label>
          </div>
        </div>

        <div class="settings-actions">
          <div class="status-msg" id="saveStatus"></div>
          <button type="submit" class="btn-save" id="btnSave">Lưu cài đặt</button>
        </div>
      </form>
    </main>
  </div>
  <script src="../config.js"></script>
  <script src="options.js"></script>
</body>
</html>`
  },
  {
    path: 'options/options.js',
    name: 'options.js',
    category: 'options',
    language: 'javascript',
    description: 'Controller Javascript của trang cài đặt: lưu trữ cấu hình an toàn vào chrome.storage.sync, kiểm tra webhook CRM và hiển thị thông báo.',
    code: `/**
 * LeadHunter VN - Options Controller (Manifest V3)
 */

document.addEventListener('DOMContentLoaded', async () => {
  const CONFIG = window.LeadHunterConfig;
  const form = document.getElementById('optionsForm');
  const inputApiToken = document.getElementById('apiToken');
  const btnToggleToken = document.getElementById('btnToggleToken');
  const inputWebhookUrl = document.getElementById('webhookUrl');
  const inputAffiliateId = document.getElementById('affiliateId');
  const checkAutoScan = document.getElementById('autoScan');
  const btnTestConnection = document.getElementById('btnTestConnection');
  const elTestResult = document.getElementById('testResult');
  const elSaveStatus = document.getElementById('saveStatus');

  applyI18n();
  await loadSavedSettings();

  btnToggleToken.addEventListener('click', () => {
    if (inputApiToken.type === 'password') {
      inputApiToken.type = 'text';
      btnToggleToken.textContent = 'Ẩn';
    } else {
      inputApiToken.type = 'password';
      btnToggleToken.textContent = 'Hiện';
    }
  });

  btnTestConnection.addEventListener('click', async () => {
    const webhookUrl = inputWebhookUrl.value.trim();
    const apiToken = inputApiToken.value.trim();
    if (!webhookUrl) return setTestResult('Vui lòng nhập Webhook URL!', false);

    setTestResult('Đang kiểm tra kết nối...', null);
    chrome.runtime.sendMessage(
      { action: CONFIG.ACTIONS.TEST_CONNECTION, payload: { webhookUrl, apiToken } },
      (res) => {
        if (res?.success) setTestResult(\`Kết nối thành công! Mã phản hồi: \${res.status}\`, true);
        else setTestResult(\`Thất bại: \${res?.error || 'Lỗi mạng'}\`, false);
      }
    );
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newSettings = {
      apiToken: inputApiToken.value.trim(),
      webhookUrl: inputWebhookUrl.value.trim(),
      affiliateId: inputAffiliateId.value.trim(),
      autoScan: checkAutoScan.checked,
      updatedAt: Date.now(),
    };

    await chrome.storage.sync.set({ [CONFIG.STORAGE_KEYS.SETTINGS]: newSettings });
    elSaveStatus.textContent = chrome.i18n?.getMessage('saveSuccess') || 'Đã lưu cài đặt thành công!';
    elSaveStatus.className = 'status-msg success';
    setTimeout(() => { elSaveStatus.textContent = ''; }, 3000);
  });

  async function loadSavedSettings() {
    chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
      const s = res?.[CONFIG.STORAGE_KEYS.SETTINGS] || CONFIG.DEFAULT_SETTINGS;
      inputApiToken.value = s.apiToken || '';
      inputWebhookUrl.value = s.webhookUrl || '';
      inputAffiliateId.value = s.affiliateId || '';
      checkAutoScan.checked = s.autoScan !== false;
    });
  }

  function setTestResult(msg, isSuccess) {
    elTestResult.textContent = msg;
    elTestResult.className = isSuccess === true ? 'test-result-box success' : isSuccess === false ? 'test-result-box error' : 'test-result-box';
  }

  function applyI18n() {
    document.querySelectorAll('[id^="i18n-"]').forEach((el) => {
      const key = el.id.replace('i18n-', '');
      if (chrome.i18n?.getMessage) {
        const msg = chrome.i18n.getMessage(key);
        if (msg) el.textContent = msg;
      }
    });
  }
});`
  },
  {
    path: 'options/options.css',
    name: 'options.css',
    category: 'options',
    language: 'css',
    description: 'Style cho trang cài đặt options: bảng điều khiển thẻ card sang trọng, các trường form với gợi ý chi tiết và toggle switch.',
    code: `/* LeadHunter VN - Options Page CSS */
:root {
  --primary: #10b981;
  --primary-hover: #059669;
  --bg-page: #f8fafc;
  --card-bg: #ffffff;
  --text-main: #0f172a;
  --text-muted: #64748b;
  --border-color: #e2e8f0;
}

body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background-color: var(--bg-page); color: var(--text-main); padding-bottom: 80px; }
.settings-wrapper { max-width: 760px; margin: 40px auto; padding: 0 20px; }
.settings-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; }
.brand { display: flex; align-items: center; gap: 14px; }
.brand-logo { width: 44px; height: 44px; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: #ffffff; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
.brand-logo svg { width: 24px; height: 24px; }
.badge-v3 { background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 20px; }
.card { background: var(--card-bg); border: 1px solid var(--border-color); border-radius: 12px; padding: 24px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); }
.card-title { font-size: 16px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; }
.form-group { margin-bottom: 18px; }
.form-group label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.input-with-action { display: flex; gap: 8px; }
input[type="text"], input[type="password"], input[type="url"] { width: 100%; padding: 10px 14px; border: 1px solid var(--border-color); border-radius: 8px; font-size: 13px; }
input:focus { border-color: var(--primary); outline: none; }
.btn-toggle-view { background: #f1f5f9; border: 1px solid var(--border-color); padding: 0 14px; border-radius: 8px; font-size: 12px; font-weight: 600; cursor: pointer; }
.input-hint { display: block; font-size: 12px; color: var(--text-muted); margin-top: 6px; }
.test-connection-row { margin-top: 14px; padding-top: 14px; border-top: 1px dashed var(--border-color); display: flex; align-items: center; gap: 12px; }
.btn-test { padding: 8px 14px; background: #ffffff; border: 1px solid var(--border-color); border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; }
.test-result-box { font-size: 12px; font-weight: 500; }
.test-result-box.success { color: #16a34a; }
.test-result-box.error { color: #dc2626; }
.switch-row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; }
.toggle-switch { position: relative; display: inline-block; width: 44px; height: 24px; }
.toggle-switch input { opacity: 0; width: 0; height: 0; }
.slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #cbd5e1; border-radius: 24px; transition: 0.2s; }
.slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; border-radius: 50%; transition: 0.2s; }
input:checked + .slider { background-color: var(--primary); }
input:checked + .slider:before { transform: translateX(20px); }
.settings-actions { display: flex; align-items: center; justify-content: flex-end; gap: 16px; margin-top: 24px; }
.btn-save { padding: 11px 24px; background-color: var(--primary); color: #ffffff; border: none; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
.btn-save:hover { background-color: var(--primary-hover); }`
  }
];
