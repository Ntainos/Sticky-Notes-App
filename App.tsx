// App.tsx
import React from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { NotesProvider } from './src/features/notes/context/NotesContext';

export default function App() {
  return (
    <NotesProvider>
      <RootNavigator />
    </NotesProvider>
  );
}
