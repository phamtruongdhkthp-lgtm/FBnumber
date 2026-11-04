/**
 * LeadHunter VN - Popup Controller (Manifest V3)
 * Xử lý: Hiển thị danh sách leads, Tải CSV, Sao chép, Đẩy CRM, Song ngữ
 */

document.addEventListener('DOMContentLoaded', async () => {
  const CONFIG = window.LeadHunterConfig || {
    ACTIONS: {
      GET_TAB_LEADS: 'GET_TAB_LEADS',
      RESCAN_PAGE: 'RESCAN_PAGE',
      SEND_LEAD_CRM: 'SEND_LEAD_CRM',
      SEND_BATCH_CRM: 'SEND_BATCH_CRM',
    },
    STORAGE_KEYS: { SETTINGS: 'leadhunter_settings' },
  };

  // State
  let currentLeads = [];
  let currentSettings = {};
  let currentTab = null;

  // DOM Elements
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

  // 1. Áp dụng song ngữ (i18n)
  applyI18n();

  // 2. Tải cài đặt & Trạng thái CRM
  await loadSettings();

  // 3. Lấy Tab hiện tại và danh sách Lead
  await loadTabLeads();

  // 4. Gắn sự kiện các nút
  btnOpenOptions.addEventListener('click', () => {
    if (chrome.runtime.openOptionsPage) {
      chrome.runtime.openOptionsPage();
    } else {
      window.open(chrome.runtime.getURL('options/options.html'));
    }
  });

  btnRescan.addEventListener('click', rescanCurrentTab);
  btnRescanEmpty.addEventListener('click', rescanCurrentTab);
  btnCopyAll.addEventListener('click', copyAllLeads);
  btnExportCsv.addEventListener('click', exportLeadsCsv);
  btnPushAllCrm.addEventListener('click', pushAllToCrm);

  /**
   * Áp dụng chuỗi đa ngôn ngữ theo chuẩn chrome.i18n
   */
  function applyI18n() {
    const i18nElements = document.querySelectorAll('[id^="i18n-"]');
    i18nElements.forEach((el) => {
      const key = el.id.replace('i18n-', '');
      const msg = getI18nMessage(key);
      if (msg) el.textContent = msg;
    });
  }

  function getI18nMessage(key) {
    if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
      const msg = chrome.i18n.getMessage(key);
      if (msg) return msg;
    }
    // Fallback tiếng Việt mặc định
    const fallbacks = {
      popupTitle: 'LeadHunter VN',
      leadsFound: 'Số điện thoại tìm thấy',
      btnRescan: 'Quét lại',
      btnCopyAll: 'Sao chép tất cả',
      btnExportCsv: 'Xuất CSV',
      btnSendAllCrm: 'Gửi CRM',
      noPhonesFound: 'Không tìm thấy số điện thoại',
    };
    return fallbacks[key] || '';
  }

  /**
   * Đọc cấu hình từ chrome.storage.sync
   */
  async function loadSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
        currentSettings = res?.[CONFIG.STORAGE_KEYS.SETTINGS] || {};
        updateCrmStatusUI();
        resolve();
      });
    });
  }

  /**
   * Cập nhật trạng thái kết nối CRM trên Header
   */
  function updateCrmStatusUI() {
    const dot = elCrmBadge.querySelector('.status-dot');
    if (currentSettings.apiToken && currentSettings.webhookUrl) {
      dot.className = 'status-dot connected';
      elCrmText.textContent = chrome.i18n?.getMessage('connectedStatus') || 'Đã kết nối CRM';
    } else {
      dot.className = 'status-dot disconnected';
      elCrmText.textContent = chrome.i18n?.getMessage('disconnectedStatus') || 'Chưa cấu hình CRM';
    }
  }

  /**
   * Lấy danh sách số điện thoại của Tab hiện tại
   */
  async function loadTabLeads() {
    try {
      const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tabs || tabs.length === 0) return;
      currentTab = tabs[0];

      if (currentTab.url) {
        try {
          const urlObj = new URL(currentTab.url);
          elPageDomain.textContent = urlObj.hostname;
        } catch (_) {
          elPageDomain.textContent = currentTab.url.slice(0, 20);
        }
      }

      // Gửi yêu cầu lấy leads tới Service Worker
      chrome.runtime.sendMessage(
        { action: CONFIG.ACTIONS.GET_TAB_LEADS, tabId: currentTab.id },
        (response) => {
          if (response && response.leads) {
            currentLeads = response.leads;
            renderLeads();
          } else {
            renderLeads();
          }
        }
      );
    } catch (err) {
      console.error('Lỗi khi tải dữ liệu tab:', err);
    }
  }

  /**
   * Quét lại trang hiện tại bằng cách gửi tin nhắn cho Content Script
   */
  async function rescanCurrentTab() {
    if (!currentTab?.id) return;
    btnRescan.classList.add('spinning');
    showToast('Đang quét lại trang...');

    chrome.tabs.sendMessage(
      currentTab.id,
      { action: CONFIG.ACTIONS.RESCAN_PAGE },
      (res) => {
        btnRescan.classList.remove('spinning');
        if (chrome.runtime.lastError) {
          showToast('Trang web chưa hỗ trợ quét hoặc cần tải lại tab.');
          return;
        }
        loadTabLeads();
        showToast(`Quét xong! Tìm thấy ${res?.count || 0} số.`);
      }
    );
  }

  /**
   * Render danh sách leads lên giao diện Popup
   */
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

    // Thống kê nhà mạng
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
        return `<span class="${tagClass}">${name}: ${count}</span>`;
      })
      .join('');

    // Danh sách chi tiết
    elLeadsList.innerHTML = currentLeads
      .map((lead, index) => {
        const affiliateParam = currentSettings.affiliateId ? `?ref=${encodeURIComponent(currentSettings.affiliateId)}` : '';
        const zaloUrl = `https://zalo.me/${lead.normalized}${affiliateParam}`;

        return `
        <div class="lead-item" data-index="${index}">
          <div class="lead-info">
            <span class="lead-phone">${formatPhone(lead.normalized)}</span>
            <div class="lead-sub">
              <span class="lead-carrier">${lead.carrier || 'Di động'}</span>
              <span style="font-size: 10px; color: #9ca3af;">•</span>
              <span style="font-size: 10px; color: #6b7280;">${lead.country}</span>
            </div>
          </div>
          <div class="lead-actions">
            <button class="btn-lead-action btn-copy" data-phone="${lead.normalized}" title="Sao chép số">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
            </button>
            <button class="btn-lead-action crm btn-send-crm" data-index="${index}" title="Gửi tới CRM">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </button>
            <a href="${zaloUrl}" target="_blank" rel="noopener noreferrer" class="btn-lead-action zalo" title="Mở Zalo">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 1.82.49 3.53 1.34 5L2 22l5.22-1.31c1.42.76 3.04 1.19 4.78 1.19 5.52 0 10-4.48 10-10S17.52 2 12 2z"/>
              </svg>
            </a>
            <a href="tel:${lead.normalized}" class="btn-lead-action" title="Gọi điện">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </a>
          </div>
        </div>
      `;
      })
      .join('');

    // Gắn sự kiện cho các nút trong từng dòng
    document.querySelectorAll('.btn-copy').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const phone = btn.getAttribute('data-phone');
        navigator.clipboard.writeText(phone);
        showToast(`Đã sao chép: ${phone}`);
      });
    });

    document.querySelectorAll('.btn-send-crm').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(btn.getAttribute('data-index'), 10);
        sendLeadToCrm(currentLeads[idx], btn);
      });
    });
  }

  /**
   * Gửi 1 lead cụ thể lên CRM
   */
  function sendLeadToCrm(lead, btn) {
    if (!currentSettings.webhookUrl) {
      showToast('Chưa cài đặt Webhook URL! Vui lòng vào Cài đặt.');
      return;
    }
    btn.style.opacity = '0.5';
    showToast(`Đang gửi ${lead.normalized} lên CRM...`);

    chrome.runtime.sendMessage(
      {
        action: CONFIG.ACTIONS.SEND_LEAD_CRM,
        payload: {
          ...lead,
          sourceUrl: currentTab?.url || '',
          pageTitle: currentTab?.title || '',
        },
      },
      (res) => {
        btn.style.opacity = '1';
        if (res && res.success) {
          showToast(`Đã gửi ${lead.normalized} lên CRM thành công!`);
          btn.style.color = '#10b981';
        } else {
          showToast(`Lỗi gửi CRM: ${res?.error || 'Thất bại'}`);
        }
      }
    );
  }

  /**
   * Sao chép tất cả số điện thoại vào Clipboard
   */
  function copyAllLeads() {
    if (currentLeads.length === 0) {
      showToast('Không có số nào để sao chép.');
      return;
    }
    const text = currentLeads.map((l) => l.normalized).join('\n');
    navigator.clipboard.writeText(text);
    showToast(`Đã sao chép ${currentLeads.length} số điện thoại!`);
  }

  /**
   * Xuất danh sách ra file CSV chuẩn UTF-8
   */
  function exportLeadsCsv() {
    if (currentLeads.length === 0) {
      showToast('Danh sách trống, không thể xuất CSV.');
      return;
    }

    const headers = ['STT', 'Số điện thoại', 'Chuẩn E.164', 'Quốc gia', 'Nhà mạng', 'Nguồn Website', 'Mã giới thiệu (Affiliate)', 'Thời gian'];
    const rows = currentLeads.map((l, i) => [
      i + 1,
      `"${l.normalized}"`,
      `"${l.e164}"`,
      `"${l.country}"`,
      `"${l.carrier || ''}"`,
      `"${currentTab?.url || ''}"`,
      `"${currentSettings.affiliateId || ''}"`,
      `"${new Date().toLocaleString('vi-VN')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `LeadHunter_Leads_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    showToast(`Đã xuất ${currentLeads.length} leads ra file CSV!`);
  }

  /**
   * Đẩy toàn bộ leads lên CRM
   */
  function pushAllToCrm() {
    if (currentLeads.length === 0) {
      showToast('Không có dữ liệu để gửi.');
      return;
    }
    if (!currentSettings.webhookUrl) {
      showToast('Vui lòng cài đặt Webhook URL trước.');
      return;
    }

    showToast(`Đang đẩy ${currentLeads.length} leads lên CRM...`);
    chrome.runtime.sendMessage(
      {
        action: CONFIG.ACTIONS.SEND_BATCH_CRM,
        payload: {
          leads: currentLeads,
          sourceUrl: currentTab?.url || '',
        },
      },
      (res) => {
        if (res && res.success) {
          showToast(`Đã đồng bộ thành công ${currentLeads.length} leads!`);
        } else {
          showToast(`Đồng bộ thất bại: ${res?.error || 'Lỗi mạng'}`);
        }
      }
    );
  }

  function formatPhone(phone) {
    if (phone.length === 10 && phone.startsWith('0')) {
      return `${phone.slice(0, 4)} ${phone.slice(4, 7)} ${phone.slice(7)}`;
    }
    return phone;
  }

  function showToast(msg) {
    elToast.textContent = msg;
    elToast.classList.add('show');
    clearTimeout(elToast.timer);
    elToast.timer = setTimeout(() => {
      elToast.classList.remove('show');
    }, 2400);
  }
});
