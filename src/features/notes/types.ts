// src/features/notes/types.ts

export type NoteTemplate = 'yellow' | 'pink' | 'blue' | 'green';

export interface Note {
  id: string;
  title: string;
  message: string;
  template: NoteTemplate;
  createdAt: string; // ISO string
  fromMe: boolean;   // true = εγώ έστειλα, false = ο/η άλλος
}
