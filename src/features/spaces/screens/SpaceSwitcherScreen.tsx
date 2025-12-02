import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { useSpaces } from '../context/SpacesContext';
import { Space, SpaceMode } from '../types';
import colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'SpaceSwitcher'>;

const MODE_OPTIONS: SpaceMode[] = ['couple', 'family', 'roommates', 'personal'];

const SpaceSwitcherScreen: React.FC<Props> = ({ navigation }) => {
  const { spaces, activeSpaceId, setActiveSpace, createSpace } = useSpaces();
  const [newName, setNewName] = useState('');
  const [newMode, setNewMode] = useState<SpaceMode>('couple');

  const sortedSpaces = useMemo(
    () => [...spaces].sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [spaces],
  );

  const handleSelect = (space: Space) => {
    setActiveSpace(space.id);
    navigation.goBack();
  };

  const handleCreate = () => {
    createSpace({ name: newName, mode: newMode });
    setNewName('');
    navigation.goBack();
  };

  const renderItem = ({ item }: { item: Space }) => {
    const isActive = item.id === activeSpaceId;
    return (
      <TouchableOpacity
        style={[styles.row, isActive && styles.rowActive]}
        onPress={() => handleSelect(item)}
        activeOpacity={0.9}
      >
        <View style={styles.rowLeft}>
          <Text style={styles.rowEmoji}>{item.emoji}</Text>
          <View>
            <Text style={styles.rowName}>{item.name}</Text>
            <Text style={styles.rowMode}>{item.mode}</Text>
          </View>
        </View>
        {isActive ? <Text style={styles.activeBadge}>Active</Text> : null}
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={styles.flex}>
        <FlatList
          data={sortedSpaces}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListFooterComponent={
            <View style={styles.newSpaceCard}>
              <Text style={styles.sectionTitle}>New space</Text>
              <TextInput
                style={styles.input}
                value={newName}
                onChangeText={setNewName}
                placeholder="Space name"
                placeholderTextColor="#B0B0B0"
              />

              <Text style={styles.modeLabel}>Mode</Text>
              <View style={styles.modeRow}>
                {MODE_OPTIONS.map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.modeChip, newMode === mode && styles.modeChipActive]}
                    onPress={() => setNewMode(mode)}
                    activeOpacity={0.9}
                  >
                    <Text
                      style={[styles.modeChipText, newMode === mode && styles.modeChipTextActive]}
                    >
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.footerButtons}>
                <TouchableOpacity style={styles.primaryButton} onPress={handleCreate} activeOpacity={0.9}>
                  <Text style={styles.primaryButtonText}>Create</Text>
                </TouchableOpacity>
              </View>
            </View>
          }
        />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  row: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.chipBackground,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowActive: {
    borderColor: colors.accent,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowEmoji: {
    fontSize: 22,
  },
  rowName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  rowMode: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  activeBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },
  newSpaceCard: {
    marginTop: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.chipBackground,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: colors.textPrimary,
  },
  modeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 12,
    marginBottom: 8,
  },
  modeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  modeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#ECEFF4',
  },
  modeChipActive: {
    backgroundColor: colors.accent,
  },
  modeChipText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  modeChipTextActive: {
    color: '#FFF',
  },
  footerButtons: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  primaryButton: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default SpaceSwitcherScreen;
