// src/features/spaces/types.ts

export type SpaceMode = 'couple' | 'family' | 'roommates' | 'personal';

export interface Space {
  id: string;
  name: string;
  mode: SpaceMode;
  emoji: string;
  createdAt: string; // ISO string
}
