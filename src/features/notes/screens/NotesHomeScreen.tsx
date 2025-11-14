// src/features/notes/screens/NotesHomeScreen.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { StickyNoteCard } from '../components/StickyNoteCard';
import type { Note } from '../types';
import { colors } from '../../../theme/colors';

const dummyNotes: Note[] = [
  {
    id: '1',
    title: 'Coffee? ☕',
    message: 'Don’t forget our coffee date at 16:00 💕',
    template: 'yellow',
    createdAt: new Date().toISOString(),
    fromMe: false,
  },
  {
    id: '2',
    title: 'Groceries 🛒',
    message: '- Milk\n- Eggs\n- Pasta\n- Something sweet 😋',
    template: 'pink',
    createdAt: new Date().toISOString(),
    fromMe: true,
  },
  {
    id: '3',
    title: 'Proud of you',
    message: 'Good luck with your exam today, you got this. ✨',
    template: 'blue',
    createdAt: new Date().toISOString(),
    fromMe: false,
  },
  {
    id: '4',
    title: 'Dinner idea 🍝',
    message: 'Carbonara tonight? I’ll bring the parmesan!',
    template: 'green',
    createdAt: new Date().toISOString(),
    fromMe: true,
  },
];

export const NotesHomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <Text style={styles.appTitle}>Fridge Notes</Text>
        <Text style={styles.subtitle}>Little notes between two hearts 💛</Text>

        <View style={styles.fridgeArea}>
          <FlatList
            data={dummyNotes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <StickyNoteCard
                note={item}
                onPress={() => {
                  // later: navigate to note details
                  console.log('Pressed note', item.id);
                }}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },
  fridgeArea: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.fridge,
    paddingVertical: 12,
  },
  listContent: {
    paddingHorizontal: 4,
    paddingBottom: 16,
  },
});

export default NotesHomeScreen;
