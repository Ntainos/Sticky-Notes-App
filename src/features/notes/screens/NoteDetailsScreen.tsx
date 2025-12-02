import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { useNotes } from '../context/NotesContext';
import { NoteTemplate } from '../types';
import { templateToColor } from '../utils/templateToColor';
import colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'NoteDetails'>;

const NoteDetailsScreen: React.FC<Props> = ({ navigation, route }) => {
  const { noteId, startInEditMode } = route.params;
  const { notes, deleteNote, updateNote } = useNotes();

  const note = React.useMemo(() => notes.find((n) => n.id === noteId), [notes, noteId]);

  const [isEditModalVisible, setEditModalVisible] = React.useState(false);
  const [draftTitle, setDraftTitle] = React.useState(note?.title ?? '');
  const [draftBody, setDraftBody] = React.useState(note?.body ?? '');
  const [draftTemplate, setDraftTemplate] = React.useState<NoteTemplate>(
    note?.template ?? 'postit',
  );

  React.useEffect(() => {
    if (!note) return;
    setDraftTitle(note.title);
    setDraftBody(note.body);
    setDraftTemplate(note.template);
  }, [note]);

  React.useEffect(() => {
    if (startInEditMode && note) {
      setEditModalVisible(true);
    }
  }, [startInEditMode, note]);

  const openEditModal = React.useCallback(() => {
    if (!note) return;
    setDraftTitle(note.title);
    setDraftBody(note.body);
    setDraftTemplate(note.template);
    setEditModalVisible(true);
  }, [note]);

  const closeEditModal = React.useCallback(() => {
    setEditModalVisible(false);
  }, []);

  const handleSaveEdit = React.useCallback(async () => {
    if (!note) return;

    const trimmedTitle = draftTitle.trim();
    const trimmedBody = draftBody.trim();

    if (!trimmedTitle && !trimmedBody) {
      Alert.alert('Empty note', 'Please add a title or some text.');
      return;
    }

    await updateNote(
      note.id,
      trimmedTitle || 'Untitled',
      trimmedBody,
      draftTemplate,
      note.deliveryStyle,
    );

    setEditModalVisible(false);
  }, [draftBody, draftTemplate, draftTitle, note, updateNote]);

  const handleDeletePress = React.useCallback(() => {
    if (!note) {
      return;
    }

    Alert.alert('Delete note', 'Are you sure you want to delete this note?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteNote(note.id);
          navigation.navigate('NotesHome');
        },
      },
    ]);
  }, [deleteNote, navigation, note]);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Note',
      headerRight: () =>
        note ? (
          <View style={styles.headerButtons}>
            <TouchableOpacity onPress={openEditModal}>
              <Text style={styles.headerEditText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress}>
              <Text style={styles.headerDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ) : null,
    });
  }, [handleDeletePress, navigation, note, openEditModal]);

  if (!note) {
    return (
      <View style={styles.centered}>
        <Text style={styles.mutedText}>Note not found.</Text>
      </View>
    );
  }

  const templateColors = templateToColor(note.template);
  const formattedDate = new Date(note.createdAt).toLocaleString();
  const senderText = note.sender === 'you' ? 'From you' : 'From them';

  return (
    <View style={styles.screen}>
      <View style={[styles.card, { backgroundColor: templateColors.background }]}>
        <View style={styles.cardPinWrapper}>
          <View style={[styles.cardPin, { backgroundColor: templateColors.pin }]} />
        </View>

        <Text style={[styles.title, { color: templateColors.text }]} numberOfLines={2}>
          {note.title}
        </Text>

        {!!note.body && (
          <Text style={[styles.content, { color: templateColors.text }]}>{note.body}</Text>
        )}

        <View style={styles.footerRow}>
          <Text style={[styles.footerText, { color: templateColors.footerText }]}>
            {senderText}
          </Text>
          <Text style={[styles.footerText, { color: templateColors.footerText }]}>
            {formattedDate}
          </Text>
        </View>
      </View>

      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent
        onRequestClose={closeEditModal}
      >
        <KeyboardAvoidingView
          style={styles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit note</Text>

            <TextInput
              style={styles.input}
              value={draftTitle}
              onChangeText={setDraftTitle}
              placeholder="Title"
              placeholderTextColor="#B0B0B0"
            />

            <TextInput
              style={[styles.input, styles.multilineInput]}
              value={draftBody}
              onChangeText={setDraftBody}
              placeholder="Write your note..."
              placeholderTextColor="#B0B0B0"
              multiline
            />

            <Text style={styles.templateLabel}>Template</Text>
            <View style={styles.templateRow}>
              {(['postit', 'cute', 'calm', 'fresh'] as NoteTemplate[]).map((tpl) => (
                <TouchableOpacity
                  key={tpl}
                  style={[
                    styles.templateChip,
                    draftTemplate === tpl && styles.templateChipActive,
                  ]}
                  onPress={() => setDraftTemplate(tpl)}
                >
                  <Text
                    style={[
                      styles.templateChipText,
                      draftTemplate === tpl && styles.templateChipTextActive,
                    ]}
                  >
                    {tpl === 'postit'
                      ? 'Post-it'
                      : tpl.charAt(0).toUpperCase() + tpl.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity style={styles.modalButtonSecondary} onPress={closeEditModal}>
                <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButtonPrimary} onPress={handleSaveEdit}>
                <Text style={styles.modalButtonPrimaryText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
  mutedText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  card: {
    borderRadius: 24,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  cardPinWrapper: {
    position: 'absolute',
    top: 16,
    left: '50%',
    marginLeft: -8,
  },
  cardPin: {
    width: 16,
    height: 16,
    borderRadius: 999,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 24,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontWeight: '500',
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  headerEditText: {
    color: colors.accent,
    fontSize: 16,
    fontWeight: '500',
  },
  headerDeleteText: {
    color: '#FF3B30',
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },
  modalCard: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    color: colors.textPrimary,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    marginBottom: 12,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  templateLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.textSecondary,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  templateChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ECEFF4',
  },
  templateChipActive: {
    backgroundColor: colors.accent,
  },
  templateChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  templateChipTextActive: {
    color: '#FFF',
  },
  modalButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  modalButtonSecondary: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ECEFF4',
    marginRight: 8,
  },
  modalButtonSecondaryText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  modalButtonPrimary: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  modalButtonPrimaryText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default NoteDetailsScreen;
