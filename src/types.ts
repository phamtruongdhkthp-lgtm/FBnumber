/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface AppSettings {
  apiToken: string;
  webhookUrl: string;
  fbLookupEndpoint: string;
  affiliateId: string;
  autoScan: boolean;
  facebookInject: boolean;
  highlightColor: string;
  enableZalo: boolean;
  enableWhatsapp: boolean;
  language: 'vi' | 'en';
}

export interface WebhookLog {
  id: string;
  timestamp: string;
  endpoint: string;
  method: 'POST';
  status: number;
  statusText: string;
  payload: any;
  headers: Record<string, string>;
  response: any;
}
