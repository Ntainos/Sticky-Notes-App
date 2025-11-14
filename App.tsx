// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { NotesHomeScreen } from './src/features/notes/screens/NotesHomeScreen';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <NotesHomeScreen />
    </>
  );
}
