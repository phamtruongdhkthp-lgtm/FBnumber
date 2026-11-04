/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileCode,
  FileText,
  FileJson,
  Copy,
  Check,
  FolderTree,
  ShieldCheck,
  Layers,
  ChevronRight,
  Code2
} from 'lucide-react';
import { EXTENSION_FILES, ExtensionFile } from '../data/extensionFiles';

export const CodeInspector: React.FC = () => {
  const [selectedFilePath, setSelectedFilePath] = useState<string>('manifest.json');
  const [copied, setCopied] = useState<boolean>(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedFile = EXTENSION_FILES.find((f) => f.path === selectedFilePath) || EXTENSION_FILES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = EXTENSION_FILES.filter((f) => {
    if (filterCategory === 'all') return true;
    return f.category === filterCategory;
  });

  const getFileIcon = (lang: string) => {
    switch (lang) {
      case 'json':
        return <FileJson className="w-4 h-4 text-amber-500" />;
      case 'javascript':
        return <FileCode className="w-4 h-4 text-emerald-500" />;
      case 'css':
        return <Code2 className="w-4 h-4 text-blue-500" />;
      case 'html':
        return <FileText className="w-4 h-4 text-rose-500" />;
      default:
        return <FileCode className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <FolderTree className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white">Kiến Trúc & Mã Nguồn Chi Tiết (Manifest V3)</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Toàn bộ mã nguồn đáp ứng 100% chuẩn Manifest V3 mới nhất: Service Worker không trạng thái (stateless),
            quyền hạn tối thiểu (least privilege), song ngữ `chrome.i18n`, tách biệt `config.js` và bảo mật theo Chrome Web Store.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1.5">
          {[
            { id: 'all', label: 'Tất cả (11 tệp)' },
            { id: 'manifest', label: 'Manifest' },
            { id: 'locales', label: 'i18n Locales' },
            { id: 'worker', label: 'Service Worker' },
            { id: 'content', label: 'Content Scripts' },
            { id: 'popup', label: 'Popup UI' },
            { id: 'options', label: 'Options UI' },
            { id: 'config', label: 'Config' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Layout: File Tree & Code Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left Column: File Tree */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              Cấu Trúc Thư Mục Extension
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              {filteredFiles.length} tệp
            </span>
          </div>

          <div className="space-y-1 overflow-y-auto max-h-[600px] pr-1">
            {filteredFiles.map((file) => {
              const isSelected = file.path === selectedFile.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFilePath(file.path)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-mono flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-200 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center space-x-2 truncate">
                    {getFileIcon(file.language)}
                    <span className="truncate">{file.path}</span>
                  </div>
                  <ChevronRight
                    className={`w-3.5 h-3.5 transition-transform ${
                      isSelected ? 'text-emerald-600 translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* V3 Checklist Card */}
          <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <span className="font-bold text-slate-800 flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Tiêu Chuẩn Manifest V3 Đạt Được:
            </span>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Chuyển đổi background page thành <strong>Service Worker</strong> module</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Không sử dụng <code>eval()</code> hoặc remote code injection</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Lưu trữ dữ liệu an toàn với <code>chrome.storage.sync</code></span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>Đa ngôn ngữ độc lập qua chuẩn thư mục <code>_locales</code></span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
          {/* File Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {getFileIcon(selectedFile.language)}
              <span className="font-mono text-xs font-bold text-slate-200">{selectedFile.path}</span>
              <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopyCode}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Đã sao chép!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Sao chép mã</span>
                </>
              )}
            </button>
          </div>

          {/* Description Banner */}
          <div className="px-4 py-2.5 bg-slate-900/40 border-b border-slate-800/80 text-xs text-slate-400 leading-relaxed">
            {selectedFile.description}
          </div>

          {/* Code Content with Line Numbers */}
          <div className="p-4 overflow-x-auto overflow-y-auto max-h-[580px] font-mono text-xs leading-relaxed text-slate-300">
            <pre className="table w-full">
              {selectedFile.code.split('\n').map((line, idx) => (
                <div key={idx} className="table-row hover:bg-slate-900/60 transition-colors">
                  <span className="table-cell pr-4 select-none text-slate-600 text-right w-10 font-sans">
                    {idx + 1}
                  </span>
                  <span className="table-cell whitespace-pre">{line}</span>
                </div>
              ))}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
