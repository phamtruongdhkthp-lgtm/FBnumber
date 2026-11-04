import test from 'node:test';
import assert from 'node:assert/strict';
import { extractFbIdentifier, lookupPhoneByFbUid } from './fbExtractor';

test('extractFbIdentifier parses various Facebook link patterns', () => {
  // 1. profile.php?id=...
  assert.deepEqual(
    extractFbIdentifier('https://www.facebook.com/profile.php?id=100088992211001&sk=about'),
    { type: 'uid', value: '100088992211001' }
  );

  // 2. /groups/xyz/user/UID
  assert.deepEqual(
    extractFbIdentifier('https://www.facebook.com/groups/bds.hanoi/user/100077883344002/'),
    { type: 'uid', value: '100077883344002' }
  );

  // 3. /messages/t/UID
  assert.deepEqual(
    extractFbIdentifier('https://facebook.com/messages/t/100066554433003'),
    { type: 'uid', value: '100066554433003' }
  );

  // 4. Standard vanity username
  assert.deepEqual(
    extractFbIdentifier('https://www.facebook.com/nguyen.van.an'),
    { type: 'username', value: 'nguyen.van.an' }
  );

  // 5. Numeric path as UID
  assert.deepEqual(
    extractFbIdentifier('https://www.facebook.com/100088992211001'),
    { type: 'uid', value: '100088992211001' }
  );
});

test('lookupPhoneByFbUid returns expected phone and carrier', () => {
  const result = lookupPhoneByFbUid('100088992211001');
  assert.ok(result);
  assert.equal(result?.phone, '0987654321');
  assert.equal(result?.carrier, 'Viettel');
  assert.equal(result?.e164, '+84987654321');

  const usernameResult = lookupPhoneByFbUid('tran.thi.mai');
  assert.ok(usernameResult);
  assert.equal(usernameResult?.phone, '0903112233');
  assert.equal(usernameResult?.carrier, 'Mobifone');
});

test('lookupPhoneByFbUid deterministically hashes unknown numeric UID to valid VN phone', () => {
  const randomUid = '100099988877766';
  const result = lookupPhoneByFbUid(randomUid);
  assert.ok(result);
  assert.equal(result?.phone.length, 10);
  assert.ok(result?.phone.startsWith('0'));
  assert.ok(result?.carrier);
});
