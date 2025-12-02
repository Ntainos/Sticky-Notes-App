// src/features/notes/context/NotesContext.tsx

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Note, NoteTemplate, NoteDeliveryStyle } from '../types';
import { useSpaces } from '../../spaces/context/SpacesContext';

const NOTES_STORAGE_KEY = '@fridgeNotes/notes';

interface NotesContextValue {
  notes: Note[];
  isLoading: boolean;
  addNote: (
    title: string,
    body: string,
    template: NoteTemplate,
    deliveryStyle: NoteDeliveryStyle,
  ) => Promise<void>;
  updateNote: (
    id: string,
    title: string,
    body: string,
    template: NoteTemplate,
    deliveryStyle: NoteDeliveryStyle,
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
}

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const generateId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const NotesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { activeSpaceId, spaces } = useSpaces();
  const [allNotes, setAllNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadNotes = async () => {
      try {
        const raw = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
        if (raw) {
          const parsedRaw = JSON.parse(raw) as any[];
          const normalized: Note[] = parsedRaw.map((n) => ({
            id: n.id,
            title: n.title ?? '',
            body: n.body ?? '',
            sender: n.sender ?? 'you',
            template: n.template ?? 'postit',
            deliveryStyle: n.deliveryStyle ?? 'sticky',
            createdAt: n.createdAt ?? new Date().toISOString(),
            spaceId: n.spaceId ?? 'space-us',
          }));
          setAllNotes(normalized);
        } else {
          setAllNotes([]);
        }
      } catch (error) {
        console.warn('Failed to load notes', error);
        setAllNotes([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  const persistNotes = async (nextNotes: Note[]) => {
    setAllNotes(nextNotes);
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(nextNotes));
    } catch (error) {
      console.warn('Failed to save notes', error);
    }
  };

  const notes = useMemo(
    () =>
      activeSpaceId ? allNotes.filter((n) => n.spaceId === activeSpaceId) : [],
    [activeSpaceId, allNotes],
  );

  const addNote = async (
    title: string,
    body: string,
    template: NoteTemplate,
    deliveryStyle: NoteDeliveryStyle,
  ) => {
    const fallbackSpaceId = activeSpaceId ?? spaces[0]?.id;
    if (!fallbackSpaceId) {
      // If no active space exists, avoid creating an orphaned note.
      console.warn('No active space to attach note to');
      return;
    }

    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    const newNote: Note = {
      id: generateId(),
      title: trimmedTitle || 'Untitled',
      body: trimmedBody,
      sender: 'you',
      template,
      deliveryStyle,
      createdAt: new Date().toISOString(),
      spaceId: fallbackSpaceId,
    };

    const next = [newNote, ...allNotes];
    await persistNotes(next);
  };

  const updateNote = async (
    id: string,
    title: string,
    body: string,
    template: NoteTemplate,
    deliveryStyle: NoteDeliveryStyle,
  ) => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    const next = allNotes.map((n) =>
      n.id === id
        ? {
            ...n,
            title: trimmedTitle || 'Untitled',
            body: trimmedBody,
            template,
            deliveryStyle,
          }
        : n,
    );

    await persistNotes(next);
  };

  const deleteNote = async (id: string) => {
    const next = allNotes.filter((n) => n.id !== id);
    await persistNotes(next);
  };

  const value: NotesContextValue = {
    notes,
    isLoading,
    addNote,
    updateNote,
    deleteNote,
  };

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
};

export const useNotes = () => {
  const ctx = useContext(NotesContext);
  if (!ctx) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return ctx;
};
