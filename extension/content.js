/**
 * LeadHunter VN - Content Script (Manifest V3)
 * Tự động gắn icon lấy số điện thoại ngay cạnh tên người dùng Facebook khi lướt feed/nhóm/bình luận
 */

(function () {
  'use strict';

  const CONFIG = window.LeadHunterConfig || {
    ACTIONS: {
      LEADS_FOUND: 'LEADS_FOUND',
      SEND_LEAD_CRM: 'SEND_LEAD_CRM',
      LOOKUP_FB_PHONE: 'LOOKUP_FB_PHONE',
      RESCAN_PAGE: 'RESCAN_PAGE',
    },
    STORAGE_KEYS: { SETTINGS: 'leadhunter_settings' },
    DEFAULT_SETTINGS: { autoScan: true, facebookInject: true, highlightColor: '#10b981', affiliateId: '' },
    extractFbIdentifier: (url) => {
      if (!url) return null;
      const idMatch = url.match(/[?&]id=(\d+)/);
      if (idMatch && idMatch[1]) return idMatch[1];
      const userMatch = url.match(/\/user\/(\d+)/);
      if (userMatch && userMatch[1]) return userMatch[1];
      try {
        const parsed = new URL(url.startsWith('http') ? url : `https://facebook.com/${url.replace(/^\//, '')}`);
        const p = parsed.pathname.split('/').filter(Boolean)[0];
        if (p && !['groups', 'events', 'watch', 'marketplace', 'friends', 'notifications'].includes(p)) return p;
      } catch (_) {}
      return null;
    },
    normalizePhone: (s) => ({ normalized: s.replace(/\D/g, ''), e164: '+84' + s.replace(/\D/g, '').replace(/^0/, ''), country: 'VN' }),
    detectCarrier: () => 'Viettel',
  };

  let currentSettings = { ...CONFIG.DEFAULT_SETTINGS };
  let discoveredLeads = new Map();
  let isScanning = false;
  const isFacebook = window.location.hostname.includes('facebook.com');

  // Tải cấu hình
  if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.sync) {
    chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
      if (res && res[CONFIG.STORAGE_KEYS.SETTINGS]) {
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
    if (currentSettings.autoScan) {
      scanDomForPhones();
    }
  }

  /**
   * Quét và gắn nút lấy SĐT ngay cạnh tên người dùng trên Facebook
   */
  function scanAndInjectFacebookNames() {
    // Các selector phổ biến trên Facebook cho tên tác giả bài đăng, bình luận, thành viên nhóm
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
      // Bỏ qua nếu đã được gắn nút trước đó
      if (linkEl.dataset.leadhunterProcessed === 'true' || linkEl.closest('.leadhunter-fb-wrapper')) {
        return;
      }

      const href = linkEl.getAttribute('href') || '';
      const text = (linkEl.textContent || '').trim();

      // Chỉ xử lý nếu có tên hiển thị và có link profile hợp lệ
      if (!text || text.length < 2 || text.length > 50 || !href) return;
      if (text.includes('·') || text.includes('Thích') || text.includes('Bình luận') || text.includes('Chia sẻ')) return;

      const identifier = CONFIG.extractFbIdentifier(href);
      if (!identifier) return;

      linkEl.dataset.leadhunterProcessed = 'true';
      injectFbPhoneButton(linkEl, identifier, text, href);
    });
  }

  /**
   * Chèn nút bấm [📞 Lấy SĐT] ngay cạnh tên người dùng
   */
  function injectFbPhoneButton(targetEl, identifier, userName, profileUrl) {
    const btn = document.createElement('button');
    btn.className = 'leadhunter-fb-trigger';
    btn.type = 'button';
    btn.setAttribute('title', `Tra cứu số điện thoại của ${userName}`);
    btn.setAttribute('aria-label', `Tra cứu SĐT của ${userName}`);

    btn.innerHTML = `
      <svg class="leadhunter-icon-phone" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
      </svg>
      <span class="leadhunter-btn-label">Lấy SĐT</span>
    `;

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      // Nếu đã có số điện thoại rồi thì mở popover thao tác
      if (btn.dataset.hasPhone === 'true') {
        togglePhoneActions(btn, btn.dataset.phone, btn.dataset.carrier, userName);
        return;
      }

      // Đang tra cứu
      btn.innerHTML = `
        <svg class="leadhunter-icon-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
          <path d="M12 2a10 10 0 0 1 10 10"></path>
        </svg>
        <span>Đang lấy...</span>
      `;
      btn.disabled = true;

      // Gửi yêu cầu tra cứu tới background service worker
      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
          {
            action: CONFIG.ACTIONS.LOOKUP_FB_PHONE,
            payload: { uid: identifier, name: userName, profileUrl },
          },
          (res) => {
            btn.disabled = false;
            if (res && res.success && res.phone) {
              revealPhoneSuccess(btn, res.phone, res.carrier || 'Viettel', userName);
            } else {
              btn.innerHTML = `<span>Không tìm thấy SĐT</span>`;
              btn.classList.add('not-found');
              setTimeout(() => {
                btn.innerHTML = `
                  <svg class="leadhunter-icon-phone" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
                  </svg>
                  <span>Lấy SĐT</span>
                `;
                btn.classList.remove('not-found');
              }, 2500);
            }
          }
        );
      } else {
        // Chế độ mô phỏng demo
        setTimeout(() => {
          btn.disabled = false;
          revealPhoneSuccess(btn, '0987654321', 'Viettel', userName);
        }, 600);
      }
    });

    // Chèn ngay sau thẻ chứa tên người dùng
    targetEl.insertAdjacentElement('afterend', btn);
  }

  /**
   * Hiển thị số điện thoại thành công thành huy hiệu rực rỡ ngay cạnh tên
   */
  function revealPhoneSuccess(btn, phone, carrier, userName) {
    btn.dataset.hasPhone = 'true';
    btn.dataset.phone = phone;
    btn.dataset.carrier = carrier;
    btn.className = 'leadhunter-fb-trigger leadhunter-phone-revealed';

    const formatted = phone.length === 10 ? `${phone.slice(0, 4)}.${phone.slice(4, 7)}.${phone.slice(7)}` : phone;

    btn.innerHTML = `
      <svg class="leadhunter-icon-phone" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.45.57 3.57a1 1 0 01-.25 1.02l-2.2 2.2z"/>
      </svg>
      <strong>${formatted}</strong>
      <span class="carrier-tag">${carrier}</span>
    `;

    // Tự động mở popover thao tác nhanh khi vừa tìm thấy
    togglePhoneActions(btn, phone, carrier, userName);
  }

  /**
   * Mở popover hành động nhanh (Sao chép, Zalo, CRM)
   */
  let currentPopover = null;
  function togglePhoneActions(btn, phone, carrier, userName) {
    if (currentPopover) {
      currentPopover.remove();
      currentPopover = null;
      return;
    }

    const popover = document.createElement('div');
    popover.className = 'leadhunter-fb-popover';

    const affiliateRef = currentSettings.affiliateId ? `?ref=${encodeURIComponent(currentSettings.affiliateId)}` : '';
    const zaloUrl = `https://zalo.me/${phone}${affiliateRef}`;

    popover.innerHTML = `
      <div class="popover-title">${userName}: <strong>${phone}</strong></div>
      <div class="popover-btns">
        <button class="pop-btn copy" data-action="copy">
          <span>📋 Sao chép</span>
        </button>
        <button class="pop-btn crm" data-action="crm">
          <span>🚀 Đẩy vào CRM</span>
        </button>
        <a href="${zaloUrl}" target="_blank" rel="noopener noreferrer" class="pop-btn zalo">
          <span>💬 Nhắn Zalo</span>
        </a>
        <a href="tel:${phone}" class="pop-btn tel">
          <span>📞 Gọi ngay</span>
        </a>
      </div>
    `;

    popover.querySelector('[data-action="copy"]').addEventListener('click', (e) => {
      e.stopPropagation();
      navigator.clipboard.writeText(phone);
      popover.querySelector('[data-action="copy"] span').textContent = '✓ Đã chép!';
      setTimeout(() => popover.remove(), 1000);
    });

    popover.querySelector('[data-action="crm"]').addEventListener('click', (e) => {
      e.stopPropagation();
      const crmBtn = popover.querySelector('[data-action="crm"] span');
      crmBtn.textContent = '⏳ Đang gửi...';

      if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
          {
            action: CONFIG.ACTIONS.SEND_LEAD_CRM,
            payload: { name: userName, phone, carrier, sourceUrl: window.location.href },
          },
          (res) => {
            crmBtn.textContent = res?.success ? '✓ Đã vào CRM!' : 'Lỗi gửi CRM';
            setTimeout(() => popover.remove(), 1200);
          }
        );
      } else {
        crmBtn.textContent = '✓ Đã vào CRM!';
        setTimeout(() => popover.remove(), 1000);
      }
    });

    btn.parentElement.appendChild(popover);
    currentPopover = popover;

    // Đóng khi click ngoài
    const closeListener = (e) => {
      if (!popover.contains(e.target) && e.target !== btn) {
        popover.remove();
        currentPopover = null;
        document.removeEventListener('click', closeListener);
      }
    };
    setTimeout(() => document.addEventListener('click', closeListener), 50);
  }

  /**
   * Theo dõi DOM động khi người dùng cuộn Facebook (Infinite Scrolling)
   */
  function setupObserver() {
    let scrollTimer = null;
    const observer = new MutationObserver(() => {
      if (scrollTimer) clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        if (isFacebook && currentSettings.facebookInject !== false) {
          scanAndInjectFacebookNames();
        }
      }, 350);
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  // Quét số điện thoại trong nội dung văn bản thông thường
  function scanDomForPhones() {
    // Thuật toán quét văn bản tổng quát
  }
})();
