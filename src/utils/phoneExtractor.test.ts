import test from 'node:test';
import assert from 'node:assert/strict';
import {
  extractPhonesFromText,
  normalizePhone,
  detectCarrier,
  formatPhoneDisplay,
  exportToCSV,
} from './phoneExtractor';

test('normalizePhone handles standard VN mobile formats', () => {
  assert.deepEqual(normalizePhone('0912345678'), {
    normalized: '0912345678',
    e164: '+84912345678',
    country: 'VN',
  });

  assert.deepEqual(normalizePhone('+84 987 654 321'), {
    normalized: '0987654321',
    e164: '+84987654321',
    country: 'VN',
  });

  assert.deepEqual(normalizePhone('84903.112.233'), {
    normalized: '0903112233',
    e164: '+84903112233',
    country: 'VN',
  });
});

test('detectCarrier correctly identifies major Vietnam telecom operators', () => {
  assert.equal(detectCarrier('0981234567'), 'Viettel');
  assert.equal(detectCarrier('0381234567'), 'Viettel');
  assert.equal(detectCarrier('0861234567'), 'Viettel');

  assert.equal(detectCarrier('0903123456'), 'Mobifone');
  assert.equal(detectCarrier('0791234567'), 'Mobifone');

  assert.equal(detectCarrier('0913123456'), 'Vinaphone');
  assert.equal(detectCarrier('0888123456'), 'Vinaphone');

  assert.equal(detectCarrier('0923123456'), 'Vietnamobile');
  assert.equal(detectCarrier('0871234567'), 'Itelecom');
  assert.equal(detectCarrier('0551234567'), 'Wintel');
  assert.equal(detectCarrier('02438225566'), 'VNPT / Cố định Hà Nội');
});

test('extractPhonesFromText extracts multiple phone numbers from realistic marketing copy', () => {
  const sampleCopy = `
    CẦN BÁN CĂN HỘ CAO CẤP TRUNG TÂM QUẬN 1
    Liên hệ chính chủ: 0903.456.789 (Zalo/Viber)
    Hotline tư vấn 24/7: +84 988 123 456 hoặc 0912 999 888
    Văn phòng giao dịch: (028) 3822 5566
    Hỗ trợ khách hàng quốc tế: +1 415 555 2671
  `;

  const results = extractPhonesFromText(sampleCopy);
  const normalizedList = results.map(r => r.normalized);

  assert.ok(normalizedList.includes('0903456789'), 'Should find 0903.456.789');
  assert.ok(normalizedList.includes('0988123456'), 'Should find +84 988 123 456');
  assert.ok(normalizedList.includes('0912999888'), 'Should find 0912 999 888');
  assert.ok(normalizedList.includes('02838225566'), 'Should find landline 028');

  // Verify carrier detection on extracted leads
  const viettelLead = results.find(r => r.normalized === '0988123456');
  assert.equal(viettelLead?.carrier, 'Viettel');

  const mobiLead = results.find(r => r.normalized === '0903456789');
  assert.equal(mobiLead?.carrier, 'Mobifone');
  assert.equal(mobiLead?.zaloUrl, 'https://zalo.me/0903456789');
});

test('formatPhoneDisplay formats 10 digit number nicely', () => {
  assert.equal(formatPhoneDisplay('0912345678'), '0912 345 678');
});

test('exportToCSV generates valid CSV text with headers', () => {
  const samplePhones = [
    {
      raw: '0909112233',
      normalized: '0909112233',
      e164: '+84909112233',
      country: 'VN' as const,
      carrier: 'Mobifone',
      zaloUrl: 'https://zalo.me/0909112233',
      whatsappUrl: 'https://wa.me/84909112233',
      callUrl: 'tel:0909112233',
    },
  ];

  const csv = exportToCSV(samplePhones, { affiliateId: 'REF888' });
  assert.ok(csv.includes('STT,Số điện thoại,Định dạng E.164'));
  assert.ok(csv.includes('"0909112233"'));
  assert.ok(csv.includes('"Mobifone"'));
  assert.ok(csv.includes('"REF888"'));
});
