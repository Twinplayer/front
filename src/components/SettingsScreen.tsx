/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RoomSettings } from '../types';
import { defaultRoomSettings, partnerUser } from '../data/mockData';
import {
  Save,
  RotateCcw,
  Wifi,
  Radio,
  Sliders,
  Volume2,
  Mic,
  Heart,
  Shield,
  Lock,
  PauseCircle,
  Users,
  Check,
  CheckCircle2,
  Info,
  ChevronLeft
} from 'lucide-react';

interface SettingsScreenProps {
  onSave?: (newSettings: RoomSettings) => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onSave }) => {
  const [settings, setSettings] = useState<RoomSettings>(defaultRoomSettings);
  const [activeTab, setActiveTab] = useState<
    'sync' | 'audio' | 'haptics' | 'profile' | 'player'
  >('sync');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = () => {
    if (onSave) onSave(settings);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handleReset = () => {
    setSettings(defaultRoomSettings);
  };

  return (
    <div className="min-h-screen bg-[#10131e] text-[#e0e1f1] pb-24 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon & Actions matching Image 11 */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs px-3 py-1 rounded-full bg-[#ff3366] text-white font-bold">
                اتاق اختصاصی
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
                <span>تنظیمات سالن و ارتباط دونفره</span>
                <Heart className="w-5 h-5 text-[#ff3366] fill-[#ff3366]" />
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-[#94a3b8] max-w-3xl leading-relaxed">
              شخصی‌سازی همگام‌سازی فریم‌به‌فریم، استریم اختصاصی P2P، اکوکانسلیشن صوتی، افکت‌های تپش قلب و هویت سینمایی شما و پرنیا
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1c1f2a] hover:bg-[#272935] border border-white/10 text-white font-semibold text-xs sm:text-sm transition-all"
            >
              <RotateCcw className="w-4 h-4 text-[#94a3b8]" />
              <span>بازنشانی پیش‌فرض</span>
            </button>

            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-xs sm:text-sm transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              {savedNotice ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-white" />
                  <span>تغییرات ذخیره شد!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>ذخیره تغییرات</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 2-Column Grid matching Image 11 (Main Settings + Right Categories Sidebar in RTL) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Content Area (8 cols) */}
          <div className="lg:col-span-8 order-2 lg:order-1">
            {activeTab === 'sync' && (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 relative overflow-hidden">
                {/* Header of Section matching Image 11 */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#ff3366]/10 border border-[#ff3366]/30 flex items-center justify-center">
                      <Radio className="w-5 h-5 text-[#ff3366]" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <span>موتور همگام‌سازی و اتصال P2P دونفره</span>
                      </h2>
                      <p className="text-xs text-[#94a3b8] mt-0.5">
                        تنظیمات دقیق همگام‌سازی زمان فیلم و رفتار پخش مشترک
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-mono font-semibold px-3 py-1 rounded-xl bg-[#8b5cf6]/20 text-[#d0bcff] border border-[#8b5cf6]/30">
                    WebRTC v3.8
                  </span>
                </div>

                {/* 1. Sync Tolerance Slider */}
                <div className="bg-[#141722]/80 rounded-2xl p-6 border border-white/5 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-white">آستانه تلرانس همگام‌سازی (Sync Tolerance)</h3>
                      <Info className="w-4 h-4 text-[#8b5cf6] cursor-help" title="حداکثر اختلاف زمانی مجاز قبل از تصحیح خودکار سرعت" />
                    </div>
                    <span className="text-xs font-bold font-mono px-3 py-1 rounded-xl bg-[#ff3366]/20 text-[#ffb2ba] border border-[#ff3366]/30">
                      {settings.syncToleranceMs} میلی‌ثانیه
                    </span>
                  </div>

                  <p className="text-xs text-[#94a3b8] mb-6 leading-relaxed">
                    در صورت اختلاف بیشتر از این عدد، پخش فیلم با تنظیم سرعت میکروثانیه‌ای به پرنیا می‌رسد تا هماهنگی دقیق حفظ شود.
                  </p>

                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    value={settings.syncToleranceMs}
                    onChange={(e) =>
                      setSettings({ ...settings, syncToleranceMs: Number(e.target.value) })
                    }
                    className="w-full accent-[#ff3366] cursor-pointer h-2 bg-white/10 rounded-lg appearance-none"
                  />

                  <div className="flex justify-between text-[11px] text-[#94a3b8] mt-3">
                    <span>10ms (میلی‌متری و سینک صدم ثانیه)</span>
                    <span className="text-white font-medium">50ms (حالت استاندارد)</span>
                    <span>100ms (شبکه‌های ضعیف)</span>
                  </div>
                </div>

                {/* 2. Smart Auto-Pause Toggle */}
                <div className="bg-[#141722]/80 rounded-2xl p-6 border border-white/5 mb-6 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 mt-1">
                      <PauseCircle className="w-5 h-5 text-[#8b5cf6]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        توقف خودکار فیلم در صورت قطعی اینترنت پرنیا (Smart Auto-Pause)
                      </h3>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        به محض افزایش پینگ بالای ۲۵۰ میلی‌ثانیه یا قطع موقت اتصال پرنیا، فیلم برای شما متوقف می‌شود تا هیچ دیالوگی را تنهایی تماشا نکنید.
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    onClick={() =>
                      setSettings({ ...settings, smartAutoPause: !settings.smartAutoPause })
                    }
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 cursor-pointer ${
                      settings.smartAutoPause ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                        settings.smartAutoPause ? '-translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 3. Dual Play/Pause Access Toggle */}
                <div className="bg-[#141722]/80 rounded-2xl p-6 border border-white/5 mb-8 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 mt-1">
                      <Users className="w-5 h-5 text-[#ff3366]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">
                        مجوز کنترل مشترک پخش (Dual Play/Pause Access)
                      </h3>
                      <p className="text-xs text-[#94a3b8] leading-relaxed">
                        هر دو نفر اختیار فشردن کلید Space یا کلیک بر روی تایم‌لاین برای جلو/عقب زدن فیلم را به طور برابر دارند.
                      </p>
                    </div>
                  </div>

                  {/* Switch Toggle */}
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        dualPlayPauseAccess: !settings.dualPlayPauseAccess,
                      })
                    }
                    className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 shrink-0 cursor-pointer ${
                      settings.dualPlayPauseAccess ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div
                      className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
                        settings.dualPlayPauseAccess ? '-translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* 4. Network Architecture Radio Selection matching Image 11 */}
                <div>
                  <h3 className="text-sm font-bold text-white mb-4">نوع بستر شبکه و معماری ارسال فرامین</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Option 1: WebRTC Mesh */}
                    <div
                      onClick={() => setSettings({ ...settings, networkArchitecture: 'mesh' })}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        settings.networkArchitecture === 'mesh'
                          ? 'bg-[#181b26] border-[#ff3366] shadow-[0_0_20px_rgba(255,51,102,0.15)]'
                          : 'bg-[#141722]/50 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-[#ff3366] flex items-center justify-center">
                            {settings.networkArchitecture === 'mesh' && (
                              <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
                            )}
                          </span>
                          <span className="text-sm font-bold text-white">P2P مستقیم (WebRTC Mesh)</span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#ff3366]/20 text-[#ffb2ba]">
                          پیشنهادی
                        </span>
                      </div>
                      <p className="text-xs text-[#94a3b8] leading-relaxed pr-6">
                        تأخیر فوق‌العاده اندک (زیر ۲۰ میلی‌ثانیه) بدون واسطه هیچ سروری
                      </p>
                    </div>

                    {/* Option 2: TURN Server */}
                    <div
                      onClick={() => setSettings({ ...settings, networkArchitecture: 'turn' })}
                      className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                        settings.networkArchitecture === 'turn'
                          ? 'bg-[#181b26] border-[#ff3366] shadow-[0_0_20px_rgba(255,51,102,0.15)]'
                          : 'bg-[#141722]/50 border-white/5 hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-[#94a3b8] flex items-center justify-center">
                          {settings.networkArchitecture === 'turn' && (
                            <span className="w-2 h-2 rounded-full bg-[#ff3366]" />
                          )}
                        </span>
                        <span className="text-sm font-bold text-white">سرور واسط رله (TURN Safe Server)</span>
                      </div>
                      <p className="text-xs text-[#94a3b8] leading-relaxed pr-6">
                        مخصوص مواقعی که یکی از طرفین از فیلترشکن یا نت‌های سخت‌گیر شرکتی استفاده می‌کند
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'audio' && (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center">
                    <Volume2 className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">صدا، میکروفون و داکینگ هوشمند</h2>
                    <p className="text-xs text-[#94a3b8]">کاهش خودکار ولوم فیلم هنگام حرف زدن طرف مقابل</p>
                  </div>
                </div>

                {/* Audio Ducking */}
                <div className="bg-[#141722]/80 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">داکینگ صدای فیلم هنگام مکالمه (Audio Ducking)</h4>
                    <p className="text-xs text-[#94a3b8] mt-1">وقتی پرنیا صحبت می‌کند، صدای فیلم ۳۵٪ کاهش می‌یابد تا صدای او شفاف شنیده شود.</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, audioDucking: !settings.audioDucking })}
                    className={`w-14 h-8 flex items-center rounded-full p-1 shrink-0 ${
                      settings.audioDucking ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full transform transition-transform ${
                      settings.audioDucking ? '-translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* AI Echo Cancellation */}
                <div className="bg-[#141722]/80 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">اکوکانسلیشن هوشمند با هوش مصنوعی</h4>
                    <p className="text-xs text-[#94a3b8] mt-1">حذف انعکاس صدای فیلم از اسپیکر به میکروفون هر دو طرف</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, aiEchoCancellation: !settings.aiEchoCancellation })}
                    className={`w-14 h-8 flex items-center rounded-full p-1 shrink-0 ${
                      settings.aiEchoCancellation ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full transform transition-transform ${
                      settings.aiEchoCancellation ? '-translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'haptics' && (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-[#ff3366]/20 flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#ff3366]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">واکنش‌ها و نبض لرزان (Haptics)</h2>
                    <p className="text-xs text-[#94a3b8]">همگام‌سازی احساسات زنده و انیمیشن‌های شناور در صفحه</p>
                  </div>
                </div>

                <div className="bg-[#141722]/80 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">انیمیشن‌های شناور ایموجی (Floating Emojis)</h4>
                    <p className="text-xs text-[#94a3b8] mt-1">پرواز قلب، پاپ‌کورن و اشک روی صفحه با فیزیک شناور</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, floatingEmojis: !settings.floatingEmojis })}
                    className={`w-14 h-8 flex items-center rounded-full p-1 shrink-0 ${
                      settings.floatingEmojis ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full transform transition-transform ${
                      settings.floatingEmojis ? '-translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="bg-[#141722]/80 p-5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">لرزش و تپش قلب پارتنر (Heartbeat Feedback)</h4>
                    <p className="text-xs text-[#94a3b8] mt-1">ارسال پالس لمسی هنگام نگه داشتن دست روی دکمه قلب در صحنه‌های هیجانی</p>
                  </div>
                  <button
                    onClick={() => setSettings({ ...settings, heartbeatHaptics: !settings.heartbeatHaptics })}
                    className={`w-14 h-8 flex items-center rounded-full p-1 shrink-0 ${
                      settings.heartbeatHaptics ? 'bg-[#ff3366]' : 'bg-white/10'
                    }`}
                  >
                    <div className={`bg-white w-6 h-6 rounded-full transform transition-transform ${
                      settings.heartbeatHaptics ? '-translate-x-6' : 'translate-x-0'
                    }`} />
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-amber-400/20 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">پروفایل سالن و حریم خصوصی</h2>
                    <p className="text-xs text-[#94a3b8]">نام سالن، رمز عبور دائم و روزشمار همنشینی</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-[#94a3b8] mb-2">نام سالن اختصاصی ما:</label>
                    <input
                      type="text"
                      value={settings.roomName}
                      onChange={(e) => setSettings({ ...settings, roomName: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#94a3b8] mb-2">رمز عبور امن سالن:</label>
                    <input
                      type="text"
                      dir="ltr"
                      value={settings.permanentRoomPass}
                      onChange={(e) => setSettings({ ...settings, permanentRoomPass: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#141722] border border-white/10 text-white font-mono text-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'player' && (
              <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
                <div className="flex items-center gap-3 pb-6 border-b border-white/5">
                  <div className="w-10 h-10 rounded-2xl bg-[#8b5cf6]/20 flex items-center justify-center">
                    <Sliders className="w-5 h-5 text-[#8b5cf6]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">پلیر، زیرنویس و کیفیت</h2>
                    <p className="text-xs text-[#94a3b8]">شخصی‌سازی فونت، سایز زیرنویس و تنظیم آفست تاخیر</p>
                  </div>
                </div>

                <div className="bg-[#141722]/80 p-5 rounded-2xl border border-white/5">
                  <h4 className="text-sm font-bold text-white mb-2">سایز متن زیرنویس</h4>
                  <div className="flex gap-3">
                    {(['small', 'medium', 'large'] as const).map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSettings({ ...settings, subtitleSize: sz })}
                        className={`flex-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                          settings.subtitleSize === sz
                            ? 'bg-[#ff3366] text-white border-[#ff3366]'
                            : 'bg-white/5 text-[#94a3b8] border-white/5'
                        }`}
                      >
                        {sz === 'small' ? 'کوچک' : sz === 'medium' ? 'متوسط (پیشنهادی)' : 'بزرگ'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar in RTL matching Image 11 (4 cols) */}
          <div className="lg:col-span-4 order-1 lg:order-2 space-y-6">
            {/* Status Card matching Image 11 */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden">
              <span className="text-xs font-medium text-[#94a3b8] block mb-3">وضعیت پیوند دونفره</span>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-lg ring-2 ring-[#ff3366]/40">
                  خ
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                    <span>سالن خصوصی: {settings.roomName}</span>
                    <Heart className="w-3.5 h-3.5 text-[#ff3366] fill-[#ff3366]" />
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs text-emerald-400 font-medium">همگام و زنده</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#10131e]/80 p-3 rounded-2xl border border-white/5 flex items-center justify-between text-xs font-mono text-[#d0bcff]">
                <span>تأخیر مقابل:</span>
                <span className="font-bold text-white">12ms P2P • مستقیم</span>
              </div>
            </div>

            {/* Category Nav Links matching Image 11 */}
            <div className="glass-panel rounded-3xl p-3 border border-white/10 space-y-1.5">
              <button
                onClick={() => setActiveTab('sync')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-bold transition-all ${
                  activeTab === 'sync'
                    ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Radio className="w-4 h-4" />
                  <span>همگام‌سازی و اتصال P2P</span>
                </div>
                {activeTab === 'sync' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white">فعال</span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('audio')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-medium transition-all ${
                  activeTab === 'audio'
                    ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Mic className="w-4 h-4" />
                  <div className="text-right">
                    <span>صدا، میکروفون و داکینگ</span>
                    <span className="block text-[10px] text-[#94a3b8] font-normal">کاهش هوشمند صدای فیلم و AI اکو</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('haptics')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-medium transition-all ${
                  activeTab === 'haptics'
                    ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Heart className="w-4 h-4" />
                  <div className="text-right">
                    <span>واکنش‌ها و نبض لرزان</span>
                    <span className="block text-[10px] text-[#94a3b8] font-normal">تپش قلب، ایموجی شناور و وبکم</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-medium transition-all ${
                  activeTab === 'profile'
                    ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Shield className="w-4 h-4" />
                  <div className="text-right">
                    <span>پروفایل سالن و حریم خصوصی</span>
                    <span className="block text-[10px] text-[#94a3b8] font-normal">رمز عبور دائم، روزشمار و تم آمبیانت</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('player')}
                className={`w-full flex items-center justify-between p-4 rounded-2xl text-xs font-medium transition-all ${
                  activeTab === 'player'
                    ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Sliders className="w-4 h-4" />
                  <div className="text-right">
                    <span>پلیر، زیرنویس و کیفیت</span>
                    <span className="block text-[10px] text-[#94a3b8] font-normal">سایز متن، شیدینگ و تاخیر زمانی</span>
                  </div>
                </div>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Security Box matching Image 11 */}
            <div className="glass-panel p-6 rounded-3xl border border-white/10 bg-gradient-to-b from-[#141722] to-[#10131e]">
              <div className="flex items-center gap-2 mb-3 text-xs text-[#d0bcff]">
                <Lock className="w-4 h-4 text-[#ff3366]" />
                <span className="font-bold">سوابق اتصال امن</span>
              </div>
              <p className="text-xs text-[#94a3b8] italic leading-relaxed mb-4">
                «فاصله‌ها فقط آزمونی هستند برای اینکه ببینیم تا چه اندازه می‌توانیم فراتر از مرزها در کنار هم باشیم.»
              </p>
              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#94a3b8]">
                <span>انتقال داده: E2EE رمزنگاری کامل</span>
                <span className="text-[#ffb2ba] font-bold">۴۶۷ روز همنشینی</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
