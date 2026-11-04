/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Key,
  Webhook,
  UserCheck,
  ToggleLeft,
  ToggleRight,
  Palette,
  CheckCircle2,
  AlertCircle,
  Save,
  Send,
  Eye,
  EyeOff,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { AppSettings, WebhookLog } from '../types';

interface OptionsManagerProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  onTriggerTestWebhook: (endpoint: string, token: string, affiliateId: string) => Promise<boolean>;
}

export const OptionsManager: React.FC<OptionsManagerProps> = ({
  settings,
  onUpdateSettings,
  onTriggerTestWebhook,
}) => {
  const [formData, setFormData] = useState<AppSettings>({ ...settings });
  const [showToken, setShowToken] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string }>({
    loading: false,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleChange = (field: keyof AppSettings, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTestConnection = async () => {
    if (!formData.webhookUrl) {
      setTestStatus({
        loading: false,
        success: false,
        message: 'Vui lòng nhập Webhook URL endpoint trước khi kiểm tra.',
      });
      return;
    }

    setTestStatus({ loading: true });
    try {
      const ok = await onTriggerTestWebhook(formData.webhookUrl, formData.apiToken, formData.affiliateId);
      setTestStatus({
        loading: false,
        success: ok,
        message: ok
          ? 'Kết nối máy chủ CRM thành công! Webhook đã ghi nhận gói tin POST xác thực.'
          : 'Không thể kết nối hoặc máy chủ từ chối kết nối.',
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: err.message || 'Lỗi mạng khi gọi endpoint',
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const colors = [
    { value: '#10b981', label: 'Xanh Emerald (Mặc định)', color: 'bg-emerald-500' },
    { value: '#3b82f6', label: 'Xanh Ocean', color: 'bg-blue-500' },
    { value: '#f59e0b', label: 'Cam Amber', color: 'bg-amber-500' },
    { value: '#8b5cf6', label: 'Tím Hoàng Gia', color: 'bg-purple-500' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-600" />
            Cấu Hình Hệ Thống LeadHunter VN (Options & Storage)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Mô phỏng trang <code>options/options.html</code> thực tế. Mọi thay đổi sẽ được lưu vào{' '}
            <code>chrome.storage.sync</code> và đồng bộ tức thì sang Content Script và Popup UI.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Lưu cài đặt</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: API & CRM Integration */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Key className="w-4 h-4 text-emerald-600" />
              Tích Hợp API Token & Máy Chủ CRM Webhook
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cung cấp khóa xác thực và endpoint để đẩy số điện thoại quét được vào hệ thống CRM nội bộ.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                API Token / License Key
              </label>
              <div className="relative">
                <input
                  type={showToken ? 'text' : 'password'}
                  value={formData.apiToken}
                  onChange={(e) => handleChange('apiToken', e.target.value)}
                  placeholder="Nhập API Token (ví dụ: crm_live_9a8b7c6d5e...)"
                  className="w-full text-xs font-mono p-3 pr-12 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Token sẽ được đính kèm vào Header <code>Authorization: Bearer &lt;Token&gt;</code> trong mọi request.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Webhook URL Endpoint
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={formData.webhookUrl}
                  onChange={(e) => handleChange('webhookUrl', e.target.value)}
                  placeholder="https://api.yourcrm.com/v1/leads/webhook"
                  className="flex-1 text-xs font-mono p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
                  required
                />
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testStatus.loading}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                  <span>Kiểm tra kết nối</span>
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Hệ thống hỗ trợ mọi Webhook REST API, Make.com, n8n, Zapier hoặc máy chủ CRM tùy biến.
              </p>
            </div>

            {testStatus.message && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-200 ${
                  testStatus.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-rose-50 border-rose-200 text-rose-800'
                }`}
              >
                {testStatus.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{testStatus.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Marketing & Affiliate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              Marketing & Affiliate Tracking
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Gắn mã giới thiệu vào các liên kết bán hàng và trích xuất dữ liệu.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Affiliate ID / Mã đối tác giới thiệu
            </label>
            <input
              type="text"
              value={formData.affiliateId}
              onChange={(e) => handleChange('affiliateId', e.target.value)}
              placeholder="Ví dụ: REF9988 hoặc PARTNER_PRO"
              className="w-full text-xs font-mono p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-slate-50/50"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Khi bấm nút "Chat Zalo", liên kết sẽ tự động có đuôi <code>?ref={formData.affiliateId || 'MÃ_CỦA_BẠN'}</code>.
            </p>
          </div>
        </div>

        {/* Card 3: Automation & Preferences */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Palette className="w-4 h-4 text-emerald-600" />
              Tùy Chọn Quét Tự Động & Giao Diện
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Điều chỉnh cách tiện ích hiển thị và quét DOM trên trình duyệt.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Tự động quét khi mở trang</span>
                <span className="text-[11px] text-slate-500">
                  Tự động highlight số điện thoại ngay khi trang tải xong mà không cần bấm nút quét.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('autoScan', !formData.autoScan)}
                className="text-emerald-600 focus:outline-none cursor-pointer"
              >
                {formData.autoScan ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div>
                <span className="text-xs font-bold text-slate-800 block">Hiển thị nút Chat Zalo nhanh</span>
                <span className="text-[11px] text-slate-500">
                  Thêm nút Zalo vào thanh công cụ popover nổi bên cạnh số điện thoại.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleChange('enableZalo', !formData.enableZalo)}
                className="text-emerald-600 focus:outline-none cursor-pointer"
              >
                {formData.enableZalo ? (
                  <ToggleRight className="w-8 h-8 text-emerald-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Màu sắc Highlight số điện thoại
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => handleChange('highlightColor', c.value)}
                    className={`p-3 rounded-xl border text-left flex items-center space-x-2 transition-all cursor-pointer ${
                      formData.highlightColor === c.value
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <span className={`w-4 h-4 rounded-full ${c.color} flex-shrink-0 shadow-xs`}></span>
                    <span className="text-xs font-medium text-slate-800 truncate">{c.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="text-xs">
            {saveSuccess ? (
              <span className="text-emerald-600 font-bold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Đã lưu cài đặt vào chrome.storage.sync thành công!
              </span>
            ) : (
              <span className="text-slate-500">Nhớ bấm Lưu cài đặt để áp dụng các thay đổi mới.</span>
            )}
          </div>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Lưu cấu hình</span>
          </button>
        </div>
      </form>
    </div>
  );
};
