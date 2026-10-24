import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateSyncDifference,
  shouldAutoPauseOnNetwork,
  formatTime,
  toPersianDigits
} from './syncEngine.ts';

test('calculateSyncDifference returns synced state within tolerance', () => {
  const result = calculateSyncDifference(100.015, 100.0, 30);
  assert.equal(result.driftMs, 15);
  assert.equal(result.needsHardSeek, false);
  assert.equal(result.adjustedRate, 1.0);
});

test('calculateSyncDifference adjusts rate for moderate drift', () => {
  // Local is behind by 100ms
  const behindResult = calculateSyncDifference(100.0, 100.1, 30, 500);
  assert.equal(behindResult.driftMs, -100);
  assert.equal(behindResult.needsHardSeek, false);
  assert.equal(behindResult.adjustedRate, 1.05);

  // Local is ahead by 150ms
  const aheadResult = calculateSyncDifference(100.15, 100.0, 30, 500);
  assert.equal(aheadResult.driftMs, 150);
  assert.equal(aheadResult.needsHardSeek, false);
  assert.equal(aheadResult.adjustedRate, 0.95);
});

test('calculateSyncDifference triggers hard seek on large drift', () => {
  const result = calculateSyncDifference(100.0, 101.5, 30, 500);
  assert.equal(result.needsHardSeek, true);
});

test('shouldAutoPauseOnNetwork respects latency and connection status', () => {
  // Enabled, normal latency
  assert.equal(shouldAutoPauseOnNetwork(12, true, true, 250), false);
  // High latency
  assert.equal(shouldAutoPauseOnNetwork(280, true, true, 250), true);
  // Partner disconnected
  assert.equal(shouldAutoPauseOnNetwork(15, false, true, 250), true);
  // Feature disabled
  assert.equal(shouldAutoPauseOnNetwork(300, true, false, 250), false);
});

test('formatTime formats seconds properly', () => {
  assert.equal(formatTime(65), '01:05');
  assert.equal(formatTime(3665), '01:01:05');
  assert.equal(formatTime(0), '00:00');
});

test('toPersianDigits converts western digits to Persian', () => {
  assert.equal(toPersianDigits('12ms'), '۱۲ms');
  assert.equal(toPersianDigits('09120005678'), '۰۹۱۲۰۰۰۵۶۷۸');
  assert.equal(toPersianDigits(14), '۱۴');
});
