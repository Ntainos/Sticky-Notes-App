// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { NotesProvider } from './src/features/notes/context/NotesContext';

export default function App() {
  return (
    <NotesProvider>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <RootNavigator />
    </NotesProvider>
  );
}
