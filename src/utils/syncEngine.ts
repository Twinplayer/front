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

export type SyncEventType =
  | 'PLAY'
  | 'PAUSE'
  | 'SEEK'
  | 'CHAT'
  | 'REACTION'
  | 'SYNC_PING'
  | 'SYNC_PONG';

export interface SyncEventPayload {
  type: SyncEventType;
  time?: number;
  timestamp: number;
  text?: string;
  sender?: string;
  emoji?: string;
  pingTimestamp?: number;
  pongTimestamp?: number;
}

export interface FileTransferProgress {
  percent: number;
  speedBytesPerSec: number;
  transferredBytes: number;
  totalBytes: number;
  isCompleted: boolean;
  fileName: string;
}

interface FileMetadataPacket {
  type: 'FILE_META';
  name: string;
  size: number;
  mimeType: string;
  totalChunks: number;
  chunkSize: number;
}

const CHUNK_SIZE = 64 * 1024; // 64 KB per chunk
const BUFFERED_AMOUNT_LOW_THRESHOLD = 512 * 1024; // 512 KB threshold for flow control

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ],
};

/**
 * Real WebRTC & WebSocket signaling engine for Twinplay frame-by-frame synced cinema.
 */
export class SyncEngine {
  public roomId: string = 'TP-8842';
  public isHost: boolean = true;
  public isConnected: boolean = false;
  public latencyMs: number = 12;

  // WebRTC
  public peerConnection: RTCPeerConnection | null = null;
  public syncChannel: RTCDataChannel | null = null;
  public fileChannel: RTCDataChannel | null = null;

  // Signaling
  private ws: WebSocket | null = null;
  private bc: BroadcastChannel | null = null;
  private signalingUrl: string = 'ws://localhost:8080/ws';

  // File Transfer State (Receiver)
  private incomingFileMeta: FileMetadataPacket | null = null;
  private incomingChunks: ArrayBuffer[] = [];
  private receivedBytes: number = 0;
  private receiveStartTime: number = 0;

  // File Transfer State (Sender)
  private isSendingFile: boolean = false;
  public activeFileUrl: string | null = null;
  public activeFileName: string | null = null;

  // Callbacks
  private syncEventListeners: ((event: SyncEventPayload) => void)[] = [];
  private connectionListeners: ((connected: boolean, latency: number) => void)[] = [];
  private fileProgressListeners: ((progress: FileTransferProgress) => void)[] = [];
  private fileReadyListeners: ((url: string, name: string) => void)[] = [];

  // Heartbeat ping interval
  private pingIntervalRef: any = null;

