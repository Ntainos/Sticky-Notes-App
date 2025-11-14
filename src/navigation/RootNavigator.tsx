// src/navigation/RootNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NotesHomeScreen } from '../features/notes/screens/NotesHomeScreen';
import { NoteDetailsScreen } from '../features/notes/screens/NoteDetailsScreen';
import { CreateNoteScreen } from '../features/notes/screens/CreateNoteScreen';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={NotesHomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="NoteDetails"
          component={NoteDetailsScreen}
          options={{ title: 'Note' }}
        />
        <Stack.Screen
          name="CreateNote"
          component={CreateNoteScreen}
          options={{ title: 'New note' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
