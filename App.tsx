// App.tsx
import React from 'react';
import { StatusBar } from 'react-native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <RootNavigator />
    </>
  );
}
