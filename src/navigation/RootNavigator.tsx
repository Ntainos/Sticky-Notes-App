import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootStackParamList } from './types';
import NotesHomeScreen from '../features/notes/screens/NotesHomeScreen';
import NoteDetailsScreen from '../features/notes/screens/NoteDetailsScreen';
import CreateNoteScreen from '../features/notes/screens/CreateNoteScreen';
import ModeSelectionScreen from '../features/settings/screens/ModeSelectionScreen';
import SpaceSwitcherScreen from '../features/spaces/screens/SpaceSwitcherScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const RootNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ModeSelection"
        component={ModeSelectionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="NotesHome"
        component={NotesHomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SpaceSwitcher"
        component={SpaceSwitcherScreen}
        options={{ title: 'Spaces' }}
      />
      <Stack.Screen
        name="CreateNote"
        component={CreateNoteScreen}
        options={{ title: 'New note' }}
      />
      <Stack.Screen
        name="NoteDetails"
        component={NoteDetailsScreen}
        options={{ title: 'Note' }}
      />
    </Stack.Navigator>
  );
};

export default RootNavigator;
