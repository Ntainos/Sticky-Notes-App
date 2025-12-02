// src/features/spaces/context/SpacesContext.tsx

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Space, SpaceMode } from '../types';

const SPACES_STORAGE_KEY = '@fridgeNotes/spaces';
const ACTIVE_SPACE_STORAGE_KEY = '@fridgeNotes/activeSpaceId';
const DEFAULT_ACTIVE_SPACE_ID = 'space-us';

const HEART_EMOJI = '\uD83D\uDC9B';
const HOUSE_EMOJI = '\uD83C\uDFE0';
const ROOMMATES_EMOJI = '\uD83D\uDC6B';
const SEEDLING_EMOJI = '\uD83C\uDF31';

interface SpacesContextValue {
  spaces: Space[];
  activeSpaceId: string | null;
  activeSpace: Space | null;
  setActiveSpace: (id: string) => void;
  createSpace: (payload: { name: string; mode: SpaceMode; emoji?: string }) => void;
  deleteSpace: (id: string) => void;
}

const SpacesContext = createContext<SpacesContextValue | undefined>(undefined);

const generateId = () =>
  `space-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

const defaultEmojiForMode = (mode: SpaceMode) => {
  switch (mode) {
    case 'couple':
      return HEART_EMOJI;
    case 'family':
      return HOUSE_EMOJI;
    case 'roommates':
      return ROOMMATES_EMOJI;
    case 'personal':
    default:
      return SEEDLING_EMOJI;
  }
};

const createDefaultSpaces = (): Space[] => [
  {
    id: 'space-us',
    name: 'Us',
    mode: 'couple',
    emoji: HEART_EMOJI,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'space-personal',
    name: 'Personal',
    mode: 'personal',
    emoji: SEEDLING_EMOJI,
    createdAt: new Date().toISOString(),
  },
];

export const SpacesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [activeSpaceId, setActiveSpaceId] = useState<string | null>(DEFAULT_ACTIVE_SPACE_ID);

  useEffect(() => {
    const load = async () => {
      try {
        const storedSpaces = await AsyncStorage.getItem(SPACES_STORAGE_KEY);
        const storedActiveId = await AsyncStorage.getItem(ACTIVE_SPACE_STORAGE_KEY);

        if (storedSpaces) {
          const parsedSpaces: Space[] = JSON.parse(storedSpaces);

          if (parsedSpaces.length > 0) {
            setSpaces(parsedSpaces);
            const safeActiveId =
              storedActiveId && parsedSpaces.some((s) => s.id === storedActiveId)
                ? storedActiveId
                : parsedSpaces[0].id;
            setActiveSpaceId(safeActiveId);

            if (!storedActiveId || storedActiveId !== safeActiveId) {
              await AsyncStorage.setItem(ACTIVE_SPACE_STORAGE_KEY, safeActiveId);
            }
            return;
          }
        }
      } catch (error) {
        console.warn('Failed to load spaces', error);
      }

      const defaults = createDefaultSpaces();
      setSpaces(defaults);
      setActiveSpaceId(DEFAULT_ACTIVE_SPACE_ID);
      try {
        await AsyncStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(defaults));
        await AsyncStorage.setItem(ACTIVE_SPACE_STORAGE_KEY, DEFAULT_ACTIVE_SPACE_ID);
      } catch (error) {
        console.warn('Failed to persist default spaces', error);
      }
    };

    load();
  }, []);

  const persistSpaces = useCallback(async (nextSpaces: Space[]) => {
    setSpaces(nextSpaces);
    try {
      await AsyncStorage.setItem(SPACES_STORAGE_KEY, JSON.stringify(nextSpaces));
    } catch (error) {
      console.warn('Failed to save spaces', error);
    }
  }, []);

  const persistActiveSpaceId = useCallback(async (id: string | null) => {
    setActiveSpaceId(id);
    try {
      if (id) {
        await AsyncStorage.setItem(ACTIVE_SPACE_STORAGE_KEY, id);
      } else {
        await AsyncStorage.removeItem(ACTIVE_SPACE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to save activeSpaceId', error);
    }
  }, []);

  const setActiveSpace = useCallback(
    (id: string) => {
      if (!spaces.some((s) => s.id === id)) {
        return;
      }
      void persistActiveSpaceId(id);
    },
    [persistActiveSpaceId, spaces],
  );

  const createSpace = useCallback(
    (payload: { name: string; mode: SpaceMode; emoji?: string }) => {
      const trimmedName = payload.name.trim();
      const finalName = trimmedName || 'New space';
      const emoji = payload.emoji || defaultEmojiForMode(payload.mode);

      const newSpace: Space = {
        id: generateId(),
        name: finalName,
        mode: payload.mode,
        emoji,
        createdAt: new Date().toISOString(),
      };

      const nextSpaces = [...spaces, newSpace];
      void persistSpaces(nextSpaces);
      void persistActiveSpaceId(newSpace.id);
    },
    [persistActiveSpaceId, persistSpaces, spaces],
  );

  const deleteSpace = useCallback(
    (id: string) => {
      const nextSpaces = spaces.filter((s) => s.id !== id);
      void persistSpaces(nextSpaces);

      if (id === activeSpaceId) {
        const fallbackId = nextSpaces[0]?.id ?? null;
        void persistActiveSpaceId(fallbackId);
      }
    },
    [activeSpaceId, persistActiveSpaceId, persistSpaces, spaces],
  );

  const activeSpace = useMemo(
    () => spaces.find((s) => s.id === activeSpaceId) ?? null,
    [activeSpaceId, spaces],
  );

  const value: SpacesContextValue = {
    spaces,
    activeSpaceId,
    activeSpace,
    setActiveSpace,
    createSpace,
    deleteSpace,
  };

  return <SpacesContext.Provider value={value}>{children}</SpacesContext.Provider>;
};

export const useSpaces = () => {
  const ctx = useContext(SpacesContext);
  if (!ctx) {
    throw new Error('useSpaces must be used within a SpacesProvider');
  }
  return ctx;
};
