/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ScreenMode, DashboardTab, RoomSettings, PhotoMemory, WishlistItem } from './types';
import { defaultRoomSettings } from './data/mockData';
import { getSyncEngine } from './utils/syncEngine';
import { Navbar } from './components/Navbar';
import { LandingScreen } from './components/LandingScreen';
import { OtpScreen } from './components/OtpScreen';
import { MemoriesScreen } from './components/MemoriesScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { TheaterScreen } from './components/TheaterScreen';
import { UploadScreen } from './components/UploadScreen';
import { MonthlySummaryModal } from './components/MonthlySummaryModal';
import { AddMemoryModal } from './components/AddMemoryModal';
import { SuggestMovieModal } from './components/SuggestMovieModal';

export default function App() {
  const syncEngine = getSyncEngine();

  // Read URL query params for easy test navigation or default start
  const queryParams = new URLSearchParams(window.location.search);
  const initialScreenParam = queryParams.get('screen') as ScreenMode | null;
  const initialTabParam = queryParams.get('tab') as DashboardTab | null;
  const roomParam = queryParams.get('room');
  const autostart = queryParams.get('autostart') === '1';

  const [screen, setScreen] = useState<ScreenMode>(
    autostart ? 'dashboard' : initialScreenParam || 'landing'
  );
  const [tab, setTab] = useState<DashboardTab>(initialTabParam || 'memories');
  const [currentContact, setCurrentContact] = useState('09120005678');
  const [currentMovieTitle, setCurrentMovieTitle] = useState('لا لا لند (La La Land)');
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string | undefined>(undefined);
  const [roomSettings, setRoomSettings] = useState<RoomSettings>(defaultRoomSettings);
  const [networkLatency, setNetworkLatency] = useState(12);

  // Modals
  const [isMonthlySummaryOpen, setIsMonthlySummaryOpen] = useState(false);
  const [isAddMemoryOpen, setIsAddMemoryOpen] = useState(false);
  const [isSuggestMovieOpen, setIsSuggestMovieOpen] = useState(false);

  useEffect(() => {
    // If room query param exists, configure sync engine for that room
    if (roomParam) {
      syncEngine.connectSignaling('ws://localhost:8080/ws', roomParam, false);
    }

    const unsubscribe = syncEngine.onConnectionChange((connected, latency) => {
      setNetworkLatency(latency);
    });

    return () => {
      unsubscribe();
    };
  }, [roomParam, syncEngine]);

  // Switch between screens
  const handleEnterRoom = () => {
    setScreen('dashboard');
    setTab('theater');
  };

  const handleRequestOtp = (contact: string) => {
    setCurrentContact(contact);
    setScreen('otp');
  };

  const handleOtpVerified = () => {
    setScreen('dashboard');
    setTab('theater');
  };

  const handleStartTonight = (title?: string) => {
    if (title) setCurrentMovieTitle(title);
    setScreen('dashboard');
    setTab('theater');
  };

  const handleSaveSettings = (newSettings: RoomSettings) => {
    setRoomSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-[#10131e] text-[#e0e1f1] font-['Vazirmatn',sans-serif]">
      {/* Screen 1: Welcome & Landing Screen (Image 1) */}
      {screen === 'landing' && (
        <LandingScreen
          onEnterRoom={handleEnterRoom}
          onRequestOtp={handleRequestOtp}
        />
      )}

      {/* Screen 2: OTP Verification Screen (Image 3) */}
      {screen === 'otp' && (
        <OtpScreen
          contact={currentContact}
          onVerified={handleOtpVerified}
          onBackToEdit={() => setScreen('landing')}
        />
      )}

      {/* Screen 3: CinemaSync Main Dashboard with Navbar */}
      {screen === 'dashboard' && (
        <div className="flex flex-col min-h-screen">
          <Navbar
            currentTab={tab}
            onTabChange={(t) => setTab(t)}
            onSwitchScreen={(s) => setScreen(s)}
            latencyMs={networkLatency}
          />

          <main className="flex-1">
            {tab === 'memories' && (
              <MemoriesScreen
                onStartTonight={handleStartTonight}
                onOpenMonthlySummary={() => setIsMonthlySummaryOpen(true)}
                onOpenAddMemory={() => setIsAddMemoryOpen(true)}
                onOpenSuggestMovie={() => setIsSuggestMovieOpen(true)}
              />
            )}

            {tab === 'settings' && (
              <SettingsScreen onSave={handleSaveSettings} />
            )}

            {tab === 'theater' && (
              <TheaterScreen
                movieTitle={currentMovieTitle}
                videoSourceUrl={currentVideoUrl}
                settings={roomSettings}
                onOpenSettings={() => setTab('settings')}
              />
            )}

            {tab === 'upload' && (
              <UploadScreen
                onLoadMovieToPlayer={(title, videoUrl) => {
                  setCurrentMovieTitle(title);
                  if (videoUrl) setCurrentVideoUrl(videoUrl);
                  setTab('theater');
                }}
              />
            )}
          </main>
        </div>
      )}

      {/* Modals */}
      <MonthlySummaryModal
        isOpen={isMonthlySummaryOpen}
        onClose={() => setIsMonthlySummaryOpen(false)}
      />

      <AddMemoryModal
        isOpen={isAddMemoryOpen}
        onClose={() => setIsAddMemoryOpen(false)}
        onAdd={(newMem: PhotoMemory) => {
          // Handled inside memory state
        }}
      />

      <SuggestMovieModal
        isOpen={isSuggestMovieOpen}
        onClose={() => setIsSuggestMovieOpen(false)}
        onAdd={(newItem: WishlistItem) => {
          // Handled inside wishlist state
        }}
      />
    </div>
  );
}
