/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenMode = 'landing' | 'otp' | 'dashboard';
export type DashboardTab = 'memories' | 'settings' | 'theater' | 'upload';

export interface PartnerProfile {
  id: string;
  name: string;
  role: string;
  status: string;
  avatar: string;
  latencyMs: number;
  emailMasked: string;
  heartRate: number;
}

export interface MovieMemory {
  id: string;
  titleEn: string;
  titleFa: string;
  date: string;
  duration: string;
  quality: string;
  sessionNumber: string;
  rating: number;
  pinnedNote?: {
    author: string;
    text: string;
  };
  reactions: {
    hearts: number;
    tears: number;
    popcorn: number;
  };
  taggedMoments?: {
    label: string;
    timecode: string;
  }[];
  posterUrl: string;
  audioPodcastDuration?: string;
  tags?: string[];
  backdropUrl?: string;
}

export interface PhotoMemory {
  id: string;
  title: string;
  caption: string;
  timestamp: string;
  imageUrl: string;
  hearts: number;
}

export interface WishlistItem {
  id: string;
  titleEn: string;
  titleFa: string;
  duration: string;
  picker: 'parnia' | 'aryan' | 'shared';
  pickerNote: string;
  statusText: string;
  actionText: string;
  posterUrl: string;
  votes: number;
}

export interface RoomSettings {
  syncToleranceMs: number;
  smartAutoPause: boolean;
  dualPlayPauseAccess: boolean;
  networkArchitecture: 'mesh' | 'turn';
  audioDucking: boolean;
  duckingPercentage: number;
  aiEchoCancellation: boolean;
  heartbeatHaptics: boolean;
  floatingEmojis: boolean;
  webcamFilter: 'warm' | 'noir' | 'cinema' | 'off';
  permanentRoomPass: string;
  roomName: string;
  ambientGlowColor: string;
  subtitleSize: 'small' | 'medium' | 'large';
  subtitleOffsetSec: number;
}
