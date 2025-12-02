// src/features/notes/types.ts

export type NoteSender = 'you' | 'them';

export type NoteTemplate = 'postit' | 'cute' | 'calm' | 'fresh';

export type NoteDeliveryStyle = 'sticky' | 'letter';

export interface Note {
  id: string;
  title: string;
  body: string;
  sender: NoteSender;
  template: NoteTemplate;
  deliveryStyle: NoteDeliveryStyle;
  createdAt: string;
  spaceId: string;
}
