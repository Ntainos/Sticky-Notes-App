// src/features/notes/screens/CreateNoteScreen.tsx
import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../../../theme/colors';
import type { RootStackParamList } from '../../../navigation/types';
import type { Note } from '../types';
import { useNotes } from '../context/NotesContext';

type CreateNoteNavProp = NativeStackNavigationProp<
  RootStackParamList,
  'CreateNote'
>;

const templates: { id: Note['template']; label: string; color: string }[] = [
  { id: 'yellow', label: 'Post-it', color: colors.stickyYellow },
  { id: 'pink', label: 'Cute', color: colors.stickyPink },
  { id: 'blue', label: 'Calm', color: colors.stickyBlue },
  { id: 'green', label: 'Fresh', color: colors.stickyGreen },
];

export const CreateNoteScreen: React.FC = () => {
  const navigation = useNavigation<CreateNoteNavProp>();
  const { addNote } = useNotes();

  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [template, setTemplate] = useState<Note['template']>('yellow');

  const canSave = message.trim().length > 0;

  const handleSave = () => {
    if (!canSave) {
      Alert.alert('Empty note', 'Please write something in your note.');
      return;
    }

    addNote({ title, message, template, fromMe: true });
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.screenTitle}>Create a new note</Text>

          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.inputTitle}
            placeholder="Dinner idea, Groceries, Good luck..."
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          <Text style={styles.label}>Template</Text>
          <View style={styles.templatesRow}>
            {templates.map((tpl) => {
              const isSelected = tpl.id === template;
              return (
                <TouchableOpacity
                  key={tpl.id}
                  style={[
                    styles.templateOption,
                    { backgroundColor: tpl.color },
                    isSelected && styles.templateOptionSelected,
                  ]}
                  onPress={() => setTemplate(tpl.id)}
                  activeOpacity={0.8}
                >
                  <Text style={styles.templateLabel}>{tpl.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.label}>Message</Text>
          <TextInput
            style={styles.inputMessage}
            placeholder="Write your note here..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            value={message}
            onChangeText={setMessage}
          />

          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            disabled={!canSave}
            onPress={handleSave}
            activeOpacity={0.9}
          >
            <Text style={styles.saveButtonText}>Save note</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 6,
    marginTop: 16,
  },
  inputTitle: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#FFFFFF',
  },
  templatesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  templateOption: {
    flex: 1,
    marginRight: 8,
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  templateOptionSelected: {
    borderWidth: 2,
    borderColor: colors.accent,
  },
  templateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  inputMessage: {
    marginTop: 4,
    minHeight: 160,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    marginTop: 24,
    borderRadius: 24,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});

export default CreateNoteScreen;
