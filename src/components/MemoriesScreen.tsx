/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MovieMemory, PhotoMemory, WishlistItem } from '../types';
import { initialMovieMemories, initialPhotoMemories, initialWishlist, partnerUser } from '../data/mockData';
import {
  Heart,
  Calendar,
  Clock,
  Sparkles,
  Play,
  Film,
  Headphones,
  Plus,
  Share2,
  Bookmark,
  Flame,
  Volume2,
  Tv,
  ArrowRight
} from 'lucide-react';

interface MemoriesScreenProps {
  onStartTonight: (movieTitle?: string) => void;
  onOpenMonthlySummary: () => void;
  onOpenAddMemory: () => void;
  onOpenSuggestMovie: () => void;
}

export const MemoriesScreen: React.FC<MemoriesScreenProps> = ({
  onStartTonight,
  onOpenMonthlySummary,
  onOpenAddMemory,
  onOpenSuggestMovie,
}) => {
  const [movieMemories, setMovieMemories] = useState<MovieMemory[]>(initialMovieMemories);
  const [photoMemories, setPhotoMemories] = useState<PhotoMemory[]>(initialPhotoMemories);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);
  const [activeReactionMovieId, setActiveReactionMovieId] = useState<string | null>(null);

  const handleHeartReaction = (movieId: string) => {
    setActiveReactionMovieId(movieId);
    setMovieMemories((prev) =>
      prev.map((m) =>
        m.id === movieId
          ? { ...m, reactions: { ...m.reactions, hearts: m.reactions.hearts + 1 } }
          : m
      )
    );
    setTimeout(() => setActiveReactionMovieId(null), 1200);
  };

  const handleVoteWishlist = (id: string) => {
    setWishlist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, votes: item.votes + 1 } : item
      )
    );
  };

  return (
    <div className="min-h-screen bg-[#10131e] text-[#e0e1f1] pb-24 pt-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Ribbon & Title matching Image 9 */}
        <div className="mb-10">
          {/* Top subtle badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff3366]/15 border border-[#ff3366]/30 text-xs text-[#ffb2ba] font-medium mb-4">
            <Heart className="w-3.5 h-3.5 fill-[#ff3366] text-[#ff3366]" />
            <span>با عشق در کنار پرنیا • سینکرونایز شده ۱۴ شب پرخاطره</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-['Outfit',var(--font-persian)] mb-3">
                دفتر خاطرات و شب‌های سینمایی ما
              </h1>
              <p className="text-sm sm:text-base text-[#94a3b8] max-w-3xl leading-relaxed">
                هر فریم، اشک، خنده و تپش قلبی که در فاصله کیلومترها همگام با هم نفس کشیدیم در این تالار ثبت شده است.
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={onOpenMonthlySummary}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1c1f2a] hover:bg-[#272935] border border-white/10 text-white font-semibold text-sm transition-all hover:border-[#8b5cf6]/40 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-[#8b5cf6]" />
                <span>خلاصه ماهانه ما</span>
              </button>

              <button
                onClick={() => onStartTonight('لا لا لند')}
                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-[#ff3366] to-[#ff4f73] hover:from-[#ff4f73] hover:to-[#ff3366] text-white font-bold text-sm transition-all shadow-xl shadow-[#ff3366]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Tv className="w-4 h-4" />
                <span>شروع سانس امشب</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4 Stats Cards matching Image 9 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-14">
          {/* Card 1: زمان باهم‌بودن */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#8b5cf6]/40 transition-all">
            <div className="flex items-center justify-between mb-3 text-[#94a3b8] text-xs">
              <span>زمان باهم‌بودن</span>
              <Clock className="w-4 h-4 text-[#8b5cf6]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit'] mb-1">
              ۳۸:۴۵ <span className="text-sm font-normal text-[#94a3b8]">ساعت</span>
            </div>
            <p className="text-xs text-[#94a3b8] mb-3">خنده و اشک مشترک در جریان فیلم‌ها</p>
            <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="w-[78%] h-full bg-gradient-to-r from-[#8b5cf6] to-[#ff3366] rounded-full" />
            </div>
          </div>

          {/* Card 2: شب‌های سینمایی */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#ff3366]/40 transition-all">
            <div className="flex items-center justify-between mb-3 text-[#94a3b8] text-xs">
              <span>شب‌های سینمایی</span>
              <Film className="w-4 h-4 text-[#ff3366]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit'] mb-1">
              ۱۴ <span className="text-sm font-normal text-[#94a3b8]">عنوان</span>
            </div>
            <p className="text-xs text-[#94a3b8]">فیلم کامل، مینی‌سریال و مستند</p>
            <span className="text-[11px] font-semibold text-emerald-400 mt-2 block">۳+ فیلم در این هفته</span>
          </div>

          {/* Card 3: ژانر موردعلاقه دونفره */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-amber-400/40 transition-all">
            <div className="flex items-center justify-between mb-3 text-[#94a3b8] text-xs">
              <span>ژانر موردعلاقه دونفره</span>
              <Sparkles className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-white mb-1">علمی‌تخیلی و رمانتیک</div>
            <p className="text-xs text-[#94a3b8] mb-3">۴۶% هم‌پوشانی کامل سلیقه‌ها</p>
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#d0bcff]">فلسفی</span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-[#ffb2ba]">موزیکال</span>
            </div>
          </div>

          {/* Card 4: ضربان و ری‌اکشن */}
          <div className="glass-panel p-6 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-[#ff3366]/40 transition-all">
            <div className="flex items-center justify-between mb-3 text-[#94a3b8] text-xs">
              <span>ضربان و ری‌اکشن</span>
              <Heart className="w-4 h-4 text-[#ff3366] fill-[#ff3366]" />
            </div>
            <div className="text-3xl font-extrabold text-white font-['Outfit'] mb-1">
              ۴۸۲ <span className="text-sm font-normal text-[#94a3b8]">تپ قلب</span>
            </div>
            <p className="text-xs text-[#94a3b8]">واکنش احساسی زنده روی تایم‌لاین</p>
            <span className="text-[11px] font-semibold text-[#ffb2ba] mt-2 block">میانگین ۳۴ ری‌اکشن در هر فیلم</span>
          </div>
        </div>

        {/* Section: تایم‌لاین شب‌های تماشا matching Image 9 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ff3366]" />
              <h2 className="text-2xl font-bold text-white">تایم‌لاین شب‌های تماشا</h2>
            </div>
            <div className="text-xs text-[#94a3b8] bg-[#181b26] px-3.5 py-1.5 rounded-xl border border-white/5">
              مرتب‌سازی بر اساس: <span className="text-white font-medium">تازه‌ترین‌ها</span>
            </div>
          </div>

          {/* Movie Cards Stack */}
          <div className="space-y-6">
            {movieMemories.map((movie, index) => (
              <div
                key={movie.id}
                className="glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-white/10 hover:border-[#ff3366]/30 transition-all duration-300 relative overflow-hidden"
              >
                {/* Date stamp circle on timeline side */}
                <div className="hidden lg:flex absolute top-8 -right-4 w-12 h-12 rounded-full bg-[#181b26] border-2 border-[#ff3366] items-center justify-center text-[11px] font-bold text-white flex-col shadow-lg z-20">
                  <span>{movie.date.split(' ')[0]}</span>
                  <span className="text-[9px] text-[#94a3b8]">{movie.date.split(' ')[1]}</span>
                </div>

                <div className="flex flex-col md:flex-row gap-6 items-stretch">
                  {/* Poster Thumbnail */}
                  <div className="relative w-full md:w-56 h-72 md:h-auto rounded-2xl overflow-hidden shrink-0 border border-white/10 group">
                    <img
                      src={movie.posterUrl}
                      alt={movie.titleFa}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono font-medium text-white">
                      {movie.duration}
                    </div>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-[#8b5cf6]/90 backdrop-blur-md text-[11px] font-semibold text-white">
                      {movie.sessionNumber}
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/75 text-[11px] text-amber-400 font-bold">
                      <span>★</span>
                      <span>{movie.rating}</span>
                    </div>
                  </div>

                  {/* Movie Info & Memories */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      {/* Top metadata tags */}
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold text-white">
                            {movie.titleFa} <span className="text-lg font-normal text-[#94a3b8]">({movie.titleEn})</span>
                          </h3>
                        </div>
                        <span className="text-xs px-3 py-1 rounded-xl bg-white/5 border border-white/5 text-[#d0bcff]">
                          {movie.quality}
                        </span>
                      </div>

                      <p className="text-xs text-[#94a3b8] mb-5">
                        {movie.date} • بخش همگام بدون توقف • {movie.tags?.join('، ')}
                      </p>

                      {/* Pinned Partner Note matching Image 9 */}
                      {movie.pinnedNote && (
                        <div className="bg-[#141722]/90 rounded-2xl p-4 border border-white/5 mb-5 relative">
                          <div className="flex items-center gap-2 mb-1.5">
                            <img
                              src={partnerUser.avatar}
                              alt={partnerUser.name}
                              className="w-6 h-6 rounded-full object-cover ring-1 ring-[#ff3366]"
                            />
                            <span className="text-xs font-bold text-white">یادداشت سنجاق شده پرنیا:</span>
                          </div>
                          <p className="text-xs sm:text-sm text-[#e0e1f1] leading-relaxed">
                            {movie.pinnedNote.text}
                          </p>
                        </div>
                      )}

                      {/* Tagged moments if any */}
                      {movie.taggedMoments && movie.taggedMoments.length > 0 && (
                        <div className="mb-5">
                          <span className="text-xs font-semibold text-[#94a3b8] block mb-2">
                            لحظات سنجاق‌شده دونفره:
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {movie.taggedMoments.map((moment, idx) => (
                              <button
                                key={idx}
                                onClick={() => onStartTonight(movie.titleFa)}
                                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-[#e0e1f1] transition-colors"
                              >
                                <span className="font-mono text-[#d0bcff] font-semibold">{moment.timecode}</span>
                                <span>{moment.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Live Reactions Badge Counter */}
                      <div className="flex items-center gap-4 text-xs text-[#94a3b8]">
                        <span>ری‌اکشن‌های زنده:</span>
                        <button
                          onClick={() => handleHeartReaction(movie.id)}
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-[#ffb2ba] border border-rose-500/20 transition-all cursor-pointer"
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#ff3366] text-[#ff3366]" />
                          <span>{movie.reactions.hearts} قلب</span>
                        </button>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-[#d0bcff]">
                          <span>🥲</span>
                          <span>{movie.reactions.tears} اشک شوق</span>
                        </span>
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/5 text-amber-300">
                          <span>🍿</span>
                          <span>{movie.reactions.popcorn} پاپ‌کورن</span>
                        </span>
                      </div>
                    </div>

                    {/* Action buttons matching Image 9 */}
                    <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-white/5">
                      <button
                        onClick={() => onStartTonight(movie.titleFa)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ff3366] hover:bg-[#ff4f73] text-white font-bold text-xs transition-all shadow-lg shadow-[#ff3366]/20"
                      >
                        <Play className="w-3.5 h-3.5 fill-white" />
                        <span>تماشای مجدد دونفره</span>
                      </button>

                      {movie.taggedMoments && (
                        <button
                          onClick={() => onStartTonight(movie.titleFa)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-colors"
                        >
                          <Bookmark className="w-3.5 h-3.5 text-[#8b5cf6]" />
                          <span>لحظات علامت‌گذاری‌شده ({movie.taggedMoments.length})</span>
                        </button>
                      )}

                      {movie.audioPodcastDuration && (
                        <button
                          onClick={() => alert(`پخش پادکست ۲۴ دقیقه‌ای دونفره درباره ${movie.titleFa}`)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/30 border border-[#8b5cf6]/40 text-xs font-semibold text-[#d0bcff] transition-colors"
                        >
                          <Headphones className="w-3.5 h-3.5 text-[#8b5cf6]" />
                          <span>شنیدن پادکست اختصاصی ما ({movie.audioPodcastDuration})</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section: آلبوم لحظات و شات‌های ماندگار matching Image 9 */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>📸</span>
                <span>آلبوم لحظات و شات‌های ماندگار</span>
              </h2>
              <p className="text-xs text-[#94a3b8] mt-1">
                لحظاتی که وبکم هر دویمان خودکار یا با تپ قلب شکار کرده است
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {photoMemories.map((photo) => (
              <div
                key={photo.id}
                className="glass-panel rounded-3xl overflow-hidden border border-white/10 group hover:border-[#ff3366]/40 transition-all flex flex-col justify-between"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={photo.imageUrl}
                    alt={photo.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-[10px] text-white font-mono">
                    {photo.timestamp.split(' - ')[0]}
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-lg bg-black/60 text-[11px] text-[#ffb2ba]">
                    <Heart className="w-3 h-3 fill-[#ff3366] text-[#ff3366]" />
                    <span>{photo.hearts}</span>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-bold text-white mb-1">{photo.title}</h4>
                  <p className="text-xs text-[#94a3b8] line-clamp-2 leading-relaxed">{photo.caption}</p>
                </div>
              </div>
            ))}

            {/* Add New Memory Card matching Image 9 */}
            <button
              onClick={onOpenAddMemory}
              className="border-2 border-dashed border-white/15 hover:border-[#ff3366]/50 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all bg-white/[0.02] hover:bg-[#ff3366]/5 cursor-pointer group min-h-[220px]"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 group-hover:bg-[#ff3366]/20 border border-white/10 flex items-center justify-center text-white mb-3 transition-colors">
                <Plus className="w-6 h-6 text-[#ff3366]" />
              </div>
              <h4 className="text-sm font-bold text-white mb-1">افزودن عکس یا خاطره جدید</h4>
              <p className="text-xs text-[#94a3b8]">آپلود فریم یا اسکرین‌شات دوتایی</p>
            </button>
          </div>
        </div>

        {/* Section: لیست تماشای بعدی ما (Wishlist) matching Image 9 */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#8b5cf6]" />
              <h2 className="text-2xl font-bold text-white">لیست تماشای بعدی ما (Wishlist)</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#8b5cf6]/20 text-[#d0bcff] font-semibold">
                ۳ فیلم در نوبت
              </span>
            </div>
            <button
              onClick={onOpenSuggestMovie}
              className="text-xs text-[#ff3366] hover:text-[#ff4f73] font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>پیشنهاد فیلم به پرنیا</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="glass-panel-elevated rounded-3xl p-6 border border-white/10 flex flex-col justify-between hover:border-[#8b5cf6]/30 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-mono text-[#94a3b8]">{item.duration}</span>
                    <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/5 text-[#d0bcff]">
                      {item.picker === 'parnia' ? 'انتخاب پرنیا' : item.picker === 'aryan' ? 'انتخاب من' : 'نوستالژی مشترک'}
                    </span>
                  </div>

                  <div className="flex gap-4 items-center mb-4">
                    <img
                      src={item.posterUrl}
                      alt={item.titleFa}
                      className="w-16 h-22 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div>
                      <h4 className="text-lg font-bold text-white">{item.titleFa}</h4>
                      <p className="text-xs text-[#94a3b8] font-['Outfit']">({item.titleEn})</p>
                      <span className="text-xs text-emerald-400 font-medium block mt-1">
                        {item.statusText}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-[#e0e1f1] italic bg-[#10131e]/60 p-3 rounded-xl border border-white/5 mb-5">
                    {item.pickerNote}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onStartTonight(item.titleFa)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#ff3366] hover:bg-[#ff4f73] text-white font-bold text-xs transition-all shadow-md shadow-[#ff3366]/20 flex items-center justify-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>{item.actionText}</span>
                  </button>

                  <button
                    onClick={() => handleVoteWishlist(item.id)}
                    className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-[#d0bcff] border border-white/5 font-semibold flex items-center gap-1.5 transition-colors"
                    title="رأی مثبت به این فیلم"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#ff3366]" />
                    <span>{item.votes}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
