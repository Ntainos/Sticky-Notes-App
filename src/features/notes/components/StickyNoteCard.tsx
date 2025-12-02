// src/features/notes/components/StickyNoteCard.tsx

import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Note } from '../types';
import { templateToColor } from '../utils/templateToColor';
import colors from '../../../theme/colors';

type Props = {
  note: Note;
  onPress: () => void;
  onLongPress?: () => void; // Future hook for context menu (edit/delete/share)
};

const StickyNoteCard: React.FC<Props> = ({ note, onPress, onLongPress }) => {
  const templateColors = templateToColor(note.template);
  const footerText = note.sender === 'you' ? 'From you' : 'From them';

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      onLongPress={onLongPress}
      style={styles.shadow}
    >
      <View style={[styles.card, { backgroundColor: templateColors.background }]}>
        <View style={[styles.pin, { backgroundColor: templateColors.pin }]} />

        <Text style={[styles.title, { color: templateColors.text }]} numberOfLines={1}>
          {note.title}
        </Text>

        {note.body ? (
          <Text style={[styles.body, { color: templateColors.text }]} numberOfLines={3}>
            {note.body}
          </Text>
        ) : null}

        <View style={styles.footerRow}>
          <Text style={[styles.footerSender, { color: templateColors.footerText }]}>
            {footerText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  shadow: {
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    minHeight: 140,
  },
  pin: {
    position: 'absolute',
    top: 10,
    right: 14,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  body: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerRow: {
    marginTop: 10,
  },
  footerSender: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default StickyNoteCard;
