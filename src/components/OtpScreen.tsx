/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { partnerUser } from '../data/mockData';
import { toPersianDigits, getSyncEngine } from '../utils/syncEngine';
import {
  Heart,
  Shield,
  Lock,
  RefreshCw,
  Hourglass,
  Edit3,
  Wifi,
  Sparkles,
  CheckCircle2,
  Copy,
  Check,
  Share2,
  ArrowLeft,
  Play
} from 'lucide-react';

interface OtpScreenProps {
  contact: string;
  onVerified: () => void;
  onBackToEdit: () => void;
}

export const OtpScreen: React.FC<OtpScreenProps> = ({
  contact,
  onVerified,
  onBackToEdit,
}) => {
  const [digits, setDigits] = useState<string[]>(['7', '3', '9', '2', '1', '8']);
  const [timerSeconds, setTimerSeconds] = useState(102); // 01:42
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifiedReady, setIsVerifiedReady] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const roomId = 'TP-8842';
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/?room=${roomId}` : `https://twinplay.app/?room=${roomId}`;

  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return toPersianDigits(`${pad(mins)}:${pad(secs)}`);
  };

  const handleDigitChange = (index: number, val: string) => {
    const clean = val.replace(/[^0-9]/g, '');
    const newDigits = [...digits];
    newDigits[index] = clean.slice(-1);
    setDigits(newDigits);
    setErrorMessage('');

    if (clean && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleConfirm = () => {
    const code = digits.join('');
    if (code.length < 6) {
      setErrorMessage('لطفاً تمام ۶ رقم کد تأیید را وارد کنید.');
      return;
    }
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      // Connect signaling for this room
      const engine = getSyncEngine();
      engine.connectSignaling('ws://localhost:8080/ws', roomId, true);
      setIsVerifiedReady(true);
    }, 600);
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(inviteUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleFillDemoCode = () => {
    setDigits(['7', '3', '9', '2', '1', '8']);
    setErrorMessage('');
  };

  const handleResend = () => {
    setTimerSeconds(120);
    setErrorMessage('');
  };

  return (
    <div className="relative min-h-screen bg-[#10131e] text-[#e0e1f1] flex flex-col justify-between overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-[#ff3366]/10 to-[#8b5cf6]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Top Bar matching Image 3 */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        {/* Right in RTL: Brand */}
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

        {/* Left in RTL: P2P Sync Active */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-medium tracking-wide">
          <span>P2P SYNC ACTIVE</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
      </header>

      {/* Main Verification Card */}
      <main className="relative z-10 max-w-2xl mx-auto w-full px-4 py-4 flex-1 flex flex-col justify-center">
        <div className="glass-panel-elevated rounded-3xl p-6 sm:p-10 border border-white/10 relative overflow-hidden shadow-2xl">
          {/* Top Info Bar inside card */}
          <div className="flex items-center justify-between text-xs font-mono mb-8 border-b border-white/5 pb-4">
            <div className="flex items-center gap-1 text-[#d0bcff]">
              <span>P2P LATENCY:</span>
              <span className="text-amber-400 font-bold">12ms</span>
              <Wifi className="w-3.5 h-3.5 text-amber-400 inline" />
            </div>
            <div className="flex items-center gap-1.5 text-[#94a3b8]">
              <span>E2EE 256-BIT</span>
              <span className="w-2 h-2 rounded-full bg-[#8b5cf6]" />
            </div>
          </div>

          {!isVerifiedReady ? (
            <>
              {/* Central Shield with Heart */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="relative mb-3">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#ff3366]/20 to-[#8b5cf6]/20 border border-[#ff3366]/40 flex items-center justify-center shadow-lg shadow-[#ff3366]/20">
                    <Heart className="w-8 h-8 text-[#ff3366] fill-[#ff3366]" />
                  </div>
                  <div className="absolute -bottom-1 -left-1 w-6 h-6 rounded-full bg-[#8b5cf6] flex items-center justify-center text-white ring-2 ring-[#10131e]">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                </div>

                <span className="text-[11px] font-mono tracking-widest text-[#d0bcff] uppercase font-semibold mb-2">
                  TWIN-VERIFY ROOM PROTOCOL
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                  تأیید هویت و ساخت سالن اختصاصی
                </h2>
                <p className="text-xs sm:text-sm text-[#94a3b8] max-w-lg leading-relaxed">
                  کد تأیید ۶ رقمی امن به <span className="text-white font-mono font-medium">{contact}</span> ارسال شد.
                </p>
              </div>

              {/* Status Box */}
              <div className="bg-[#10131e]/90 p-4 rounded-2xl border border-white/5 flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff3366]/15 flex items-center justify-center text-[#ff3366]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">سالن سینمای اختصاصی دو نفره</h4>
                    <p className="text-xs text-[#94a3b8]">لینک دعوت اختصاصی پس از تأیید در اختیار شما قرار می‌گیرد</p>
                  </div>
                </div>

                <div className="text-left hidden sm:block">
                  <span className="text-xs font-mono font-bold text-[#d0bcff] px-2.5 py-1 rounded-lg bg-[#8b5cf6]/20 border border-[#8b5cf6]/30">
                    ROOM #TP-8842
                  </span>
                </div>
              </div>

              {/* 6-Digit Code Inputs */}
              <div className="mb-6">
                <p className="text-center text-xs text-[#94a3b8] mb-4">کد ۶ رقمی ارسال‌شده را وارد کنید:</p>
                <div className="flex justify-center items-center gap-2 sm:gap-3" dir="ltr">
                  {digits.map((digit, idx) => (
                    <div key={idx} className="relative">
                      <input
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleDigitChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={`w-11 sm:w-14 h-14 sm:h-16 text-center text-xl sm:text-2xl font-bold font-mono rounded-2xl bg-[#141722] border transition-all outline-none ${
                          digit
                            ? 'border-[#ff3366] text-white shadow-[0_0_15px_rgba(255,51,102,0.3)]'
                            : 'border-white/10 text-[#94a3b8] focus:border-[#8b5cf6]'
                        }`}
                      />
                      {!digit && (
                        <span className="absolute inset-0 flex items-center justify-center pointer-events-none text-white/30 text-xl font-bold">
                          •
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {errorMessage && (
                  <p className="text-center text-xs text-rose-400 mt-3 font-medium">{errorMessage}</p>
                )}

                {/* Quick Demo Fill Helper */}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    onClick={handleFillDemoCode}
                    className="text-xs text-[#d0bcff] hover:text-white underline underline-offset-4 transition-colors cursor-pointer"
                  >
                    پر کردن خودکار کد تست (۷۳۹۲۱۸)
                  </button>
                </div>
              </div>

              {/* Timer & Resend Row */}
              <div className="flex items-center justify-between text-xs text-[#94a3b8] mb-8 px-2">
                <button
                  onClick={handleResend}
                  disabled={timerSeconds > 0}
                  className={`flex items-center gap-1.5 transition-colors ${
                    timerSeconds === 0 ? 'text-[#ff3366] hover:underline cursor-pointer' : 'text-[#64748b] cursor-not-allowed'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>ارسال مجدد از طریق پیامک یا ایمیل</span>
                </button>

                <div className="flex items-center gap-1.5 font-mono text-[#e0e1f1]">
                  <Hourglass className="w-3.5 h-3.5 text-amber-400" />
                  <span>ارسال مجدد کد پس از: {formatTimer(timerSeconds)}</span>
                </div>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={handleConfirm}
                disabled={isVerifying}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
              >
                {isVerifying ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Heart className="w-5 h-5 fill-white" />
                    <span>تأیید هویت و ایجاد سالن اختصاصی</span>
                  </>
                )}
              </button>

              {/* Edit Contact Button */}
              <div className="text-center mt-5">
                <button
                  onClick={onBackToEdit}
                  className="inline-flex items-center gap-1.5 text-xs text-[#94a3b8] hover:text-white transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>ویرایش شماره موبایل یا نشانی ایمیل</span>
                </button>
              </div>
            </>
          ) : (
            /* Room Created & Partner Invitation Screen */
            <div className="py-2 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto mb-4 text-emerald-400 shadow-xl shadow-emerald-500/20">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
                سالن اختصاصی شما آماده شد!
              </h2>
              <p className="text-xs sm:text-sm text-[#94a3b8] max-w-md mx-auto mb-8">
                لینک دعوت زیر را کپی کرده و برای پارتنرتان بفرستید تا با یک کلیک به سالن شما ملحق شود.
              </p>

              {/* Invite Link Box */}
              <div className="bg-[#10131e] p-4 rounded-2xl border border-white/10 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-right">
                <div className="truncate w-full sm:w-auto font-mono text-xs text-[#d0bcff]" dir="ltr">
                  {inviteUrl}
                </div>

                <button
                  onClick={handleCopyLink}
                  className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all w-full sm:w-auto cursor-pointer ${
                    copiedLink
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-[#ff3366] text-white hover:bg-[#ff4f73] shadow-lg shadow-[#ff3366]/25'
                  }`}
                >
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>لینک کپی شد</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>کپی لینک دعوت</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={onVerified}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-base flex items-center justify-center gap-2.5 transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                >
                  <Play className="w-5 h-5 fill-white" />
                  <span>ورود مستقیم به سالن سینما</span>
                </button>

                <p className="text-[11px] text-[#94a3b8] pt-2">
                  پس از ورود به سالن هم می‌توانید در هر لحظه لینک سالن را مجدداً به اشتراک بگذارید.
                </p>
              </div>
            </div>
          )}

          {/* Bottom E2EE Security Footnote Box */}
          <div className="mt-8 pt-6 border-t border-white/5 bg-[#10131e]/50 p-4 rounded-2xl border border-white/5 flex items-start gap-3">
            <Lock className="w-4 h-4 text-[#8b5cf6] shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-[#94a3b8] text-right">
              <span className="font-semibold text-white block mb-0.5">اتصال رمزنگاری‌شده E2EE مستقیم (Peer-to-Peer)</span>
              ورود شما فوراً موتور همگام‌سازی فریم‌به‌فریم را آماده می‌کند. هیچ فایل ویدیویی روی سرورهای میانی ذخیره نمی‌شود.
            </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-[#94a3b8] gap-4">
        <div className="flex items-center gap-4 font-mono text-[11px] text-[#94a3b8]">
          <span>PEERS: 2 CONNECTED</span>
          <span>•</span>
          <span>SESSION HASH: #4f8a-c92e</span>
          <span>•</span>
          <span className="text-emerald-400">STREAM SYNC ENGINE: V3.8-STABLE •</span>
        </div>
        <div className="text-right text-[#d0bcff]">پلتفرم پخش همگام فیلم و سریال ویژه زوج‌ها</div>
      </footer>
    </div>
  );
};
