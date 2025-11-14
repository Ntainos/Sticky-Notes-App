// src/navigation/types.ts
import type { Note } from '../features/notes/types';

export type RootStackParamList = {
  Home: undefined;
  NoteDetails: { note: Note };
  CreateNote: undefined;
};
