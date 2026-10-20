import { useState, useEffect } from 'react';
import type { UserStats, AppSettings } from '../types';

const STATS_KEY = 'reset_user_stats_v1';
const SETTINGS_KEY = 'reset_user_settings_v1';

const getTodayString = (): string => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const defaultStats: UserStats = {
  resetsToday: 0,
  totalResets: 0,
  minutesRedirected: 0,
  bestReactionTime: null,
  lastThought: '',
  lastActiveDate: getTodayString(),
};

const defaultSettings: AppSettings = {
  theme: 'dark',
  reduceMotion: false,
  soundEnabled: true,
};

export function useStats() {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const stored = localStorage.getItem(STATS_KEY);
      if (stored) {
        const parsed: UserStats = JSON.parse(stored);
        const today = getTodayString();
        // Reset daily count if date has rolled over
        if (parsed.lastActiveDate !== today) {
          return {
            ...parsed,
            resetsToday: 0,
            lastActiveDate: today,
          };
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to read stats from localStorage', e);
    }
    return defaultStats;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to read settings from localStorage', e);
    }
    return defaultSettings;
  });

  // Sync stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed to write stats to localStorage', e);
    }
  }, [stats]);

  // Sync settings to localStorage and apply theme/reduced motion classes
  useEffect(() => {
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to write settings to localStorage', e);
    }

    // Apply theme to document
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light-theme');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light-theme');
    }

    // Apply reduced motion class to root
    if (settings.reduceMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
  }, [settings]);

  const addReset = (minutes: number = 1) => {
    const today = getTodayString();
    setStats((prev) => {
      const isNewDay = prev.lastActiveDate !== today;
      return {
        ...prev,
        resetsToday: isNewDay ? 1 : prev.resetsToday + 1,
        totalResets: prev.totalResets + 1,
        minutesRedirected: prev.minutesRedirected + minutes,
        lastActiveDate: today,
      };
    });
  };

  const recordReactionTime = (timeMs: number) => {
    setStats((prev) => {
      const currentBest = prev.bestReactionTime;
      const newBest = currentBest === null ? timeMs : Math.min(currentBest, timeMs);
      return {
        ...prev,
        bestReactionTime: newBest,
      };
    });
  };

  const setSavedThought = (thought: string) => {
    setStats((prev) => ({
      ...prev,
      lastThought: thought.trim(),
    }));
  };

  const clearSavedThought = () => {
    setStats((prev) => ({
      ...prev,
      lastThought: '',
    }));
  };

  const resetAllStats = () => {
    const resetValues: UserStats = {
      resetsToday: 0,
      totalResets: 0,
      minutesRedirected: 0,
      bestReactionTime: null,
      lastThought: '',
      lastActiveDate: getTodayString(),
    };
    setStats(resetValues);
  };

  const updateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  return {
    stats,
    settings,
    addReset,
    recordReactionTime,
    setSavedThought,
    clearSavedThought,
    resetAllStats,
    updateSettings,
  };
}
