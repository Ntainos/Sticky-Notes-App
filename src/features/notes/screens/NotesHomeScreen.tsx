import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Modal,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { StickyNoteCard } from '../components/StickyNoteCard';
import type { NoteTemplate } from '../types';
import { colors } from '../../../theme/colors';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../../navigation/types';
import { useNotes } from '../context/NotesContext';

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

type NotesFilter = 'all' | 'me' | 'them';

export const NotesHomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { notes, addNote } = useNotes();

  const [filter, setFilter] = useState<NotesFilter>('all');

  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [newTemplate, setNewTemplate] = useState<NoteTemplate>('yellow');

  const openCreateModal = () => {
    setIsCreating(true);
  };

  const closeCreateModal = () => {
    setIsCreating(false);
    setNewTitle('');
    setNewMessage('');
    setNewTemplate('yellow');
  };

  const handleSaveNote = () => {
    if (!newTitle.trim() && !newMessage.trim()) {
      return;
    }

    addNote({
      title: newTitle,
      message: newMessage,
      template: newTemplate,
      fromMe: true,
    });

    closeCreateModal();
  };

  const renderTemplatePill = (template: NoteTemplate, label: string) => {
    const isActive = newTemplate === template;
    return (
      <TouchableOpacity
        key={template}
        style={[
          styles.templatePill,
          isActive && styles.templatePillActive,
        ]}
        onPress={() => setNewTemplate(template)}
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

  const renderFilterChip = (value: NotesFilter, label: string) => {
    const isActive = filter === value;
    return (
      <TouchableOpacity
        key={value}
        style={[
          styles.filterChip,
          isActive && styles.filterChipActive,
        ]}
        onPress={() => setFilter(value)}
      >
        <Text
          style={[
            styles.filterChipText,
            isActive && styles.filterChipTextActive,
          ]}
        >
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const filteredNotes = notes.filter((note) => {
    if (filter === 'all') return true;
    if (filter === 'me') return note.fromMe;
    if (filter === 'them') return !note.fromMe;
    return true;
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screenContainer}>
        <Text style={styles.appTitle}>Fridge Notes</Text>
        <Text style={styles.subtitle}>Little notes between two hearts 💛</Text>

        {/* Filter row */}
        <View style={styles.filterRow}>
          {renderFilterChip('all', 'All')}
          {renderFilterChip('me', 'From you')}
          {renderFilterChip('them', 'From them')}
        </View>

        <View style={styles.fridgeArea}>
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            columnWrapperStyle={styles.columnWrapper}
            renderItem={({ item }) => (
              <View style={styles.noteItem}>
                <StickyNoteCard
                  note={item}
                  onPress={() =>
                    navigation.navigate('NoteDetails', { note: item })
                  }
                />
              </View>
            )}
          />
        </View>

        {/* Floating + button */}
        <TouchableOpacity style={styles.fab} onPress={openCreateModal}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>

        {/* New note modal */}
        <Modal visible={isCreating} animationType="slide" transparent>
          <KeyboardAvoidingView
            style={styles.modalOverlay}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <Pressable style={styles.modalBackdrop} onPress={closeCreateModal} />
            <View style={styles.modalCard}>
              <Text style={styles.modalTitle}>New note</Text>

              <TextInput
                placeholder="Title"
                placeholderTextColor="#9CA3AF"
                style={styles.input}
                value={newTitle}
                onChangeText={setNewTitle}
              />

              <TextInput
                placeholder="Write your note..."
                placeholderTextColor="#9CA3AF"
                style={[styles.input, styles.messageInput]}
                value={newMessage}
                onChangeText={setNewMessage}
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
                  onPress={closeCreateModal}
                >
                  <Text style={styles.modalButtonSecondaryText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonPrimary]}
                  onPress={handleSaveNote}
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

const templateToColor = (template: NoteTemplate) => {
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
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    backgroundColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#111827',
  },
  filterChipText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  filterChipTextActive: {
    color: '#F9FAFB',
    fontWeight: '600',
  },
  fridgeArea: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: colors.fridge,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  listContent: {
    paddingBottom: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  noteItem: {
    width: '48%',
    marginBottom: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  fabText: {
    fontSize: 32,
    color: '#fff',
    marginTop: -2,
  },
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

export default NotesHomeScreen;
