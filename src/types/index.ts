export type ActivityType = 'breathe' | 'reflex' | 'focus' | 'thought-dump';

export type ScreenType = 'home' | ActivityType;

export type FocusTaskOption = 'clean' | 'walk' | 'water' | 'problem';

export interface UserStats {
  resetsToday: number;
  totalResets: number;
  minutesRedirected: number;
  bestReactionTime: number | null;
  lastThought: string;
  lastActiveDate: string; // YYYY-MM-DD
}

export interface AppSettings {
  theme: 'dark' | 'light';
  reduceMotion: boolean;
  soundEnabled: boolean;
}

export interface FocusTaskItem {
  id: FocusTaskOption;
  icon: string;
  title: string;
  description: string;
  detail: string;
}
