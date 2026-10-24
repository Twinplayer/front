/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { partnerUser, currentUser } from '../data/mockData';
import { X, Heart, Sparkles, Film, Clock, Download, Share2 } from 'lucide-react';

interface MonthlySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MonthlySummaryModal: React.FC<MonthlySummaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#ff3366]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#8b5cf6]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#ff3366]/20 text-[#ffb2ba] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>خلاصه عاشقانه بهمن ماه</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            کارنامه سینمایی آریان و پرنیا
          </h3>
          <p className="text-xs text-[#94a3b8]">فاصله تهران تا مقصد با هر فریم فیلم نزدیک‌تر شد</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-[#10131e]/70 p-4 rounded-2xl border border-white/5 text-center">
            <Clock className="w-5 h-5 text-[#8b5cf6] mx-auto mb-1" />
            <span className="text-2xl font-bold text-white font-['Outfit'] block">۳۸:۴۵</span>
            <span className="text-[11px] text-[#94a3b8]">ساعت تماشای هم‌نفس</span>
          </div>

          <div className="bg-[#10131e]/70 p-4 rounded-2xl border border-white/5 text-center">
            <Film className="w-5 h-5 text-[#ff3366] mx-auto mb-1" />
            <span className="text-2xl font-bold text-white font-['Outfit'] block">۱۴</span>
            <span className="text-[11px] text-[#94a3b8]">شب خاطره‌انگیز</span>
          </div>

          <div className="bg-[#10131e]/70 p-4 rounded-2xl border border-white/5 text-center">
            <Heart className="w-5 h-5 text-[#ff3366] fill-[#ff3366] mx-auto mb-1" />
            <span className="text-2xl font-bold text-white font-['Outfit'] block">۴۸۲</span>
            <span className="text-[11px] text-[#94a3b8]">تپش همزمان قلب</span>
          </div>

          <div className="bg-[#10131e]/70 p-4 rounded-2xl border border-white/5 text-center">
            <span className="text-lg block mb-0.5">🍿</span>
            <span className="text-2xl font-bold text-white font-['Outfit'] block">۱۰۰٪</span>
            <span className="text-[11px] text-[#94a3b8]">همگامی بدون لفت</span>
          </div>
        </div>

        {/* Most Emotional Night Highlight */}
        <div className="bg-[#141722]/90 p-4 rounded-2xl border border-white/5 mb-6">
          <h4 className="text-xs font-bold text-white mb-1 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-[#ff3366] fill-[#ff3366]" />
            <span>پرشورترین شب ماه:</span>
          </h4>
          <p className="text-xs text-[#94a3b8] leading-relaxed">
            ۲۲ بهمن در سانس فیلم «لا لا لند» با ۱۲ بار اشک شوق و تبادل نظر تا صبح، به یادماندنی‌ترین شب ماه رقم خورد.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              alert('کارت خلاصه ماهانه ذخیره شد.');
              onClose();
            }}
            className="flex-1 py-3 px-4 rounded-2xl bg-[#ff3366] hover:bg-[#ff4f73] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#ff3366]/25"
          >
            <Download className="w-4 h-4" />
            <span>دانلود کارت خاطرات ماه</span>
          </button>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white border border-white/10 transition-colors"
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
