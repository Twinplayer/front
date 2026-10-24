/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { currentUser, partnerUser } from '../data/mockData';
import { formatTime, toPersianDigits, calculateSyncDifference } from '../utils/syncEngine';
import { RoomSettings } from '../types';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  Heart,
  MessageCircle,
  Wifi,
  Sparkles,
  Shield,
  Send,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Sliders,
  Settings,
  Flame,
  Laugh,
  Check
} from 'lucide-react';

interface FloatingReaction {
  id: string;
  emoji: string;
  x: number; // percentage across screen
  y: number;
}

interface ChatMessage {
  id: string;
  sender: 'aryan' | 'parnia';
  text: string;
  time: string;
}

interface TheaterScreenProps {
  movieTitle?: string;
  settings?: RoomSettings;
  onOpenSettings?: () => void;
}

export const TheaterScreen: React.FC<TheaterScreenProps> = ({
  movieTitle = 'لا لا لند (La La Land)',
  settings,
  onOpenSettings,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(128); // default fallback seconds
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Partner Sync State
  const [partnerTime, setPartnerTime] = useState(0.5); // Slightly offset for realistic sync
  const [partnerLagMs, setPartnerLagMs] = useState(12);
  const [isPartnerConnected, setIsPartnerConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [partnerMicActive, setPartnerMicActive] = useState(true);
  const [userMicActive, setUserMicActive] = useState(true);
  const [partnerWebcamActive, setPartnerWebcamActive] = useState(true);

  // Floating Reactions
  const [floatingReactions, setFloatingReactions] = useState<FloatingReaction[]>([]);

  // Live Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'parnia',
      text: 'سلام عشقم! چیپس و پاپ‌کورنم حاضره، آماده‌ای؟ ❤️',
      time: '۲۳:۱۵',
    },
    {
      id: 'm2',
      sender: 'aryan',
      text: 'آره قربونت برم، هندزفری رو وصل کردم و کیفیته روی 4K تنظیمه 🍿',
      time: '۲۳:۱۶',
    },
    {
      id: 'm3',
      sender: 'parnia',
      text: 'صبر کن آب بیارم... خب آماده پلی کن! 🚀',
      time: '۲۳:۱۶',
    },
  ]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Reliable open cinematic sample video
  const videoSource =
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4';

  // Toggle Play / Pause with sync
  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying]);

  // Keyboard shortcut: Space for Play/Pause
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && (e.target as HTMLElement).tagName !== 'INPUT') {
        e.preventDefault();
        togglePlayPause();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlayPause]);

  // Video event handlers
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    setCurrentTime(cur);

    // Keep partner near cur with tiny micro-jitter for live feel
    const syncDiff = calculateSyncDifference(cur, partnerTime, settings?.syncToleranceMs || 30);
    if (syncDiff.needsHardSeek) {
      setPartnerTime(cur);
    } else {
      // Simulate real-time partner playhead moving alongside
      setPartnerTime(cur + 0.015);
    }

    // Buffer check
    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || 128);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setPartnerTime(newTime); // Dual seek syncs partner too
    }
  };

  const handleManualSyncWithPartner = () => {
    setIsSyncing(true);
    if (videoRef.current) {
      videoRef.current.currentTime = partnerTime;
      setCurrentTime(partnerTime);
    }
    setTimeout(() => setIsSyncing(false), 800);
  };

  // Launch Floating Reaction
  const launchReaction = (emoji: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    const x = Math.floor(Math.random() * 70) + 15; // 15% to 85% width
    const newReaction: FloatingReaction = { id, emoji, x, y: 90 };

    setFloatingReactions((prev) => [...prev, newReaction]);

    // Animate removal after 2.5 seconds
    setTimeout(() => {
      setFloatingReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2400);
  };

  // Send Chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const newMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'aryan',
      text: chatInput,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setChatInput('');

    // Trigger partner reaction or reply
    setTimeout(() => {
      launchReaction('❤️');
      const partnerReplies = [
        'دقیقاً! چقدر این صحنه خوبه 😍',
        'وای منم عاشق این موزیکم ❤️',
        'گریه‌م گرفت آریان...',
        'تپش قلبم رفته روی صد! 🥺',
      ];
      const randomReply = partnerReplies[Math.floor(Math.random() * partnerReplies.length)];
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: 'parnia',
          text: randomReply,
          time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1800);
  };

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  // Auto-hide controls
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 4000);
  };

  const bufferPercentage = duration > 0 ? (bufferedEnd / duration) * 100 : 0;
  const currentPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  const partnerPercentage = duration > 0 ? (partnerTime / duration) * 100 : 0;

  return (
    <div
      onMouseMove={handleMouseMove}
      className="relative min-h-[calc(100vh-5rem)] bg-black text-[#e0e1f1] flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Real HTML5 Video element matching user prompt instructions */}
      <div className="relative w-full flex-1 flex items-center justify-center bg-black overflow-hidden">
        <video
          ref={videoRef}
          src={videoSource}
          playsInline
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={() => setIsPlaying(false)}
          onClick={togglePlayPause}
          className="w-full h-full max-h-[82vh] object-contain cursor-pointer shadow-2xl"
        />

        {/* Ambient Projector Neon Glow behind video */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/60" />

        {/* Floating animated reactions flying upward */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-30">
          {floatingReactions.map((reaction) => (
            <div
              key={reaction.id}
              style={{ left: `${reaction.x}%` }}
              className="absolute bottom-16 text-4xl sm:text-5xl animate-[bounce_2.4s_ease-out_forwards] transform -translate-x-1/2 drop-shadow-[0_0_15px_rgba(255,51,102,0.8)]"
            >
              {reaction.emoji}
            </div>
          ))}
        </div>

        {/* Top Floating HUD: Room Name, Sync status, Partner Ping */}
        <div
          className={`absolute top-4 inset-x-4 flex items-center justify-between transition-opacity duration-300 z-30 ${
            showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          {/* Room & Movie Info */}
          <div className="flex items-center gap-3 bg-[#10131e]/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10 shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366] animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-white">{movieTitle}</h3>
              <p className="text-[10px] text-[#94a3b8]">سالن همیشگی: خلوت ما و پرنیا</p>
            </div>
          </div>

          {/* Sync Status Badge */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleManualSyncWithPartner}
              title="همگام‌سازی لحظه‌ای با تایم‌لاین پرنیا"
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
                isSyncing
                  ? 'bg-emerald-500/30 text-emerald-300 border-emerald-400'
                  : 'bg-[#181b26]/80 text-[#d0bcff] border-[#8b5cf6]/30 hover:border-[#ff3366]'
              }`}
            >
              <Wifi className="w-3.5 h-3.5 text-emerald-400" />
              <span>همگام با پرنیا ({partnerLagMs}ms)</span>
              {isSyncing && <Check className="w-3.5 h-3.5 text-emerald-400" />}
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-xl backdrop-blur-md border transition-colors relative ${
                isChatOpen
                  ? 'bg-[#ff3366] text-white border-[#ff3366]'
                  : 'bg-[#181b26]/80 text-[#94a3b8] hover:text-white border-white/10'
              }`}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#ff3366] rounded-full ring-2 ring-[#10131e]" />
            </button>
          </div>
        </div>

        {/* Partner WebCam PIP Overlay matching requirements */}
        <div className="absolute bottom-28 left-6 z-30 group">
          <div className="glass-panel-elevated p-2 rounded-2xl border border-white/15 w-44 sm:w-52 shadow-2xl relative overflow-hidden transition-all group-hover:scale-105">
            {/* Live Camera View Simulation */}
            <div className="relative h-28 sm:h-32 rounded-xl overflow-hidden bg-[#10131e] border border-white/5">
              <img
                src={partnerUser.avatar}
                alt={partnerUser.name}
                className="w-full h-full object-cover brightness-90 contrast-105"
              />

              {/* Heartbeat Badge */}
              <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[10px] text-[#ffb2ba] font-mono">
                <Heart className="w-3 h-3 text-[#ff3366] fill-[#ff3366] animate-heartbeat" />
                <span>۷۶ BPM</span>
              </div>

              {/* Audio Ducking Indicator */}
              {settings?.audioDucking && (
                <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#8b5cf6]/80 text-[9px] text-white font-medium">
                  <Mic className="w-2.5 h-2.5" />
                  <span>داکینگ فعال</span>
                </div>
              )}
            </div>

            {/* Partner Info Under Webcam */}
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-xs font-bold text-white">{partnerUser.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPartnerMicActive(!partnerMicActive)}
                  className={`p-1 rounded-md transition-colors ${
                    partnerMicActive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                  title={partnerMicActive ? 'میکروفون پرنیا وصل است' : 'قطع صدا'}
                >
                  {partnerMicActive ? <Mic className="w-3.5 h-3.5" /> : <MicOff className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Live Chat Drawer */}
        {isChatOpen && (
          <div className="absolute top-16 right-6 bottom-28 w-80 sm:w-96 glass-panel-elevated rounded-3xl border border-white/15 p-4 flex flex-col justify-between z-40 shadow-2xl animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/5">
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-[#ff3366]" />
                <h4 className="text-xs font-bold text-white">گفتگوی خصوصی با پرنیا</h4>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto py-3 space-y-3 px-1">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'aryan' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                      msg.sender === 'aryan'
                        ? 'bg-[#ff3366]/20 border border-[#ff3366]/40 text-white rounded-br-none'
                        : 'bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#e0e1f1] rounded-bl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-[#94a3b8] mt-1 font-mono">{msg.time}</span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick emoji reaction bar above input matching Stitch design */}
            <div className="flex items-center justify-between gap-1 py-2 px-1 border-t border-white/5">
              {['❤️', '🍿', '🥲', '🥺', '🔥', '👏'].map((em) => (
                <button
                  key={em}
                  type="button"
                  onClick={() => launchReaction(em)}
                  className="text-lg hover:scale-125 transition-transform p-1 cursor-pointer"
                >
                  {em}
                </button>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="flex items-center gap-2 mt-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="پیامی با عشق بنویسید..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#10131e] border border-white/10 text-xs text-white outline-none focus:border-[#ff3366]"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-[#ff3366] text-white hover:bg-[#ff4f73] transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      {/* Floating Romantic Reactions Bar directly on video screen */}
      <div
        className={`relative z-30 max-w-xl mx-auto mb-2 flex items-center justify-center gap-3 px-6 py-2 rounded-full glass-panel border border-white/10 shadow-2xl transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-xs text-[#94a3b8] font-medium hidden sm:inline">ری‌اکشن زنده:</span>
        {[
          { emoji: '❤️', label: 'عشق' },
          { emoji: '🍿', label: 'پاپ‌کورن' },
          { emoji: '🥲', label: 'اشک شوق' },
          { emoji: '🥺', label: 'احساسی' },
          { emoji: '🔥', label: 'هیجان' },
          { emoji: '👏', label: 'تشویق' },
        ].map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => launchReaction(emoji)}
            title={label}
            className="text-2xl sm:text-3xl hover:scale-130 active:scale-95 transition-transform duration-200 p-1 cursor-pointer"
          >
            {emoji}
          </button>
        ))}
      </div>

      {/* Synchronized Player Bottom Dock & Dual Scrubbing Bar */}
      <div
        className={`relative z-30 max-w-6xl mx-auto w-full px-6 pb-6 pt-2 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="glass-panel-elevated p-4 sm:p-5 rounded-3xl border border-white/15 shadow-2xl">
          {/* Dual Scrubbing Timeline with Partner Pin */}
          <div className="relative mb-4 group/scrub">
            {/* Partner Floating Scrub Pin on Timeline */}
            <div
              style={{ left: `${Math.min(100, Math.max(0, partnerPercentage))}%` }}
              className="absolute -top-7 transform -translate-x-1/2 flex flex-col items-center pointer-events-none transition-all duration-300 z-20"
            >
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#8b5cf6] text-white text-[9px] font-bold shadow-md shadow-[#8b5cf6]/40">
                <span>{partnerUser.name}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
              <div className="w-1.5 h-1.5 bg-[#8b5cf6] rotate-45 -mt-0.5" />
            </div>

            {/* Buffer & Progress Background Tracks */}
            <div className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer">
              {/* Buffer Bar */}
              <div
                style={{ width: `${bufferPercentage}%` }}
                className="absolute top-0 bottom-0 left-0 bg-white/20 transition-all duration-300"
              />
              {/* Played Progress Bar */}
              <div
                style={{ width: `${currentPercentage}%` }}
                className="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-[#8b5cf6] to-[#ff3366] transition-all"
              />
            </div>

            {/* Native Input Slider on top for smooth scrubbing */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="absolute inset-0 w-full h-2 opacity-0 cursor-pointer"
            />
          </div>

          {/* Player Controls Bar */}
          <div className="flex items-center justify-between text-white">
            {/* Left Controls in RTL: Play/Pause, Replay, Timecodes */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={togglePlayPause}
                title="پخش / توقف (Space)"
                className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] flex items-center justify-center text-white shadow-lg shadow-[#ff3366]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 fill-white" />
                ) : (
                  <Play className="w-5 h-5 fill-white translate-x-0.5" />
                )}
              </button>

              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime -= 10;
                }}
                title="۱۰ ثانیه عقب"
                className="p-2 rounded-xl hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  if (videoRef.current) videoRef.current.currentTime += 10;
                }}
                title="۱۰ ثانیه جلو"
                className="p-2 rounded-xl hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              {/* Timecode JetBrains Mono */}
              <div className="font-mono text-xs text-[#94a3b8] hidden sm:block">
                <span className="text-white font-bold">{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Center: Dual Sync indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10131e]/70 border border-white/5 text-xs text-[#94a3b8]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>پخش همگام دوطرفه فعال است</span>
            </div>

            {/* Right Controls in RTL: Volume, Settings, Fullscreen */}
            <div className="flex items-center gap-3">
              {/* Volume Slider */}
              <div className="flex items-center gap-2 group/vol">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-2 rounded-xl hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    setVolume(val);
                    setIsMuted(false);
                    if (videoRef.current) videoRef.current.volume = val;
                  }}
                  className="w-16 accent-[#ff3366] h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer hidden sm:block"
                />
              </div>

              {/* Settings shortcut */}
              {onOpenSettings && (
                <button
                  onClick={onOpenSettings}
                  title="تنظیمات سالن و P2P"
                  className="p-2 rounded-xl hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}

              {/* Fullscreen Toggle */}
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                    setIsFullscreen(true);
                  } else {
                    document.exitFullscreen().catch(() => {});
                    setIsFullscreen(false);
                  }
                }}
                className="p-2 rounded-xl hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
