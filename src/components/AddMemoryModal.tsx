/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Image as ImageIcon, Heart, Upload, Sparkles } from 'lucide-react';
import { PhotoMemory } from '../types';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newMemory: PhotoMemory) => void;
}

export const AddMemoryModal: React.FC<AddMemoryModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [title, setTitle] = useState('');
  const [caption, setCaption] = useState('');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState(
    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=600&q=80'
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPhoto: PhotoMemory = {
      id: `photo-${Date.now()}`,
      title: title.trim(),
      caption: caption.trim() || 'لحظه‌ای فراموش‌نشدنی از شب سینمایی دونفره',
      timestamp: 'امشب - ساعت ۰۰:۱۵',
      imageUrl: selectedPresetUrl,
      hearts: 1,
    };

    onAdd(newPhoto);
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
          <ImageIcon className="w-5 h-5 text-[#ff3366]" />
          <h3 className="text-xl font-bold text-white">افزودن شات ماندگار به آلبوم</h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">عنوان خاطره:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: ذوق پرنیا در سکانس پایانی"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-1.5">توضیحات و احساس مشترک:</label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={3}
              placeholder="چی شد که این لحظه قشنگ شد؟..."
              className="w-full px-4 py-2.5 rounded-xl bg-[#141722] border border-white/10 text-white text-xs outline-none focus:border-[#ff3366]"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-[#94a3b8] mb-2">انتخاب تصویر شات:</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=400&q=80',
                'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
              ].map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt="preview"
                  onClick={() => setSelectedPresetUrl(url)}
                  className={`w-full h-20 object-cover rounded-xl cursor-pointer border-2 transition-all ${
                    selectedPresetUrl === url ? 'border-[#ff3366] scale-95' : 'border-transparent opacity-60'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 py-3 rounded-xl bg-[#ff3366] hover:bg-[#ff4f73] text-white font-bold text-xs shadow-lg shadow-[#ff3366]/30 cursor-pointer"
            >
              ثبت در آلبوم خاطرات ما
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
