// src/features/notes/screens/NoteDetailsScreen.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';

type NoteDetailsRouteProp = RouteProp<RootStackParamList, 'NoteDetails'>;

const templateToColor = (template: 'yellow' | 'pink' | 'blue' | 'green') => {
  switch (template) {
    case 'pink':
      return colors.stickyPink;
    case 'blue':
      return colors.stickyBlue;
    case 'green':
      return colors.stickyGreen;
    case 'yellow':
    default:
      return colors.stickyYellow;
  }
};

export const NoteDetailsScreen: React.FC = () => {
  const route = useRoute<NoteDetailsRouteProp>();
  const { note } = route.params;

  const backgroundColor = templateToColor(note.template);
  const createdAtLabel = new Date(note.createdAt).toLocaleString();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.noteContainer, { backgroundColor }]}>
        <View style={styles.pinDot} />
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.message}>{note.message}</Text>
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>
            {note.fromMe ? 'From you 💌' : 'From them 💛'}
          </Text>
          <Text style={styles.footerText}>{createdAtLabel}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noteContainer: {
    width: '85%',
    minHeight: '50%',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    transform: [{ rotate: '-2deg' }],
  },
  pinDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#9CA3AF',
    alignSelf: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
    textAlign: 'left',
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    lineHeight: 22,
  },
  footerRow: {
    marginTop: 'auto',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});

export default NoteDetailsScreen;
