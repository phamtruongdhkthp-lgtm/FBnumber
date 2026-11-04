/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Activity,
  Terminal,
  Trash2,
  Copy,
  Check,
  Send,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { WebhookLog } from '../types';

interface WebhookInspectorProps {
  logs: WebhookLog[];
  onClearLogs: () => void;
  onSendMockLead: () => void;
}

export const WebhookInspector: React.FC<WebhookInspectorProps> = ({
  logs,
  onClearLogs,
  onSendMockLead,
}) => {
  const [selectedLogId, setSelectedLogId] = useState<string | null>(logs[0]?.id || null);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedLog = logs.find((l) => l.id === selectedLogId) || logs[0];

  const handleCopyJson = () => {
    if (!selectedLog) return;
    navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Activity className="w-4 h-4" />
            </span>
            <h2 className="text-base font-bold text-white">Mock Webhook & CRM Activity Inspector</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Giám sát thời gian thực các gói tin POST gửi từ <code>background.js</code> (Service Worker) đến máy chủ CRM.
            Bạn có thể kiểm tra Payload JSON, Header Authorization và dữ liệu đối tác Affiliate.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onSendMockLead}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Gửi thử 1 Lead mẫu</span>
          </button>
          <button
            onClick={onClearLogs}
            disabled={logs.length === 0}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa log</span>
          </button>
        </div>
      </div>

      {logs.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Terminal className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Chưa có gói tin Webhook nào</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
            Vào tab <strong>"Trình giả lập"</strong> và bấm <strong>"Gửi tới CRM"</strong> hoặc bấm nút dưới đây để kiểm tra gói tin.
          </p>
          <button
            onClick={onSendMockLead}
            className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Bắn thử nghiệm gói tin Webhook</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Logs List on Left */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Lịch Sử Webhook Requests ({logs.length})
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Mới nhất lên đầu</span>
            </div>

            <div className="space-y-2 overflow-y-auto max-h-[500px] pr-1">
              {logs.map((log) => {
                const isSelected = selectedLog?.id === log.id;
                return (
                  <button
                    key={log.id}
                    onClick={() => setSelectedLogId(log.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all cursor-pointer ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50/50 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold font-mono text-[11px] px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {log.method}
                        </span>
                        <span className="font-bold text-slate-900 font-mono">
                          {log.status} {log.statusText}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(log.timestamp).toLocaleTimeString('vi-VN')}
                      </span>
                    </div>

                    <div className="mt-2 text-[11px] text-slate-600 truncate font-mono">
                      {log.payload?.phone ? (
                        <span>
                          Phone: <strong>{log.payload.phone}</strong> ({log.payload.carrier || 'Lead'})
                        </span>
                      ) : (
                        <span>Ping / Test Connection</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Log Detail Inspector on Right */}
          <div className="lg:col-span-7 bg-slate-950 rounded-2xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200 font-mono">Chi Tiết Gói Tin #{selectedLog.id.slice(-6)}</span>
              </div>
              <button
                onClick={handleCopyJson}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-1 transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Đã chép' : 'Sao chép JSON'}</span>
              </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto max-h-[500px] text-xs font-mono text-slate-300">
              {/* Endpoint */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Target Endpoint
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-emerald-400 break-all">
                  POST {selectedLog.endpoint}
                </div>
              </div>

              {/* Headers */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Request Headers
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <pre className="text-slate-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.headers, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Payload Body */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  JSON Payload Body
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <pre className="text-emerald-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.payload, null, 2)}
                  </pre>
                </div>
              </div>

              {/* Response */}
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Server Response ({selectedLog.status} {selectedLog.statusText})
                </span>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                  <pre className="text-slate-300 overflow-x-auto">
                    {JSON.stringify(selectedLog.response, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
