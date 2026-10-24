/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Film, Heart } from 'lucide-react';
import { WishlistItem } from '../types';

interface SuggestMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (item: WishlistItem) => void;
}

export const SuggestMovieModal: React.FC<SuggestMovieModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [titleFa, setTitleFa] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [duration, setDuration] = useState('2h 10m');
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFa.trim()) return;

    const newItem: WishlistItem = {
      id: `movie-${Date.now()}`,
      titleFa: titleFa.trim(),
      titleEn: titleEn.trim() || titleFa.trim(),
      duration: duration.trim() || '2h 00m',
      picker: 'aryan',
      pickerNote: note.trim() || '«پیشنهاد شده برای یک شب رمانتیک و دونفره»',
      statusText: 'پیشنهاد جدید',
      actionText: 'تماشا با پرنیا',
      posterUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=600&q=80',
      votes: 1,
    };

    onAdd(newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel-elevated rounded-3xl border border-white/15 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-6 left-6 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4">
          <Film className="w-5 h-5 text-[#8b5cf6]" />
          <h3 className="text-xl font-bold text-white">پیشنهاد فیلم جدید به پرنیا</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">نام فارسی فیلم:</label>
            <input
              type="text"
              value={titleFa}
              onChange={(e) => setTitleFa(e.target.value)}
              placeholder="مثال: درخشش ابدی یک ذهن پاک"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">نام انگلیسی فیلم:</label>
            <input
              type="text"
              value={titleEn}
              onChange={(e) => setTitleEn(e.target.value)}
              placeholder="Eternal Sunshine of the Spotless Mind"
              dir="ltr"
              className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">پیام یا یادداشت شما برای پرنیا:</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="«تعریف این فیلم رو خیلی شنیدم، دوست دارم با تو ببینمش...»"
              className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs outline-none focus:border-[#ff3366]"
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#ff3366] text-white font-bold text-xs shadow-lg shadow-[#8b5cf6]/30 cursor-pointer"
            >
              ارسال پیشنهاد به لیست Wishlist
            </button>
            <button
              type="button"
              onClick={onClose}
              className="py-3 px-5 rounded-xl bg-white/5 text-xs text-white"
            >
              انصراف
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
