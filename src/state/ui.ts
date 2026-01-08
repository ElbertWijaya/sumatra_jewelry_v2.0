import { Appearance } from 'react-native';
import { create } from 'zustand';

export type ThemeMode = 'system' | 'light' | 'dark';

interface UIState {
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
}

export const useUIStore = create<UIState>((set) => ({
  theme: 'system',
  setTheme: (theme) => set({ theme })
}));

export const getResolvedTheme = (theme: ThemeMode) => {
  if (theme === 'system') return Appearance.getColorScheme() ?? 'light';
  return theme;
};
