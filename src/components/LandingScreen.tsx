/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { currentUser, partnerUser } from '../data/mockData';
import {
  Heart,
  Shield,
  Wifi,
  Sparkles,
  ArrowLeft,
  Link as LinkIcon,
  Clock,
  ArrowRightLeft,
  Lock,
  Play,
  Film
} from 'lucide-react';

interface LandingScreenProps {
  onEnterRoom: () => void;
  onRequestOtp: (contact: string) => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({
  onEnterRoom,
  onRequestOtp,
}) => {
  const [contactInput, setContactInput] = useState('09120005678');
  const [inputError, setInputError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactInput.trim()) {
      setInputError('لطفاً شماره موبایل یا ایمیل خود را وارد کنید');
      return;
    }
    setInputError('');
    onRequestOtp(contactInput);
  };

  return (
    <div className="relative min-h-screen bg-[#10131e] text-[#e0e1f1] flex flex-col justify-between overflow-hidden">
      {/* Ambient background glow orbs */}
      <div className="absolute top-[-10%] right-[15%] w-[500px] h-[500px] rounded-full bg-[#ff3366]/10 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[10%] w-[600px] h-[600px] rounded-full bg-[#8b5cf6]/10 blur-[150px] pointer-events-none" />

      {/* Top Bar matching Image 1 */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        {/* Top Right in RTL: Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#ff3366]/25">
            <Heart className="w-5 h-5 text-white fill-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-bold tracking-tight text-white font-['Outfit']">Twinplay</span>
              <Heart className="w-4 h-4 text-[#ff3366] fill-[#ff3366]" />
            </div>
            <span className="text-[11px] text-[#94a3b8] font-medium">سینمای دونفره آنلاین</span>
          </div>
        </div>

        {/* Center: E2EE P2P Security Badge */}
        <div className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181b26]/90 border border-white/10 text-xs text-[#e0e1f1] shadow-lg">
          <Lock className="w-3.5 h-3.5 text-[#ff3366]" />
          <span>ارتباط امن سرتاسری E2EE P2P</span>
        </div>

        {/* Top Left in RTL: P2P Sync Active pill */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium tracking-wide">
          <span>P2P SYNC ACTIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      {/* Main Hero & Content Section */}
      <main className="relative z-10 max-w-6xl mx-auto w-full px-6 py-8 flex-1 flex flex-col justify-center">
        {/* Hero Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-4 font-['Outfit',var(--font-persian)]">
            سینمای دونفره اختصاصی در گرمای خانه، به دور از فاصله‌ها
          </h1>
          <p className="text-sm sm:text-base text-[#94a3b8] max-w-2xl mx-auto">
            تجربه‌ای فریم‌به‌فریم همگام با استریم فوق‌پایدار همتا‌به‌همتا (P2P)، صدای کریستالی و اشتراک زنده وبکم و تپش قلب
          </p>
        </div>

        {/* Two Main Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-16">
          {/* Card 1 (Left in Persian layout): Previous Saved Session */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden group hover:border-[#ff3366]/40 transition-all duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#8b5cf6]/10 rounded-full blur-2xl pointer-events-none" />

            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-xs text-[#94a3b8] bg-[#10131e]/70 px-3 py-1.5 rounded-xl border border-white/5">
                  <Clock className="w-3.5 h-3.5 text-[#8b5cf6]" />
                  <span>جلسه ذخیره‌شده قبلی</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>آماده همگام‌سازی</span>
                </div>
              </div>

              {/* Room Title */}
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366] animate-ping" />
                <h3 className="text-2xl font-bold text-white">سالن همیشگی: خلوت</h3>
              </div>
              <p className="text-xs text-[#94a3b8] flex items-center gap-1.5 mb-6">
                <Lock className="w-3.5 h-3.5 text-[#ff3366]" />
                <span>آخرین حضور: دیشب در حال تماشای مشترک</span>
              </p>

              {/* Connected Avatars */}
              <div className="bg-[#10131e]/80 p-4 rounded-2xl border border-white/5 flex items-center justify-between mb-6">
                {/* Partner User (Parnia) */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <img
                      src={partnerUser.avatar}
                      alt={partnerUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-400"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#10131e]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{partnerUser.name}</h4>
                    <p className="text-xs text-emerald-400">آنلاین در تهران</p>
                  </div>
                </div>

                {/* Connection Ping & Bidirectional Arrows */}
                <div className="flex flex-col items-center px-4">
                  <ArrowRightLeft className="w-5 h-5 text-[#8b5cf6] animate-pulse" />
                  <span className="text-[11px] font-mono font-semibold text-[#d0bcff] mt-1">12ms</span>
                </div>

                {/* Current User (Aryan) */}
                <div className="flex items-center gap-3 text-left">
                  <div>
                    <h4 className="text-sm font-bold text-white text-right">{currentUser.name}</h4>
                    <p className="text-xs text-[#94a3b8] text-right">میزبان سالن</p>
                  </div>
                  <div className="relative">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-[#ff3366]"
                    />
                    <span className="absolute bottom-0 left-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#10131e]" />
                  </div>
                </div>
              </div>

              {/* Movie Mini Player Preview */}
              <div className="relative rounded-2xl overflow-hidden border border-white/10 group-hover:border-[#ff3366]/30 transition-all mb-6">
                <img
                  src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80"
                  alt="La La Land"
                  className="w-full h-28 object-cover brightness-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#10131e] via-[#10131e]/50 to-transparent flex items-end p-4 justify-between">
                  <div>
                    <p className="text-[11px] text-[#ffb2ba]">آخرین فیلم بازمانده:</p>
                    <h5 className="text-base font-bold text-white">La La Land (2016)</h5>
                  </div>
                  <div className="px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-xs font-mono text-[#e0e1f1] border border-white/10">
                    02:08:00 / 01:14:28
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Button */}
            <button
              onClick={onEnterRoom}
              className="w-full py-4 px-6 rounded-2xl bg-[#1c1f2a] hover:bg-[#272935] border border-white/10 hover:border-[#ff3366]/50 text-white font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-[#ff3366]/10"
            >
              <Play className="w-4 h-4 text-[#ff3366] fill-[#ff3366]" />
              <span>ورود به سالن همیشگی ما</span>
            </button>
          </div>

          {/* Card 2 (Right in Persian layout): Login & Create New Room */}
          <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 flex flex-col justify-between border border-white/10 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#ff3366]/15 rounded-full blur-3xl pointer-events-none" />

            <div>
              {/* Header Tab */}
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#ff3366] text-white font-bold text-sm shadow-lg shadow-[#ff3366]/30 mb-8">
                <Film className="w-4 h-4" />
                <span>ورود / ساخت سالن</span>
              </div>

              {/* Title & Description */}
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">شماره موبایل یا ایمیل</h3>
              <p className="text-xs sm:text-sm text-[#94a3b8] leading-relaxed mb-6">
                جهت ورود و ساخت امن سالن تماشای دونفره، کد تأیید رمزنگاری‌شده اختصاصی برای شما ارسال می‌شود.
              </p>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#94a3b8] mb-2">
                    شماره موبایل یا آدرس ایمیل:
                  </label>
                  <input
                    type="text"
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                    dir="ltr"
                    placeholder="0912... یا partner@email.com"
                    className="w-full px-5 py-4 rounded-2xl bg-[#10131e]/90 border border-white/10 focus:border-[#ff3366] focus:ring-2 focus:ring-[#ff3366]/30 text-white font-mono text-base outline-none transition-all"
                  />
                  {inputError && (
                    <p className="text-xs text-rose-400 mt-2 font-medium">{inputError}</p>
                  )}
                </div>

                {/* Primary Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer mt-6"
                >
                  <Lock className="w-4 h-4" />
                  <span>دریافت کد تأیید ۶ رقمی</span>
                  <ArrowLeft className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>

            {/* Footnote matching Image 1 */}
            <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-xs text-[#94a3b8]">
              <LinkIcon className="w-4 h-4 text-[#8b5cf6] shrink-0" />
              <span>پس از ورود، لینک اختصاصی اتاق را تنها با یک کلیک برای پارتنرتان ارسال کنید.</span>
            </div>
          </div>
        </div>

        {/* 3 Bottom Feature Cards matching Image 1 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Feature 1 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#8b5cf6]/10 border border-[#8b5cf6]/30 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6 text-[#8b5cf6]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">کاملاً خصوصی و بدون سرور</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                هیچ فایلی در سرورها ذخیره نمی‌شود؛ اتصال مستقیم مرورگر به مرورگر (WebRTC E2EE).
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">تأخیر همگام‌سازی 12ms</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                کنترل دوطرفه پلی، پاز و اسکراب هم‌زمان در کمتر از یک پلک زدن بدون افت فریم.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="glass-panel p-6 rounded-2xl border border-white/5 hover:border-white/15 transition-all flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-[#ff3366]" />
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1">کیفیت اصلی (Lossless P2P)</h4>
              <p className="text-xs text-[#94a3b8] leading-relaxed">
                پخش مستقیم فایل بدون کاهش رزولوشن و فشرده‌سازی تا کیفیت 4K HDR با رنگ‌های واقعی.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer matching Image 1 */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94a3b8] gap-4">
        <div>© 2025 Twinplay Cinema. All rights reserved.</div>
        <div className="text-center sm:text-left text-[#d0bcff]">پلتفرم پخش همگام فیلم و سریال ویژه زوج‌ها</div>
      </footer>
    </div>
  );
};
