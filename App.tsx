// App.tsx

import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import RootNavigator from './src/navigation/RootNavigator';
import { NotesProvider } from './src/features/notes/context/NotesContext';
import { SettingsProvider } from './src/features/settings/context/SettingsContext';
import { SpacesProvider } from './src/features/spaces/context/SpacesContext';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SettingsProvider>
          <SpacesProvider>
            <NotesProvider>
              <NavigationContainer>
                <RootNavigator />
              </NavigationContainer>
            </NotesProvider>
          </SpacesProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
