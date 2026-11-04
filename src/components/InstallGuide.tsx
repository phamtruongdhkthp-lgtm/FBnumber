/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Download,
  FolderArchive,
  Chrome,
  ToggleRight,
  Upload,
  CheckCircle2,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { downloadExtensionZip } from '../utils/zipGenerator';

export const InstallGuide: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 border border-slate-700/60 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="flex items-center space-x-2.5 mb-3">
          <span className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Chrome className="w-5 h-5" />
          </span>
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
            Hướng Dẫn Triển Khai
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mb-2">
          Cách Cài Đặt LeadHunter VN Vào Trình Duyệt Google Chrome
        </h2>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
          Tiện ích tuân thủ tuyệt đối tiêu chuẩn <strong>Manifest V3</strong>. Bạn có thể cài đặt trực tiếp
          ở chế độ <em>"Tải tiện ích đã giải nén" (Load unpacked)</em> mà không cần đưa lên Chrome Web Store.
        </p>

        <button
          onClick={() => downloadExtensionZip()}
          className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-emerald-500/25 transition-all active:scale-95 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Tải xuống gói Extension (.zip) ngay</span>
        </button>
      </div>

      {/* 4 Step Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Step 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            1
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <FolderArchive className="w-4 h-4 text-emerald-600" />
            Tải & Giải Nén Thư Mục
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Nhấp nút <strong>"Tải trọn bộ Extension (.zip)"</strong> ở góc trên bên phải. Sau đó nhấp chuột phải
            chọn <em>"Extract All..." (Giải nén tại đây)</em> để thu được thư mục chứa <code>manifest.json</code>.
          </p>
        </div>

        {/* Step 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            2
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Chrome className="w-4 h-4 text-blue-600" />
            Mở Trang Quản Lý Tiện Ích
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Mở một tab mới trên Chrome, gõ địa chỉ: <br />
            <code className="bg-slate-100 text-slate-900 font-mono text-xs px-2 py-0.5 rounded border border-slate-200 inline-block mt-1">
              chrome://extensions/
            </code>
            <br />
            (Hoặc Menu 3 chấm &gt; Extensions &gt; Manage Extensions).
          </p>
        </div>

        {/* Step 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            3
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <ToggleRight className="w-4 h-4 text-purple-600" />
            Bật Chế Độ Nhà Phát Triển (Developer Mode)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Ở góc trên cùng bên phải của trang <code>chrome://extensions</code>, hãy gạt công tắc{' '}
            <strong>"Chế độ dành cho nhà phát triển" (Developer mode)</strong> sang vị trí BẬT (ON).
          </p>
        </div>

        {/* Step 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-black text-sm flex items-center justify-center">
            4
          </div>
          <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-emerald-600" />
            Tải Tiện Ích Đã Giải Nén (Load Unpacked)
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Bấm vào nút <strong>"Tải tiện ích đã giải nén" (Load unpacked)</strong> ở góc trái và chọn thư mục{' '}
            <code>leadhunter-extension-v3</code> mà bạn vừa giải nén ở Bước 1.
          </p>
        </div>
      </div>

      {/* Chrome Web Store Security & Policy Note */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-2">
        <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          Tiêu Chuẩn Bảo Mật Khi Đưa Lên Cửa Hàng Chrome Web Store (Publish Ready)
        </h4>
        <div className="text-xs text-slate-600 space-y-1.5 leading-relaxed">
          <p>
            • <strong>Không vi phạm Content Security Policy (CSP):</strong> Mã nguồn không dùng <code>eval()</code>,
            không import script từ CDN bên ngoài tại runtime. Toàn bộ logic chạy cục bộ từ bundle tiện ích.
          </p>
          <p>
            • <strong>Quyền hạn tối thiểu:</strong> Chỉ yêu cầu <code>storage</code> (lưu cấu hình), <code>activeTab</code>{' '}
            (tương tác tab đang duyệt), và <code>scripting</code> khi cần.
          </p>
          <p>
            • <strong>Song ngữ chuẩn Google:</strong> Tiện ích tự động nhận diện ngôn ngữ trình duyệt máy tính của người dùng
            qua thư mục <code>_locales/vi</code> và <code>_locales/en</code>.
          </p>
        </div>
      </div>
    </div>
  );
};
