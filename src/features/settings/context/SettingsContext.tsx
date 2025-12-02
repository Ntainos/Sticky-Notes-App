import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AppMode = 'couple' | 'roommates';

interface SettingsContextValue {
  mode: AppMode;
  setMode: (mode: AppMode) => Promise<void>;
}

const SETTINGS_STORAGE_KEY = '@fridgeNotes/settings';

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<AppMode>('couple');

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const stored = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as { mode?: AppMode };
          if (parsed.mode === 'couple' || parsed.mode === 'roommates') {
            setModeState(parsed.mode);
          }
        }
      } catch (error) {
        console.warn('Failed to load settings', error);
      }
    };

    loadSettings();
  }, []);

  const setMode = useCallback(async (nextMode: AppMode) => {
    setModeState(nextMode);
    try {
      await AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ mode: nextMode }));
    } catch (error) {
      console.warn('Failed to save settings', error);
    }
  }, []);

  const value: SettingsContextValue = {
    mode,
    setMode,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return ctx;
};
