/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { getSyncEngine, toPersianDigits, FileTransferProgress } from '../utils/syncEngine';
import {
  Upload,
  FileVideo,
  FileText,
  CheckCircle2,
  Sparkles,
  Play,
  Clock,
  Layers,
  ArrowRight,
  Wifi,
  HardDrive,
  Activity,
  Check,
  AlertCircle
} from 'lucide-react';

interface UploadScreenProps {
  onLoadMovieToPlayer: (movieTitle: string, videoUrl?: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onLoadMovieToPlayer }) => {
  const syncEngine = getSyncEngine();

  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    'La.La.Land.2016.1080p.BluRay.x265.mp4'
  );
  const [selectedFileSize, setSelectedFileSize] = useState<number>(1.4 * 1024 * 1024 * 1024); // ~1.4GB
  const [videoObjectUrl, setVideoObjectUrl] = useState<string | null>(syncEngine.activeFileUrl);
  const [subtitleFile, setSubtitleFile] = useState<string | null>('La.La.Land.2016.Fa.Sub.srt');
  const [subtitleOffset, setSubtitleOffset] = useState<number>(0.0);
  const [qualityMode, setQualityMode] = useState<'4k' | '1080p' | 'p2p'>('p2p');
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // P2P Transfer & Buffer State
  const [transferProgress, setTransferProgress] = useState<FileTransferProgress>({
    percent: 22,
    speedBytesPerSec: 14.8 * 1024 * 1024,
    transferredBytes: 310 * 1024 * 1024,
    totalBytes: 1.4 * 1024 * 1024 * 1024,
    isCompleted: false,
    fileName: 'La.La.Land.2016.1080p.BluRay.x265.mp4',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const subInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Listen to real-time P2P file progress events from SyncEngine
    const unsubscribeProgress = syncEngine.onFileProgress((progress) => {
      setTransferProgress(progress);
      if (progress.fileName) {
        setSelectedFileName(progress.fileName);
        setSelectedFileSize(progress.totalBytes);
      }
    });

    const unsubscribeReady = syncEngine.onFileReady((url, name) => {
      setVideoObjectUrl(url);
      setSelectedFileName(name);
    });

    return () => {
      unsubscribeProgress();
      unsubscribeReady();
    };
  }, [syncEngine]);

  // Handle local file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      processSelectedFile(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setSelectedFileName(file.name);
    setSelectedFileSize(file.size);

    // Create local object URL for instant preview/play for the host
    const localUrl = URL.createObjectURL(file);
    setVideoObjectUrl(localUrl);

    // Transmit through SyncEngine P2P DataChannel
    syncEngine.sendFile(file, (percent, speed) => {
      setTransferProgress((prev) => ({
        ...prev,
        percent,
        speedBytesPerSec: speed,
        transferredBytes: Math.round((percent / 100) * file.size),
        totalBytes: file.size,
        isCompleted: percent >= 100,
        fileName: file.name,
      }));
    });
  };

  const handleSubtitleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSubtitleFile(e.target.files[0].name);
    }
  };

  // Buffer criteria: ready when >= 15% or local host file loaded
  const isBufferReady = transferProgress.percent >= 15 || Boolean(videoObjectUrl);

  const handleStartMovie = (title: string) => {
    if (!isBufferReady) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onLoadMovieToPlayer(title, videoObjectUrl || undefined);
    }, 400);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '۰ بایت';
    const mb = bytes / (1024 * 1024);
    if (mb > 1024) {
      return `${toPersianDigits((mb / 1024).toFixed(2))} گیگابایت`;
    }
    return `${toPersianDigits(mb.toFixed(1))} مگابایت`;
  };

  const formatSpeed = (bytesPerSec: number) => {
    const mbPerSec = bytesPerSec / (1024 * 1024);
    return `${toPersianDigits(mbPerSec.toFixed(1))} MB/s`;
  };

  return (
    <div className="min-h-screen bg-[#10131e] text-[#e0e1f1] pb-24 pt-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,.mkv,.mp4,.webm"
        className="hidden"
        onChange={handleFileChange}
      />
      <input
        ref={subInputRef}
        type="file"
        accept=".srt,.vtt"
        className="hidden"
        onChange={handleSubtitleUpload}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-xs text-[#d0bcff] font-medium mb-3">
            <Upload className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>استریم و بارگذاری اختصاصی دونفره P2P</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            بارگذاری فایل فیلم یا انتخاب سانس
          </h1>
          <p className="text-sm text-[#94a3b8] max-w-2xl leading-relaxed">
            فایل ویدیوی دلخواهتان را انتخاب یا رها کنید تا از طریق ارتباط P2P بدون افت کیفیت همگام با پرنیا پخش شود. با رسیدن بافر به ۱۵٪ می‌توانید فوراً وارد سالن شوید.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Upload Dropzones (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Dropzone */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`glass-panel-elevated rounded-3xl p-8 border-2 border-dashed transition-all text-center relative group cursor-pointer ${
                dragActive
                  ? 'border-[#ff3366] bg-[#ff3366]/5 scale-[1.01]'
                  : 'border-white/15 hover:border-[#ff3366]/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-[#ff3366]/15">
                <FileVideo className="w-8 h-8 text-[#ff3366]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                فایل ویدیویی فیلم یا سریال را اینجا رها کنید یا کلیک کنید
              </h3>
              <p className="text-xs text-[#94a3b8] mb-5">
                پشتیبانی از فرمت‌های MP4، MKV، WebM تا کیفیت 4K UHD بدون فشرده‌سازی
              </p>

              {selectedFileName ? (
                <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-2xl bg-[#ff3366]/15 border border-[#ff3366]/40 text-xs font-mono text-[#ffb2ba]">
                  <CheckCircle2 className="w-4 h-4 text-[#ff3366] shrink-0" />
                  <span className="truncate max-w-xs">{selectedFileName}</span>
                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-md text-white">
                    {formatBytes(selectedFileSize)}
                  </span>
                </div>
              ) : (
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors pointer-events-none"
                >
                  انتخاب فایل ویدیویی از حافظه سیستم
                </button>
              )}
            </div>

            {/* Real-time P2P Buffer & Transfer Status Card */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 relative overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ff3366] animate-pulse" />
                  <h4 className="text-sm font-bold text-white">وضعیت بافر و انتقال همتا‌به‌همتا (P2P)</h4>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-emerald-400 font-bold">
                    {formatSpeed(transferProgress.speedBytesPerSec)}
                  </span>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Progress Bar with Glow */}
              <div className="relative w-full h-3 bg-white/5 rounded-full overflow-hidden mb-3 border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-[#ff3366] via-[#ff4f73] to-[#8b5cf6] transition-all duration-300 rounded-full"
                  style={{ width: `${transferProgress.percent}%` }}
                />
                {/* 15% threshold indicator mark */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-amber-400/80 z-10"
                  style={{ left: '15%' }}
                  title="آستانه مجاز ورود به سالن (۱۵٪)"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-[#94a3b8] font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-sm">
                    {toPersianDigits(transferProgress.percent)}٪
                  </span>
                  <span>
                    ({formatBytes(transferProgress.transferredBytes)} از{' '}
                    {formatBytes(transferProgress.totalBytes)})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  {isBufferReady ? (
                    <span className="text-emerald-400 font-medium flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" />
                      بافر آماده پخش
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      نیازمند ۱۵٪ بافر اولیه
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Subtitle & Audio Offset Box */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#8b5cf6]" />
                  <h4 className="text-sm font-bold text-white">زیرنویس فارسی (.SRT / .VTT)</h4>
                </div>
                <button
                  type="button"
                  onClick={() => subInputRef.current?.click()}
                  className="text-xs font-mono text-[#d0bcff] bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl border border-white/10 transition-colors"
                >
                  {subtitleFile || 'انتخاب فایل زیرنویس'}
                </button>
              </div>

              {/* Subtitle Offset adjustment */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#94a3b8]">هماهنگ‌سازی زمان زیرنویس (Subtitle Offset):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {subtitleOffset > 0 ? `+${toPersianDigits(subtitleOffset.toFixed(1))}s` : `${toPersianDigits(subtitleOffset.toFixed(1))}s`}
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="5"
                  step="0.5"
                  value={subtitleOffset}
                  onChange={(e) => setSubtitleOffset(parseFloat(e.target.value))}
                  className="w-full accent-[#8b5cf6] h-1.5 bg-white/10 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#64748b] mt-1 font-mono">
                  <span>-5.0s (عقب‌تر)</span>
                  <span>0.0s (پیش‌فرض)</span>
                  <span>+5.0s (جلوتر)</span>
                </div>
              </div>
            </div>

            {/* Quality & Encoding Mode */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10">
              <h4 className="text-sm font-bold text-white mb-3">حالت استریم همتا‌به‌همتا (P2P Stream Quality)</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { id: 'p2p', label: 'کیفیت اصلی (Lossless P2P)', sub: 'بیت‌ریت کامل فایل منبع' },
                  { id: '4k', label: 'حالت بهینه‌شده 4K', sub: 'فشرده‌سازی با شتاب GPU' },
                  { id: '1080p', label: 'حالت سبک 1080p', sub: 'منامس شبکه‌های محدود' },
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setQualityMode(mode.id as any)}
                    className={`p-4 rounded-2xl text-right border transition-all ${
                      qualityMode === mode.id
                        ? 'bg-[#181b26] border-[#ff3366] shadow-[0_0_15px_rgba(255,51,102,0.2)]'
                        : 'bg-white/5 border-white/5 text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    <span className="text-xs font-bold text-white block mb-1">{mode.label}</span>
                    <span className="text-[10px] text-[#94a3b8] block">{mode.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Launch Button connected to buffer threshold */}
            <button
              onClick={() => handleStartMovie(selectedFileName ? selectedFileName.replace(/\.[^/.]+$/, '') : 'فیلم اختصاصی')}
              disabled={!isBufferReady || isProcessing}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl cursor-pointer ${
                isBufferReady
                  ? 'bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white shadow-[#ff3366]/30 hover:scale-[1.01] active:scale-[0.99]'
                  : 'bg-white/10 text-[#64748b] cursor-not-allowed border border-white/5'
              }`}
            >
              <Play className="w-5 h-5 fill-current" />
              <span>
                {isProcessing
                  ? 'در حال ورود به سالن پرنیا...'
                  : isBufferReady
                  ? `ورود به سالن پخش (${toPersianDigits(transferProgress.percent)}٪ بافر شد - آماده تماشا)`
                  : `در حال بافر اولیه P2P (${toPersianDigits(transferProgress.percent)}٪) - لطفاً صبر کنید...`}
              </span>
            </button>
          </div>

          {/* Quick Presets Ready to Play (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="glass-panel p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">سانس‌های آماده دونفره</h4>
              </div>

              <div className="space-y-3">
                {[
                  {
                    titleFa: 'لا لا لند',
                    titleEn: 'La La Land (2016)',
                    duration: '2h 08m',
                    tag: 'عاشقانه',
                    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    titleFa: 'در میان ستارگان',
                    titleEn: 'Interstellar (2014)',
                    duration: '2h 49m',
                    tag: 'علمی‌تخیلی',
                    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    titleFa: 'تلماسه ۲',
                    titleEn: 'Dune: Part Two (2024)',
                    duration: '2h 46m',
                    tag: 'حماسی',
                    image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=400&q=80',
                  },
                  {
                    titleFa: 'درباره الی',
                    titleEn: 'About Elly (2009)',
                    duration: '1h 59m',
                    tag: 'درام معمایی',
                    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleStartMovie(`${item.titleFa} (${item.titleEn.split(' ')[0]})`)}
                    className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-[#ff3366]/40 cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <img
                      src={item.image}
                      alt={item.titleFa}
                      className="w-12 h-16 rounded-xl object-cover shrink-0"
                    />
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-white group-hover:text-[#ffb2ba] transition-colors">
                        {item.titleFa}
                      </h5>
                      <p className="text-[10px] text-[#94a3b8] font-mono">{item.duration}</p>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[#d0bcff] mt-1 inline-block">
                        {item.tag}
                      </span>
                    </div>
                    <Play className="w-4 h-4 text-[#ff3366] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