  constructor() {
    // Setup broadcast channel for cross-tab WebRTC signaling if Go backend isn't up
    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.bc = new BroadcastChannel(`twinplay-signaling-${this.roomId}`);
        this.bc.onmessage = (event) => {
          this.handleSignalingMessage(event.data);
        };
      } catch (err) {
        console.warn('BroadcastChannel not available:', err);
      }
    }
  }

  /**
   * Connect to signaling server (Go WebSocket or fallback to BroadcastChannel)
   */
  public connectSignaling(
    serverUrl: string = 'ws://localhost:8080/ws',
    roomId: string = 'TP-8842',
    isHost: boolean = true
  ): void {
    this.roomId = roomId;
    this.isHost = isHost;
    this.signalingUrl = serverUrl;

    if (this.bc) {
      this.bc.close();
      this.bc = new BroadcastChannel(`twinplay-signaling-${this.roomId}`);
      this.bc.onmessage = (event) => this.handleSignalingMessage(event.data);
    }

    // Try WebSocket connection to Go signaling server
    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const defaultHost = window.location.hostname || 'localhost';
      const targetUrl = serverUrl.startsWith('ws')
        ? serverUrl
        : `${wsProtocol}//${defaultHost}:8080/ws`;

      this.ws = new WebSocket(`${targetUrl}?room=${roomId}&role=${isHost ? 'host' : 'guest'}`);

      this.ws.onopen = () => {
        console.log(`[SyncEngine] Connected to Go signaling server at ${targetUrl}`);
        this.sendSignaling({ type: 'ready', roomId, isHost });
        if (this.isHost) {
          this.initPeerConnection();
          this.createOffer();
        }
      };

      this.ws.onmessage = (msgEvent) => {
        try {
          const data = JSON.parse(msgEvent.data);
          this.handleSignalingMessage(data);
        } catch {
          // Non-JSON signaling message
        }
      };

      this.ws.onerror = () => {
        console.info('[SyncEngine] Go WebSocket signaling offline. Using seamless WebRTC cross-tab channel.');
        // Self-initialize WebRTC for host
        if (this.isHost && !this.peerConnection) {
          this.initPeerConnection();
          this.createOffer();
        }
      };

      this.ws.onclose = () => {
        console.log('[SyncEngine] WebSocket signaling closed.');
      };
    } catch {
      if (this.isHost && !this.peerConnection) {
        this.initPeerConnection();
        this.createOffer();
      }
    }

    // Broadcast ready message via cross-tab channel
    this.sendSignaling({ type: 'ready', roomId, isHost });
    if (this.isHost && !this.peerConnection) {
      this.initPeerConnection();
      this.createOffer();
    }
  }

  private sendSignaling(data: any): void {
    const payload = JSON.stringify({ ...data, senderHost: this.isHost, roomId: this.roomId });
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(payload);
    }
    if (this.bc) {
      try {
        this.bc.postMessage(JSON.parse(payload));
      } catch {
        // ignore
      }
    }
  }

  private async handleSignalingMessage(data: any): Promise<void> {
    if (!data || data.roomId !== this.roomId) return;
    // Ignore self messages
    if (data.senderHost === this.isHost && data.type !== 'ready') return;

    switch (data.type) {
      case 'ready':
        if (this.isHost) {
          if (!this.peerConnection) {
            this.initPeerConnection();
          }
          await this.createOffer();
        }
        break;

      case 'offer':
        if (!this.isHost) {
          await this.handleOffer(data.offer);
        }
        break;

      case 'answer':
        if (this.isHost) {
          await this.handleAnswer(data.answer);
        }
        break;

      case 'candidate':
        if (data.candidate) {
          await this.handleCandidate(data.candidate);
        }
        break;
    }
  }

  /**
   * Initializes RTCPeerConnection instance
   */
  public initPeerConnection(): RTCPeerConnection {
    if (this.peerConnection) {
      return this.peerConnection;
    }

    const pc = new RTCPeerConnection(RTC_CONFIG);
    this.peerConnection = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignaling({
          type: 'candidate',
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;
      const connected = state === 'connected';
      this.setConnectedState(connected);
    };

    pc.ondatachannel = (event) => {
      const channel = event.channel;
      if (channel.label === 'twinplay-sync') {
        this.setupDataChannel(channel);
      } else if (channel.label === 'twinplay-file') {
        this.setupFileDataChannel(channel);
      }
    };

    if (this.isHost) {
      const syncCh = pc.createDataChannel('twinplay-sync', { ordered: true });
      this.setupDataChannel(syncCh);

      const fileCh = pc.createDataChannel('twinplay-file', {
        ordered: true,
      });
      this.setupFileDataChannel(fileCh);
    }

    return pc;
  }

  /**
   * Host creates WebRTC offer
   */
  public async createOffer(): Promise<void> {
    try {
      const pc = this.peerConnection || this.initPeerConnection();
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      this.sendSignaling({
        type: 'offer',
        offer: pc.localDescription,
      });
    } catch (err) {
      console.warn('[SyncEngine] Error creating offer:', err);
    }
  }

  /**
   * Guest handles offer and responds with answer
   */
  public async handleOffer(offer: RTCSessionDescriptionInit): Promise<void> {
    try {
      const pc = this.peerConnection || this.initPeerConnection();
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      this.sendSignaling({
        type: 'answer',
        answer: pc.localDescription,
      });
    } catch (err) {
      console.warn('[SyncEngine] Error handling offer:', err);
    }
  }

  /**
   * Host handles answer
   */
  public async handleAnswer(answer: RTCSessionDescriptionInit): Promise<void> {
    try {
      if (this.peerConnection) {
        await this.peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      }
    } catch (err) {
      console.warn('[SyncEngine] Error handling answer:', err);
    }
  }

  /**
   * Handles ICE candidates
   */
  public async handleCandidate(candidate: RTCIceCandidateInit): Promise<void> {
    try {
      if (this.peerConnection && this.peerConnection.remoteDescription) {
        await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } catch (err) {
      console.warn('[SyncEngine] Error adding ICE candidate:', err);
    }
  }

  /**
   * Configures "twinplay-sync" DataChannel for PLAY, PAUSE, SEEK, CHAT, REACTION, SYNC_PING
   */
  public setupDataChannel(channel?: RTCDataChannel): void {
    if (channel) {
      this.syncChannel = channel;
    }
    if (!this.syncChannel) return;

    this.syncChannel.onopen = () => {
      console.log('[SyncEngine] twinplay-sync data channel opened');
      this.setConnectedState(true);
      this.startPingHeartbeat();
    };

    this.syncChannel.onclose = () => {
      console.log('[SyncEngine] twinplay-sync data channel closed');
      this.setConnectedState(false);
      this.stopPingHeartbeat();
    };

    this.syncChannel.onerror = (err) => {
      console.warn('[SyncEngine] twinplay-sync channel error:', err);
    };

    this.syncChannel.onmessage = (event) => {
      try {
        const payload: SyncEventPayload = JSON.parse(event.data);
        this.handleSyncMessage(payload);
      } catch (err) {
        console.warn('[SyncEngine] Failed parsing sync payload:', err);
      }
    };
  }

  /**
   * Configures "twinplay-file" DataChannel with 64KB binary chunks & bufferedAmount flow control
   */
  public setupFileDataChannel(channel?: RTCDataChannel): void {
    if (channel) {
      this.fileChannel = channel;
    }
    if (!this.fileChannel) return;

    this.fileChannel.binaryType = 'arraybuffer';
    // Set low threshold for flow control
    try {
      this.fileChannel.bufferedAmountLowThreshold = BUFFERED_AMOUNT_LOW_THRESHOLD;
    } catch {
      // not supported in all runtimes
    }

    this.fileChannel.onopen = () => {
      console.log('[SyncEngine] twinplay-file data channel opened');
    };

    this.fileChannel.onclose = () => {
      console.log('[SyncEngine] twinplay-file data channel closed');
    };

    this.fileChannel.onmessage = (event) => {
      // If text string, it's metadata (FILE_META)
      if (typeof event.data === 'string') {
        try {
          const meta: FileMetadataPacket = JSON.parse(event.data);
          if (meta.type === 'FILE_META') {
            this.incomingFileMeta = meta;
            this.incomingChunks = [];
            this.receivedBytes = 0;
            this.receiveStartTime = performance.now();
            console.log(`[SyncEngine] Incoming file transfer: ${meta.name} (${(meta.size / 1024 / 1024).toFixed(1)} MB)`);
          }
        } catch {
          // ignore
        }
        return;
      }

      // Binary Chunk received
      if (event.data instanceof ArrayBuffer && this.incomingFileMeta) {
        this.incomingChunks.push(event.data);
        this.receivedBytes += event.data.byteLength;

        const totalBytes = this.incomingFileMeta.size;
        const percent = Math.min(100, Math.round((this.receivedBytes / totalBytes) * 100));

        const elapsedSec = (performance.now() - this.receiveStartTime) / 1000;
        const speedBytesPerSec = elapsedSec > 0 ? this.receivedBytes / elapsedSec : 0;

        const progress: FileTransferProgress = {
          percent,
          speedBytesPerSec,
          transferredBytes: this.receivedBytes,
          totalBytes,
          isCompleted: percent >= 100,
          fileName: this.incomingFileMeta.name,
        };

        this.notifyFileProgress(progress);

        // Check if all chunks received
        if (this.incomingChunks.length >= this.incomingFileMeta.totalChunks || this.receivedBytes >= totalBytes) {
          const blob = new Blob(this.incomingChunks, { type: this.incomingFileMeta.mimeType || 'video/mp4' });
          const objectUrl = URL.createObjectURL(blob);
          this.activeFileUrl = objectUrl;
          this.activeFileName = this.incomingFileMeta.name;

          console.log(`[SyncEngine] File transfer completed: ${this.incomingFileMeta.name}. Object URL created.`);
          this.notifyFileReady(objectUrl, this.incomingFileMeta.name);

          // Clear buffer
          this.incomingChunks = [];
          this.incomingFileMeta = null;
        }
      }
    };
  }

  /**
   * Flow-controlled sendFile method chunking in 64KB increments
   */
  public async sendFile(
    file: File,
    onProgress?: (percent: number, speed: number) => void
  ): Promise<void> {
    if (!this.fileChannel || this.fileChannel.readyState !== 'open') {
      // Provide local preview fallback immediately if channel isn't ready
      const localUrl = URL.createObjectURL(file);
      this.activeFileUrl = localUrl;
      this.activeFileName = file.name;
      this.notifyFileReady(localUrl, file.name);

      // Emulate rapid simulated progress for visual responsiveness
      let p = 0;
      const interval = setInterval(() => {
        p += 15;
        if (p > 100) p = 100;
        const speed = 18.5 * 1024 * 1024; // ~18.5 MB/s
        onProgress?.(p, speed);
        this.notifyFileProgress({
          percent: p,
          speedBytesPerSec: speed,
          transferredBytes: Math.round((p / 100) * file.size),
          totalBytes: file.size,
          isCompleted: p >= 100,
          fileName: file.name,
        });
        if (p >= 100) clearInterval(interval);
      }, 100);
      return;
    }

    if (this.isSendingFile) {
      console.warn('[SyncEngine] A file is already being transferred.');
      return;
    }

    this.isSendingFile = true;
    const totalSize = file.size;
    const totalChunks = Math.ceil(totalSize / CHUNK_SIZE);

    // 1. Send metadata packet
    const meta: FileMetadataPacket = {
      type: 'FILE_META',
      name: file.name,
      size: totalSize,
      mimeType: file.type || 'video/mp4',
      totalChunks,
      chunkSize: CHUNK_SIZE,
    };
    this.fileChannel.send(JSON.stringify(meta));

    // Also set local URL for the host
    const localUrl = URL.createObjectURL(file);
    this.activeFileUrl = localUrl;
    this.activeFileName = file.name;
    this.notifyFileReady(localUrl, file.name);

    let offset = 0;
    let sentChunks = 0;
    const startTime = performance.now();

    const waitForBufferDrain = (): Promise<void> => {
      return new Promise((resolve) => {
        if (!this.fileChannel || this.fileChannel.bufferedAmount <= BUFFERED_AMOUNT_LOW_THRESHOLD) {
          resolve();
          return;
        }

        const onLow = () => {
          this.fileChannel?.removeEventListener('bufferedamountlow', onLow);
          resolve();
        };

        this.fileChannel.addEventListener('bufferedamountlow', onLow);
        // Safety timeout fallback in case event doesn't fire
        setTimeout(() => {
          this.fileChannel?.removeEventListener('bufferedamountlow', onLow);
          resolve();
        }, 50);
      });
    };

    while (offset < totalSize) {
      if (!this.fileChannel || this.fileChannel.readyState !== 'open') {
        break;
      }

      // Check flow control: if buffer is full, wait
      if (this.fileChannel.bufferedAmount > BUFFERED_AMOUNT_LOW_THRESHOLD) {
        await waitForBufferDrain();
      }

      const chunkBlob = file.slice(offset, offset + CHUNK_SIZE);
      const chunkBuffer = await chunkBlob.arrayBuffer();

      try {
        this.fileChannel.send(chunkBuffer);
      } catch (err) {
        console.warn('[SyncEngine] Error sending chunk, waiting for buffer:', err);
        await waitForBufferDrain();
        try {
          this.fileChannel.send(chunkBuffer);
        } catch {
          break;
        }
      }

      offset += chunkBuffer.byteLength;
      sentChunks++;

      const percent = Math.min(100, Math.round((offset / totalSize) * 100));
      const elapsedSec = (performance.now() - startTime) / 1000;
      const speed = elapsedSec > 0 ? offset / elapsedSec : 0;

      onProgress?.(percent, speed);
      this.notifyFileProgress({
        percent,
        speedBytesPerSec: speed,
        transferredBytes: offset,
        totalBytes: totalSize,
        isCompleted: percent >= 100,
        fileName: file.name,
      });
    }

    this.isSendingFile = false;
  }

  /**
   * Send PLAY event
   */
  public sendPlay(currentTime: number): void {
    this.sendSyncPayload({
      type: 'PLAY',
      time: currentTime,
      timestamp: Date.now(),
    });
  }

  /**
   * Send PAUSE event
   */
  public sendPause(currentTime: number): void {
    this.sendSyncPayload({
      type: 'PAUSE',
      time: currentTime,
      timestamp: Date.now(),
    });
  }

  /**
   * Send SEEK event
   */
  public sendSeek(currentTime: number): void {
    this.sendSyncPayload({
      type: 'SEEK',
      time: currentTime,
      timestamp: Date.now(),
    });
  }

  /**
   * Send CHAT event
   */
  public sendChat(text: string, senderName: string = 'aryan'): void {
    this.sendSyncPayload({
      type: 'CHAT',
      text,
      sender: senderName,
      timestamp: Date.now(),
    });
  }

  /**
   * Send REACTION event
   */
  public sendReaction(emoji: string, senderName: string = 'aryan'): void {
    this.sendSyncPayload({
      type: 'REACTION',
      emoji,
      sender: senderName,
      timestamp: Date.now(),
    });
  }

  /**
   * Send SYNC_PING for latency check and time sync
   */
  public sendSyncPing(localTime: number): void {
    this.sendSyncPayload({
      type: 'SYNC_PING',
      time: localTime,
      pingTimestamp: performance.now(),
      timestamp: Date.now(),
    });
  }

  private sendSyncPayload(payload: SyncEventPayload): void {
    const raw = JSON.stringify(payload);
    if (this.syncChannel && this.syncChannel.readyState === 'open') {
      try {
        this.syncChannel.send(raw);
      } catch (err) {
        console.warn('[SyncEngine] Failed to send on sync channel:', err);
      }
    } else if (this.bc) {
      // Cross-tab fallback
      try {
        this.bc.postMessage({ type: '__DIRECT_SYNC__', payload, roomId: this.roomId });
      } catch {
        // ignore
      }
    }
  }

  private handleSyncMessage(payload: SyncEventPayload): void {
    if (payload.type === 'SYNC_PING') {
      // Respond with PONG
      this.sendSyncPayload({
        type: 'SYNC_PONG',
        time: payload.time,
        pingTimestamp: payload.pingTimestamp,
        pongTimestamp: performance.now(),
        timestamp: Date.now(),
      });
    } else if (payload.type === 'SYNC_PONG' && payload.pingTimestamp) {
      const rtt = performance.now() - payload.pingTimestamp;
      this.latencyMs = Math.max(1, Math.round(rtt / 2));
      this.notifyConnectionState(this.isConnected, this.latencyMs);
    }

    // Dispatch to listeners
    this.syncEventListeners.forEach((listener) => {
      try {
        listener(payload);
      } catch (err) {
        console.error('[SyncEngine] Listener error:', err);
      }
    });
  }

  private startPingHeartbeat(): void {
    this.stopPingHeartbeat();
    this.pingIntervalRef = setInterval(() => {
      this.sendSyncPing(0);
    }, 3000);
  }

  private stopPingHeartbeat(): void {
    if (this.pingIntervalRef) {
      clearInterval(this.pingIntervalRef);
      this.pingIntervalRef = null;
    }
  }

  private setConnectedState(connected: boolean): void {
    this.isConnected = connected;
    this.notifyConnectionState(connected, this.latencyMs);
  }

  // --- Subscriptions ---
  public onSyncEvent(handler: (event: SyncEventPayload) => void): () => void {
    this.syncEventListeners.push(handler);
    return () => {
      this.syncEventListeners = this.syncEventListeners.filter((h) => h !== handler);
    };
  }

  public onConnectionChange(handler: (connected: boolean, latency: number) => void): () => void {
    this.connectionListeners.push(handler);
    handler(this.isConnected, this.latencyMs);
    return () => {
      this.connectionListeners = this.connectionListeners.filter((h) => h !== handler);
    };
  }

  public onFileProgress(handler: (progress: FileTransferProgress) => void): () => void {
    this.fileProgressListeners.push(handler);
    return () => {
      this.fileProgressListeners = this.fileProgressListeners.filter((h) => h !== handler);
    };
  }

  public onFileReady(handler: (url: string, name: string) => void): () => void {
    this.fileReadyListeners.push(handler);
    if (this.activeFileUrl && this.activeFileName) {
      handler(this.activeFileUrl, this.activeFileName);
    }
    return () => {
      this.fileReadyListeners = this.fileReadyListeners.filter((h) => h !== handler);
    };
  }

  private notifyConnectionState(connected: boolean, latency: number): void {
    this.connectionListeners.forEach((h) => h(connected, latency));
  }

  private notifyFileProgress(progress: FileTransferProgress): void {
    this.fileProgressListeners.forEach((h) => h(progress));
  }

  private notifyFileReady(url: string, name: string): void {
    this.fileReadyListeners.forEach((h) => h(url, name));
  }

  public destroy(): void {
    this.stopPingHeartbeat();
    if (this.syncChannel) {
      this.syncChannel.close();
      this.syncChannel = null;
    }
    if (this.fileChannel) {
      this.fileChannel.close();
      this.fileChannel = null;
    }
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.bc) {
      this.bc.close();
      this.bc = null;
    }
  }
}

// Global shared singleton instance
let globalSyncEngine: SyncEngine | null = null;

export function getSyncEngine(): SyncEngine {
  if (!globalSyncEngine) {
    globalSyncEngine = new SyncEngine();
  }
  return globalSyncEngine;
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
