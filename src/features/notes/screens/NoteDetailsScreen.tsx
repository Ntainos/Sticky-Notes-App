import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { RootStackParamList } from '../../../navigation/types';
import { colors } from '../../../theme/colors';
import { templateToColor } from '../utils/templateToColor';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNotes } from '../context/NotesContext';
import type { NoteTemplate } from '../types';

type NoteRouteProp = RouteProp<RootStackParamList, 'NoteDetails'>;
type NoteNavProp = NativeStackNavigationProp<RootStackParamList, 'NoteDetails'>;

export const NoteDetailsScreen: React.FC = () => {
  const route = useRoute<NoteRouteProp>();
  const navigation = useNavigation<NoteNavProp>();
  const { notes, updateNote, deleteNote } = useNotes();

  const { note: routeNote } = route.params;

  // βρίσκουμε πάντα την πιο φρέσκια έκδοση του note από το context
  const note = useMemo(
    () => notes.find((n) => n.id === routeNote.id) ?? routeNote,
    [notes, routeNote],
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editMessage, setEditMessage] = useState(note.message);
  const [editTemplate, setEditTemplate] = useState<NoteTemplate>(note.template);

  const handleDelete = () => {
    Alert.alert('Delete note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteNote(note.id);
          navigation.goBack();
        },
      },
    ]);
  };

  const openEdit = () => {
    setEditTitle(note.title);
    setEditMessage(note.message);
    setEditTemplate(note.template);
    setIsEditing(true);
  };

  const closeEdit = () => {
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!editTitle.trim() && !editMessage.trim()) {
      // αν είναι τελείως άδειο, απλά μην κάνεις save
      return;
    }

    updateNote(note.id, {
      title: editTitle.trim() || 'Untitled',
      message: editMessage.trim(),
      template: editTemplate,
    });

    setIsEditing(false);
  };

  const bgColor = templateToColor(note.template);
  const createdDate = new Date(note.createdAt);

  const renderTemplatePill = (template: NoteTemplate, label: string) => {
    const isActive = editTemplate === template;
    return (
      <TouchableOpacity
        key={template}
        style={[
          styles.templatePill,
          isActive && styles.templatePillActive,
        ]}
        onPress={() => setEditTemplate(template)}
      >
        <View
          style={[
            styles.templateColorDot,
            { backgroundColor: templateToColor(template) },
          ]}
        />
        <Text
          style={[
            styles.templatePillText,
            isActive && styles.templatePillTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.screenTitle}>Note</Text>
          <View style={styles.headerButtonsRow}>
            <TouchableOpacity
              style={[styles.headerPillButton, styles.editButton]}
              onPress={openEdit}
            >
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.headerPillButton, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
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
              {createdDate.toLocaleDateString()},{' '}
              {createdDate.toLocaleTimeString()}
            </Text>
          </View>
        </View>

        {/* Edit modal */}
        <Modal visible={isEditing} animationType="slide" transparent>
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeEdit} />
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>Edit note</Text>

              <TextInput
                placeholder="Title"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={editTitle}
                onChangeText={setEditTitle}
              />

              <TextInput
                placeholder="Write your note..."
                placeholderTextColor="#9CA3AF"
                style={[styles.input, styles.messageInput]}
                value={editMessage}
                onChangeText={setEditMessage}
                multiline
              />

              <Text style={styles.sectionLabel}>Template</Text>
              <View style={styles.templateRow}>
                {renderTemplatePill('yellow', 'Post-it')}
                {renderTemplatePill('pink', 'Cute')}
                {renderTemplatePill('blue', 'Calm')}
                {renderTemplatePill('green', 'Fresh')}
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonSecondary]}
                  onPress={closeEdit}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveEdit}
                >
                  <Text style={styles.modalButtonPrimaryText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </Modal>
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
  headerButtonsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerPillButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  editButton: {
    backgroundColor: '#E5E7EB',
  },
  editButtonText: {
    color: colors.textPrimary,
    fontWeight: '600',
    fontSize: 14,
  },
  deleteButton: {
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
  // modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  messageInput: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 8,
    marginBottom: 6,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  templatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  templatePillActive: {
    backgroundColor: '#111827',
  },
  templateColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  templatePillText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  templatePillTextActive: {
    color: '#F9FAFB',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    marginLeft: 8,
  },
  modalButtonSecondary: {
    backgroundColor: '#E5E7EB',
  },
  modalButtonSecondaryText: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '500',
  },
  modalButtonPrimary: {
    backgroundColor: colors.accent,
  },
  modalButtonPrimaryText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },
});

export default NoteDetailsScreen;
