// src/features/notes/components/StickyNoteCard.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import type { Note } from '../types';
import { colors } from '../../../theme/colors';

interface StickyNoteCardProps {
  note: Note;
  onPress?: () => void;
}

const templateToColor = (template: Note['template']) => {
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

export const StickyNoteCard: React.FC<StickyNoteCardProps> = ({
  note,
  onPress,
}) => {
  const backgroundColor = templateToColor(note.template);

  return (
    <TouchableOpacity
      style={[styles.cardContainer, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.pinDot} />
      <Text style={styles.title} numberOfLines={1}>
        {note.title}
      </Text>
      <Text style={styles.message} numberOfLines={4}>
        {note.message}
      </Text>
      <Text style={styles.footer} numberOfLines={1}>
        {note.fromMe ? 'From you 💌' : 'From them 💛'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    paddingTop: 10,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    transform: [{ rotate: '-1deg' }],
},
  pinDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#9CA3AF',
    alignSelf: 'flex-end',
    marginBottom: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  footer: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 'auto',
    textAlign: 'right',
  },
});

export default StickyNoteCard;
