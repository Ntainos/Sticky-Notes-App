import React from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { NoteDeliveryStyle, NoteTemplate } from '../types';
import { useNotes } from '../context/NotesContext';
import colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'CreateNote'>;

const TEMPLATE_OPTIONS: NoteTemplate[] = ['postit', 'cute', 'calm', 'fresh'];
const DELIVERY_OPTIONS: NoteDeliveryStyle[] = ['sticky', 'letter'];

const CreateNoteScreen: React.FC<Props> = ({ navigation }) => {
  const { addNote } = useNotes();

  const [title, setTitle] = React.useState('');
  const [body, setBody] = React.useState('');
  const [template, setTemplate] = React.useState<NoteTemplate>('postit');
  const [deliveryStyle, setDeliveryStyle] = React.useState<NoteDeliveryStyle>('sticky');
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = React.useCallback(async () => {
    const trimmedTitle = title.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle && !trimmedBody) {
      Alert.alert('Empty note', 'Please add a title or some text.');
      return;
    }

    setIsSaving(true);
    await addNote(trimmedTitle || 'Untitled', trimmedBody, template, deliveryStyle);
    setIsSaving(false);
    navigation.goBack();
  }, [addNote, body, deliveryStyle, navigation, template, title]);

  const handleCancel = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.screenTitle}>New note</Text>

          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Title"
            placeholderTextColor="#B0B0B0"
            returnKeyType="next"
          />

          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={body}
            onChangeText={setBody}
            placeholder="Write your note..."
            placeholderTextColor="#B0B0B0"
            multiline
          />

          <Text style={styles.sectionLabel}>Template</Text>
          <View style={styles.chipRow}>
            {TEMPLATE_OPTIONS.map((tpl) => (
              <TouchableOpacity
                key={tpl}
                style={[styles.chip, template === tpl && styles.chipActive]}
                onPress={() => setTemplate(tpl)}
                activeOpacity={0.9}
              >
                <Text style={[styles.chipText, template === tpl && styles.chipTextActive]}>
                  {tpl === 'postit' ? 'Post-it' : tpl.charAt(0).toUpperCase() + tpl.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.sectionLabel}>Style</Text>
          <View style={styles.chipRow}>
            {DELIVERY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.chip, deliveryStyle === option && styles.chipActive]}
                onPress={() => setDeliveryStyle(option)}
                activeOpacity={0.9}
              >
                <Text style={[styles.chipText, deliveryStyle === option && styles.chipTextActive]}>
                  {option === 'sticky' ? 'Sticky note' : 'Letter'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <View style={styles.footerButtons}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
            activeOpacity={0.9}
            disabled={isSaving}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, isSaving && styles.primaryButtonDisabled]}
            onPress={handleSave}
            activeOpacity={0.9}
            disabled={isSaving}
          >
            <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 32,
  },
  screenTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
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
    minHeight: 120,
    textAlignVertical: 'top',
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ECEFF4',
  },
  chipActive: {
    backgroundColor: colors.accent,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFF',
  },
  footerButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.cardShadow,
    backgroundColor: colors.surface,
  },
  secondaryButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: '#ECEFF4',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.textPrimary,
  },
  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  primaryButtonDisabled: {
    opacity: 0.7,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFF',
  },
});

export default CreateNoteScreen;
