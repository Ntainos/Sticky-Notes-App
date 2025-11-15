// src/features/notes/context/NotesContext.tsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, NoteSender, NoteTemplate } from '../types';
import { initialNotes } from '../data/initialNotes';

const NOTES_STORAGE_KEY = '@fridgeNotes/notes';

type NewNoteInput = {
  title: string;
  body: string;
  template: NoteTemplate;
  sender: NoteSender;
};

type NotesContextValue = {
  notes: Note[];
  addNote: (input: NewNoteInput) => void;
  updateNote: (id: string, updates: Partial<NewNoteInput>) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [hasHydrated, setHasHydrated] = useState(false);

  // Load notes from storage on first mount
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const stored = await AsyncStorage.getItem(NOTES_STORAGE_KEY);
        if (stored) {
          const parsed: Note[] = JSON.parse(stored);
          setNotes(parsed);
        }
      } catch (error) {
        console.warn('Failed to load notes from storage', error);
      } finally {
        setHasHydrated(true);
      }
    };

    loadNotes();
  }, []);

  // Save notes whenever they change (after initial hydration)
  useEffect(() => {
    if (!hasHydrated) return;

    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.warn('Failed to save notes to storage', error);
      }
    };

    saveNotes();
  }, [notes, hasHydrated]);

  const addNote = useCallback((input: NewNoteInput) => {
    const now = new Date().toISOString();
    const newNote: Note = {
      id: Math.random().toString(36).slice(2),
      createdAt: now,
      ...input,
    };

    setNotes((prev) => [newNote, ...prev]);
  }, []);

  const updateNote = useCallback(
    (id: string, updates: Partial<NewNoteInput>) => {
      setNotes((prev) =>
        prev.map((note) =>
          note.id === id
            ? {
                ...note,
                ...updates,
              }
            : note,
        ),
      );
    },
    [],
  );

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  return (
    <NotesContext.Provider value={{ notes, addNote, updateNote, deleteNote }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = (): NotesContextValue => {
  const ctx = useContext(NotesContext);

  if (!ctx) {
    throw new Error('useNotes must be used within a NotesProvider');
  }

  return ctx;
};
