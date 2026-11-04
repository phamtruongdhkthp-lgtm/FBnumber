/**
 * LeadHunter VN - Options Controller (Manifest V3)
 * Xử lý: Lưu trữ an toàn cấu hình vào chrome.storage.sync, kiểm tra webhook, song ngữ
 */

document.addEventListener('DOMContentLoaded', async () => {
  const CONFIG = window.LeadHunterConfig || {
    DEFAULT_SETTINGS: {
      apiToken: '',
      webhookUrl: 'https://webhook.site/demo-crm-leads',
      affiliateId: '',
      autoScan: true,
      highlightColor: '#10b981',
      enableZalo: true,
    },
    STORAGE_KEYS: { SETTINGS: 'leadhunter_settings' },
    ACTIONS: { TEST_CONNECTION: 'TEST_CONNECTION' },
  };

  // DOM Elements
  const form = document.getElementById('optionsForm');
  const inputApiToken = document.getElementById('apiToken');
  const btnToggleToken = document.getElementById('btnToggleToken');
  const inputWebhookUrl = document.getElementById('webhookUrl');
  const inputAffiliateId = document.getElementById('affiliateId');
  const checkAutoScan = document.getElementById('autoScan');
  const checkEnableZalo = document.getElementById('enableZalo');
  const btnTestConnection = document.getElementById('btnTestConnection');
  const elTestResult = document.getElementById('testResult');
  const elSaveStatus = document.getElementById('saveStatus');

  // 1. Áp dụng song ngữ
  applyI18n();

  // 2. Tải dữ liệu cài đặt hiện có
  await loadSavedSettings();

  // 3. Sự kiện ẩn/hiện API Token
  btnToggleToken.addEventListener('click', () => {
    if (inputApiToken.type === 'password') {
      inputApiToken.type = 'text';
      btnToggleToken.textContent = 'Ẩn';
    } else {
      inputApiToken.type = 'password';
      btnToggleToken.textContent = 'Hiện';
    }
  });

  // 4. Sự kiện Test kết nối Webhook
  btnTestConnection.addEventListener('click', async () => {
    const webhookUrl = inputWebhookUrl.value.trim();
    const apiToken = inputApiToken.value.trim();
    const affiliateId = inputAffiliateId.value.trim();

    if (!webhookUrl) {
      setTestResult('Vui lòng nhập Webhook URL trước khi kiểm tra!', false);
      return;
    }

    setTestResult('Đang kiểm tra kết nối...', null);

    chrome.runtime.sendMessage(
      {
        action: CONFIG.ACTIONS.TEST_CONNECTION,
        payload: { webhookUrl, apiToken, affiliateId },
      },
      (res) => {
        if (chrome.runtime.lastError) {
          setTestResult(`Lỗi tiện ích: ${chrome.runtime.lastError.message}`, false);
          return;
        }

        if (res && res.success) {
          setTestResult(`Kết nối thành công! Máy chủ phản hồi mã ${res.status}.`, true);
        } else {
          setTestResult(`Thất bại: ${res?.error || 'Không nhận được phản hồi từ server'}`, false);
        }
      }
    );
  });

  // 5. Sự kiện Lưu form cài đặt
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedColorEl = document.querySelector('input[name="highlightColor"]:checked');
    const highlightColor = selectedColorEl ? selectedColorEl.value : '#10b981';

    const newSettings = {
      apiToken: inputApiToken.value.trim(),
      webhookUrl: inputWebhookUrl.value.trim(),
      affiliateId: inputAffiliateId.value.trim(),
      autoScan: checkAutoScan.checked,
      enableZalo: checkEnableZalo.checked,
      highlightColor,
      updatedAt: Date.now(),
    };

    try {
      await chrome.storage.sync.set({
        [CONFIG.STORAGE_KEYS.SETTINGS]: newSettings,
      });

      showSaveMessage(chrome.i18n?.getMessage('saveSuccess') || 'Đã lưu cài đặt thành công!');
    } catch (err) {
      console.error('Lỗi khi lưu cài đặt vào chrome.storage:', err);
      showSaveMessage(`Lỗi: ${err.message}`, false);
    }
  });

  async function loadSavedSettings() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(CONFIG.STORAGE_KEYS.SETTINGS, (res) => {
        const settings = res?.[CONFIG.STORAGE_KEYS.SETTINGS] || CONFIG.DEFAULT_SETTINGS;

        inputApiToken.value = settings.apiToken || '';
        inputWebhookUrl.value = settings.webhookUrl || CONFIG.DEFAULT_SETTINGS.webhookUrl;
        inputAffiliateId.value = settings.affiliateId || '';
        checkAutoScan.checked = settings.autoScan !== false;
        checkEnableZalo.checked = settings.enableZalo !== false;

        const colorInput = document.querySelector(`input[name="highlightColor"][value="${settings.highlightColor || '#10b981'}"]`);
        if (colorInput) colorInput.checked = true;

        resolve();
      });
    });
  }

  function setTestResult(msg, isSuccess) {
    elTestResult.textContent = msg;
    if (isSuccess === true) {
      elTestResult.className = 'test-result-box success';
    } else if (isSuccess === false) {
      elTestResult.className = 'test-result-box error';
    } else {
      elTestResult.className = 'test-result-box';
    }
  }

  function showSaveMessage(msg, isSuccess = true) {
    elSaveStatus.textContent = msg;
    elSaveStatus.className = isSuccess ? 'status-msg success' : 'status-msg error';
    setTimeout(() => {
      elSaveStatus.textContent = '';
    }, 3000);
  }

  function applyI18n() {
    const i18nElements = document.querySelectorAll('[id^="i18n-"]');
    i18nElements.forEach((el) => {
      const key = el.id.replace('i18n-', '');
      if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
        const msg = chrome.i18n.getMessage(key);
        if (msg) el.textContent = msg;
      }
    });
  }
});
