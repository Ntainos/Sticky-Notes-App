// src/features/notes/context/NotesContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import type { Note } from '../types';

type NotesContextValue = {
  notes: Note[];
  addNote: (input: {
    title: string;
    message: string;
    template: Note['template'];
    fromMe?: boolean;
  }) => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const initialNotes: Note[] = [
  {
    id: '1',
    title: 'Coffee? ☕',
    message: 'Don’t forget our coffee date at 16:00 💕',
    template: 'yellow',
    createdAt: new Date().toISOString(),
    fromMe: false,
  },
  {
    id: '2',
    title: 'Groceries 🛒',
    message: '- Milk\n- Eggs\n- Pasta\n- Something sweet 😋',
    template: 'pink',
    createdAt: new Date().toISOString(),
    fromMe: true,
  },
  {
    id: '3',
    title: 'Proud of you',
    message: 'Good luck with your exam today, you got this. ✨',
    template: 'blue',
    createdAt: new Date().toISOString(),
    fromMe: false,
  },
  {
    id: '4',
    title: 'Dinner idea 🍝',
    message: 'Carbonara tonight? I’ll bring the parmesan!',
    template: 'green',
    createdAt: new Date().toISOString(),
    fromMe: true,
  },
];

export const NotesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const addNote: NotesContextValue['addNote'] = ({
    title,
    message,
    template,
    fromMe = true,
  }) => {
    const trimmedMessage = message.trim();
    const trimmedTitle = title.trim();

    if (!trimmedMessage) {
      return;
    }

    const newNote: Note = {
      id: Date.now().toString(),
      title: trimmedTitle || 'Untitled',
      message: trimmedMessage,
      template,
      createdAt: new Date().toISOString(),
      fromMe,
    };

    // νέο note πάνω-πάνω
    setNotes((prev) => [newNote, ...prev]);
  };

  return (
    <NotesContext.Provider value={{ notes, addNote }}>
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
