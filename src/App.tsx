/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ExtensionSimulator } from './components/ExtensionSimulator';
import { CodeInspector } from './components/CodeInspector';
import { OptionsManager } from './components/OptionsManager';
import { WebhookInspector } from './components/WebhookInspector';
import { InstallGuide } from './components/InstallGuide';
import { AppSettings, WebhookLog } from './types';

const INITIAL_SETTINGS: AppSettings = {
  apiToken: 'lh_live_883921af7b2c',
  webhookUrl: 'https://api.yourcrm.com/v1/leads/webhook',
  affiliateId: 'REF888',
  autoScan: true,
  highlightColor: '#10b981',
  enableZalo: true,
  enableWhatsapp: true,
  language: 'vi',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'options' | 'webhooks' | 'guide'>('simulator');
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('leadhunter_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (_) {}
    }
    return INITIAL_SETTINGS;
  });

  const [webhookLogs, setWebhookLogs] = useState<WebhookLog[]>([
    {
      id: 'log_init_01',
      timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
      endpoint: INITIAL_SETTINGS.webhookUrl,
      method: 'POST',
      status: 200,
      statusText: 'OK',
      payload: {
        leadId: 'lead_demo_0987654321',
        phone: '0987654321',
        rawPhone: '0987.654.321',
        carrier: 'Viettel',
        e164: '+84987654321',
        sourceUrl: 'https://facebook.com/groups/bds-hanoi-chinh-chu',
        pageTitle: 'Hội Mua Bán & Cho Thuê Bất Động Sản Hà Nội',
        affiliateId: 'REF888',
        timestamp: new Date(Date.now() - 1000 * 60 * 3).toISOString(),
        extensionVersion: '1.0.0',
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${INITIAL_SETTINGS.apiToken}`,
        'X-LeadHunter-Client': 'Chrome-Extension-MV3',
      },
      response: {
        success: true,
        message: 'Lead received and assigned to sales pipeline',
        crmLeadId: 'CRM_LEAD_89012',
      },
    },
  ]);

  useEffect(() => {
    localStorage.setItem('leadhunter_settings', JSON.stringify(settings));
  }, [settings]);

  const handleSendToCrm = (payload: any) => {
    const newLog: WebhookLog = {
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      endpoint: settings.webhookUrl || 'https://api.yourcrm.com/v1/leads/webhook',
      method: 'POST',
      status: 200,
      statusText: 'OK',
      payload,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${settings.apiToken}`,
        'X-LeadHunter-Client': 'Chrome-Extension-MV3',
      },
      response: {
        success: true,
        message: 'Lead received successfully by CRM',
        leadId: payload.leadId,
        carrier: payload.carrier,
        affiliate: payload.affiliateId || 'none',
      },
    };

    setWebhookLogs((prev) => [newLog, ...prev]);
  };

  const handleTriggerTestWebhook = async (endpoint: string, token: string, affiliateId: string): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 600));

    const testLog: WebhookLog = {
      id: `ping_${Date.now()}`,
      timestamp: new Date().toISOString(),
      endpoint,
      method: 'POST',
      status: 200,
      statusText: 'OK',
      payload: {
        event: 'ping',
        test: true,
        affiliateId: affiliateId || '',
        timestamp: new Date().toISOString(),
        client: 'LeadHunter VN Options Tester',
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'X-LeadHunter-Client': 'Chrome-Extension-MV3-Test',
      },
      response: {
        success: true,
        message: 'Pong! Webhook endpoint is healthy and ready to receive leads.',
      },
    };

    setWebhookLogs((prev) => [testLog, ...prev]);
    return true;
  };

  const handleSendMockLead = () => {
    handleSendToCrm({
      leadId: `mock_${Date.now()}`,
      phone: '0903123456',
      rawPhone: '0903.123.456',
      carrier: 'Mobifone',
      e164: '+84903123456',
      sourceUrl: 'https://chotot.com/tp-ho-chi-minh/xe-may',
      pageTitle: 'Thanh lý xe máy chính chủ TP.HCM',
      affiliateId: settings.affiliateId,
      timestamp: new Date().toISOString(),
    });
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        webhookCount={webhookLogs.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === 'simulator' && (
          <ExtensionSimulator
            settings={settings}
            onSendToCrm={handleSendToCrm}
            onOpenOptions={() => setActiveTab('options')}
          />
        )}

        {activeTab === 'code' && <CodeInspector />}

        {activeTab === 'options' && (
          <OptionsManager
            settings={settings}
            onUpdateSettings={setSettings}
            onTriggerTestWebhook={handleTriggerTestWebhook}
          />
        )}

        {activeTab === 'webhooks' && (
          <WebhookInspector
            logs={webhookLogs}
            onClearLogs={() => setWebhookLogs([])}
            onSendMockLead={handleSendMockLead}
          />
        )}

        {activeTab === 'guide' && <InstallGuide />}
      </main>
    </div>
  );
}
