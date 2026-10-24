/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { DashboardTab, ScreenMode } from '../types';
import { currentUser, partnerUser } from '../data/mockData';
import { Tv, Upload, Film, Settings, Heart, Wifi, Shield, LogOut } from 'lucide-react';

interface NavbarProps {
  currentTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  onSwitchScreen: (screen: ScreenMode) => void;
  latencyMs?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onSwitchScreen,
  latencyMs = 12,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#10131e]/90 backdrop-blur-md border-b border-white/5 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Right side in RTL: Brand & Current User */}
        <div className="flex items-center gap-4">
          {/* User Avatar with host indicator */}
          <div className="relative group cursor-pointer" title={`${currentUser.name} (${currentUser.role})`}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-11 h-11 rounded-full object-cover ring-2 ring-[#ff3366]/40 p-0.5"
            />
            <span className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#10131e]" />
          </div>

          {/* Logo & Slogan */}
          <div
            onClick={() => onTabChange('memories')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#ff3366] to-[#8b5cf6] flex items-center justify-center shadow-lg shadow-[#ff3366]/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">CinemaSync</span>
                <Heart className="w-4 h-4 text-[#ff3366] fill-[#ff3366] animate-pulse" />
              </div>
              <p className="text-[11px] text-[#94a3b8] font-medium hidden sm:block">هم‌سینما • تماشای دونفره و همگام</p>
            </div>
          </div>
        </div>

        {/* Center: Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2 bg-[#181b26]/80 p-1.5 rounded-2xl border border-white/5 shadow-inner">
          <button
            onClick={() => onTabChange('theater')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'theater'
                ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Tv className="w-4 h-4" />
            <span>اتاق تماشا</span>
          </button>

          <button
            onClick={() => onTabChange('upload')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'upload'
                ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>بارگذاری فیلم</span>
          </button>

          <button
            onClick={() => onTabChange('memories')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'memories'
                ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>تاریخچه و خاطرات</span>
          </button>

          <button
            onClick={() => onTabChange('settings')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
              currentTab === 'settings'
                ? 'bg-[#ff3366] text-white shadow-lg shadow-[#ff3366]/30 font-semibold'
                : 'text-[#94a3b8] hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>تنظیمات</span>
          </button>
        </nav>

        {/* Left side in RTL: Partner Status, Latency & Switcher */}
        <div className="flex items-center gap-2.5">
          {/* Latency badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 rounded-xl text-xs font-mono font-medium text-[#d0bcff]">
            <Wifi className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>{latencyMs}ms تأخیر</span>
          </div>

          {/* Partner online badge with avatar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#181b26] border border-white/10 rounded-xl text-xs text-[#e0e1f1]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="hidden sm:inline font-medium">{partnerUser.name} آنلاین است</span>
            <img
              src={partnerUser.avatar}
              alt={partnerUser.name}
              className="w-5 h-5 rounded-full object-cover ring-1 ring-emerald-400/50"
            />
          </div>

          {/* Switch screens menu button */}
          <button
            onClick={() => onSwitchScreen('landing')}
            title="خروج یا مشاهده صفحه ورود و خوش‌آمدگویی"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-[#94a3b8] hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
