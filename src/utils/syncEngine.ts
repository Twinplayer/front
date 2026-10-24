/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PlaybackState {
  currentTime: number;
  isPlaying: boolean;
  playbackRate: number;
  lastUpdated: number;
}

export interface SyncResult {
  driftMs: number;
  needsHardSeek: boolean;
  adjustedRate: number;
  shouldPause: boolean;
}

/**
 * Calculates sync difference and micro-rate adjustment between local and remote player.
 * @param localTime Current local time in seconds
 * @param remoteTime Current remote time in seconds
 * @param toleranceMs Threshold tolerance in ms (e.g., 30ms)
 * @param maxToleranceMs Hard seek threshold in ms (e.g., 500ms)
 */
export function calculateSyncDifference(
  localTime: number,
  remoteTime: number,
  toleranceMs: number = 30,
  maxToleranceMs: number = 500
): SyncResult {
  const driftMs = Math.round((localTime - remoteTime) * 1000);
  const absDrift = Math.abs(driftMs);

  if (absDrift <= toleranceMs) {
    return {
      driftMs,
      needsHardSeek: false,
      adjustedRate: 1.0,
      shouldPause: false,
    };
  }

  if (absDrift > maxToleranceMs) {
    return {
      driftMs,
      needsHardSeek: true,
      adjustedRate: 1.0,
      shouldPause: false,
    };
  }

  // Micro-adjustment to smoothly catch up without jarring seeks
  // If local is behind (driftMs < 0), speed up slightly (1.05x).
  // If local is ahead (driftMs > 0), slow down slightly (0.95x).
  const rateAdjustment = driftMs < 0 ? 1.05 : 0.95;

  return {
    driftMs,
    needsHardSeek: false,
    adjustedRate: rateAdjustment,
    shouldPause: false,
  };
}

/**
 * Checks if auto-pause should trigger due to high ping or partner disconnect
 */
export function shouldAutoPauseOnNetwork(
  latencyMs: number,
  isPartnerConnected: boolean,
  autoPauseEnabled: boolean,
  thresholdMs: number = 250
): boolean {
  if (!autoPauseEnabled) return false;
  if (!isPartnerConnected) return true;
  return latencyMs > thresholdMs;
}

/**
 * Formats seconds into HH:MM:SS or MM:SS
 */
export function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const pad = (n: number) => n.toString().padStart(2, '0');

  if (hrs > 0) {
    return `${pad(hrs)}:${pad(mins)}:${pad(secs)}`;
  }
  return `${pad(mins)}:${pad(secs)}`;
}

/**
 * Persian number converter for authentic Persian/RTL UI
 */
export function toPersianDigits(num: number | string): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return num
    .toString()
    .replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}
