import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Note, NoteTemplate } from '../types';

type NotesContextValue = {
  notes: Note[];
  addNote: (input: {
    title: string;
    message: string;
    template: NoteTemplate;
    fromMe: boolean;
  }) => void;
  deleteNote: (id: string) => void;
};

const NotesContext = createContext<NotesContextValue | undefined>(undefined);

const createInitialNotes = (): Note[] => {
  const now = new Date().toISOString();

  return [
    {
      id: '1',
      title: 'Coffee? ☕',
      message: 'Don’t forget our coffee date at 16:00 💕',
      template: 'yellow',
      createdAt: now,
      fromMe: false,
    },
    {
      id: '2',
      title: 'Groceries 🛒',
      message: '- Milk\n- Eggs\n- Pasta\n- Something sweet 😋',
      template: 'pink',
      createdAt: now,
      fromMe: true,
    },
    {
      id: '3',
      title: 'Proud of you',
      message: 'Good luck with your exam today, you got this. ✨',
      template: 'blue',
      createdAt: now,
      fromMe: false,
    },
    {
      id: '4',
      title: 'Dinner idea 🍝',
      message: 'Carbonara tonight? I’ll bring the parmesan!',
      template: 'green',
      createdAt: now,
      fromMe: true,
    },
  ];
};

type NotesProviderProps = {
  children: ReactNode;
};

export const NotesProvider: React.FC<NotesProviderProps> = ({ children }) => {
  const [notes, setNotes] = useState<Note[]>(createInitialNotes);

  const addNote: NotesContextValue['addNote'] = ({
    title,
    message,
    template,
    fromMe,
  }) => {
    const now = new Date().toISOString();
    const note: Note = {
      id: now + Math.random().toString(36).slice(2),
      title: title.trim() || 'Untitled',
      message: message.trim(),
      template,
      createdAt: now,
      fromMe,
    };

    // προσθέτουμε στο τέλος (κάτω στο grid)
    setNotes((prev) => [...prev, note]);
  };

  const deleteNote: NotesContextValue['deleteNote'] = (id) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NotesContext.Provider value={{ notes, addNote, deleteNote }}>
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
