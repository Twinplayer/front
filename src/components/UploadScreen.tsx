/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Upload,
  FileVideo,
  FileText,
  Sliders,
  CheckCircle2,
  Film,
  Sparkles,
  Play,
  Clock,
  Layers
} from 'lucide-react';

interface UploadScreenProps {
  onLoadMovieToPlayer: (movieTitle: string) => void;
}

export const UploadScreen: React.FC<UploadScreenProps> = ({ onLoadMovieToPlayer }) => {
  const [selectedFile, setSelectedFile] = useState<string | null>('La.La.Land.2016.1080p.BluRay.x265.mp4');
  const [subtitleFile, setSubtitleFile] = useState<string | null>('La.La.Land.2016.Fa.Sub.srt');
  const [subtitleOffset, setSubtitleOffset] = useState<number>(0.0);
  const [qualityMode, setQualityMode] = useState<'4k' | '1080p' | 'p2p'>('p2p');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartMovie = (title: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onLoadMovieToPlayer(title);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#10131e] text-[#e0e1f1] pb-24 pt-4">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-xs text-[#d0bcff] font-medium mb-3">
            <Upload className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>استریم و بارگذاری اختصاصی دونفره</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            بارگذاری فایل فیلم یا انتخاب سانس
          </h1>
          <p className="text-sm text-[#94a3b8] max-w-2xl leading-relaxed">
            فایل ویدیوی دلخواهتان را بکشید و رها کنید تا از طریق ارتباط P2P بدون افت کیفیت همگام با پرنیا پخش شود.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Upload Dropzones (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Video Dropzone */}
            <div className="glass-panel-elevated rounded-3xl p-8 border-2 border-dashed border-white/15 hover:border-[#ff3366]/50 transition-all text-center relative group">
              <div className="w-16 h-16 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <FileVideo className="w-8 h-8 text-[#ff3366]" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                فایل ویدیویی فیلم یا سریال را اینجا رها کنید
              </h3>
              <p className="text-xs text-[#94a3b8] mb-4">
                پشتیبانی از فرمت‌های MP4، MKV، WebM تا کیفیت 4K UHD بدون فشرده‌سازی
              </p>

              {selectedFile ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff3366]/15 border border-[#ff3366]/40 text-xs font-mono text-[#ffb2ba]">
                  <CheckCircle2 className="w-4 h-4 text-[#ff3366]" />
                  <span>{selectedFile}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSelectedFile('Selected_Film_4K.mp4')}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
                >
                  انتخاب فایل از حافظه سیستم
                </button>
              )}
            </div>

            {/* Subtitle & Audio Offset Box */}
            <div className="glass-panel rounded-3xl p-6 border border-white/10 space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <FileText className="w-5 h-5 text-[#8b5cf6]" />
                  <h4 className="text-sm font-bold text-white">زیرنویس فارسی (.SRT / .VTT)</h4>
                </div>
                <span className="text-xs font-mono text-[#d0bcff] bg-white/5 px-3 py-1 rounded-lg">
                  {subtitleFile}
                </span>
              </div>

              {/* Subtitle Offset adjustment */}
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-[#94a3b8]">هماهنگ‌سازی زمان زیرنویس (Subtitle Offset):</span>
                  <span className="font-mono font-bold text-amber-400">
                    {subtitleOffset > 0 ? `+${subtitleOffset.toFixed(1)}s` : `${subtitleOffset.toFixed(1)}s`}
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
                  { id: '1080p', label: 'حالت سبک 1080p', sub: 'مناسب شبکه‌های محدود' },
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

            {/* Launch Button */}
            <button
              onClick={() => handleStartMovie('لا لا لند (La La Land)')}
              disabled={isProcessing}
              className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <Play className="w-5 h-5 fill-white" />
              <span>{isProcessing ? 'در حال اتصال به سالن پرنیا...' : 'شروع پخش در اتاق تماشا'}</span>
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
