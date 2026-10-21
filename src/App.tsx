import React, { useState, useEffect } from 'react';
import type { ScreenType, ActivityType } from './types';
import { useStats } from './hooks/useStats';
import { NavigationHeader } from './components/NavigationHeader';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { SettingsModal } from './components/SettingsModal';
import { HomeScreen } from './features/home/HomeScreen';
import { BreathingReset } from './features/breathe/BreathingReset';
import { ReflexGame } from './features/reflex/ReflexGame';
import { FocusRedirect } from './features/focus/FocusRedirect';
import { ThoughtDump } from './features/thought-dump/ThoughtDump';
import { RapidMath } from './features/math/RapidMath';
import { QuickSketch } from './features/sketch/QuickSketch';
import { AmbientTunesPlayer } from './features/audio/AmbientTunesPlayer';
import { ambientSynth } from './features/audio/AmbientSynth';
import { gentleAudio } from './utils/GentleAudio';

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('home');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isTunesOpen, setIsTunesOpen] = useState(false);
  const [isTunesPlaying, setIsTunesPlaying] = useState(false);
  const [returnNotice, setReturnNotice] = useState<string | null>(null);

  const {
    stats,
    settings,
    addReset,
    recordReactionTime,
    setSavedThought,
    clearSavedThought,
    resetAllStats,
    updateSettings,
  } = useStats();

  // Initialize audio settings from loaded preferences
  useEffect(() => {
    gentleAudio.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Periodic poll or sync for ambient synth status
  useEffect(() => {
    const interval = setInterval(() => {
      setIsTunesPlaying(ambientSynth.isPlaying());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // "I'M OVERTHINKING →" handler: Pick a random activity from all 6 reset modules
  const handleInstantReset = () => {
    const activities: ActivityType[] = [
      'breathe',
      'reflex',
      'focus',
      'thought-dump',
      'math',
      'sketch',
    ];
    const randomIndex = Math.floor(Math.random() * activities.length);
    const chosen = activities[randomIndex];
    setCurrentScreen(chosen);
  };

  // Another 2-minute reset handler: Pick a quick reset (Breathe, Reflex, or Math)
  const handleAnotherReset = () => {
    const shortActivities: ActivityType[] = ['breathe', 'reflex', 'math'];
    const chosen = shortActivities[Math.floor(Math.random() * shortActivities.length)];
    setCurrentScreen(chosen);
  };

  // Return to life flow
  const handleReturnHome = () => {
    setCurrentScreen('home');
    setReturnNotice('Good grounding. Step away from the screen and return to what you were doing.');
    setTimeout(() => {
      setReturnNotice(null);
    }, 4500);
  };

  return (
    <div
      className={`min-h-[100dvh] flex flex-col items-center justify-between transition-colors duration-300 ${
        settings.theme === 'dark' ? 'bg-[#080b11] text-slate-100' : 'bg-slate-50 text-slate-900'
      }`}
    >
      {/* Top App Header */}
      <NavigationHeader
        currentScreen={currentScreen}
        onNavigateHome={() => setCurrentScreen('home')}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenTunes={() => setIsTunesOpen(true)}
        isTunesPlaying={isTunesPlaying}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-md mx-auto px-4 sm:px-6 py-4 flex-1 flex flex-col justify-start">
        {/* Grounding return toast notification */}
        {returnNotice && (
          <div className="mb-4 p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium text-center animate-bounce shadow-md">
            {returnNotice}
          </div>
        )}

        {/* View Router */}
        {currentScreen === 'home' && (
          <HomeScreen
            stats={stats}
            onSelectActivity={(act) => setCurrentScreen(act)}
            onInstantReset={handleInstantReset}
            onOpenTunes={() => setIsTunesOpen(true)}
          />
        )}

        {currentScreen === 'math' && (
          <RapidMath
            onComplete={(minutes) => addReset(minutes)}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}

        {currentScreen === 'sketch' && (
          <QuickSketch
            onComplete={(minutes) => addReset(minutes)}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}

        {currentScreen === 'breathe' && (
          <BreathingReset
            onComplete={(minutes) => addReset(minutes)}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}

        {currentScreen === 'reflex' && (
          <ReflexGame
            onComplete={(bestMs) => {
              addReset(1);
              recordReactionTime(bestMs);
            }}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}

        {currentScreen === 'focus' && (
          <FocusRedirect
            onComplete={(minutes) => addReset(minutes)}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}

        {currentScreen === 'thought-dump' && (
          <ThoughtDump
            lastThought={stats.lastThought}
            onSaveThought={setSavedThought}
            onClearThought={clearSavedThought}
            onComplete={() => addReset(1)}
            onReturnHome={handleReturnHome}
            onAnotherReset={handleAnotherReset}
          />
        )}
      </main>

      {/* Safety Disclaimer Footer */}
      <FooterDisclaimer />

      {/* Ambient Tunes Soundscape Modal */}
      {isTunesOpen && (
        <AmbientTunesPlayer
          isOpen={isTunesOpen}
          onClose={() => setIsTunesOpen(false)}
        />
      )}

      {/* Persistent Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        stats={stats}
        onClose={() => setIsSettingsOpen(false)}
        onUpdateSettings={updateSettings}
        onClearThought={clearSavedThought}
        onResetStats={resetAllStats}
      />
    </div>
  );
};

export default App;
