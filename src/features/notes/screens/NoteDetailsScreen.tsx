import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { templateToColor } from '../utils/templateToColor'; // αν δεν έχεις αυτό, θα στο δώσω κάτω
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotes } from '../context/NotesContext';

type NoteRouteProp = RouteProp<RootStackParamList, 'NoteDetails'>;
type NoteNavProp = NativeStackNavigationProp<RootStackParamList, 'NoteDetails'>;

export const NoteDetailsScreen: React.FC = () => {
  const route = useRoute<NoteRouteProp>();
  const navigation = useNavigation<NoteNavProp>();
  const { deleteNote } = useNotes();

  const { note } = route.params;

  const handleDelete = () => {
    Alert.alert(
      'Delete note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteNote(note.id);
            navigation.goBack();
          },
        },
      ],
    );
  };

  const bgColor = templateToColor(note.template);

  const createdDate = new Date(note.createdAt);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Note</Text>
          <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.noteCard, { backgroundColor: bgColor }]}>
          <View style={styles.pinDot} />

          <Text style={styles.title}>{note.title}</Text>

          <Text style={styles.message}>{note.message}</Text>

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>
              {note.fromMe ? 'From you 💌' : 'From them 💛'}
            </Text>
            <Text style={styles.footerText}>
              {createdDate.toLocaleDateString()} {', '}
              {createdDate.toLocaleTimeString()}
            </Text>
          </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#FEE2E2',
  },
  deleteButtonText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 14,
  },
  noteCard: {
    flex: 1,
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 26,
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    transform: [{ rotate: '-1deg' }],
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
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
  },
  footerText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default NoteDetailsScreen;
