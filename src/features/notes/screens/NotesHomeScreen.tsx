// src/features/notes/screens/NotesHomeScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { useNotes } from '../context/NotesContext';
import { Note, NoteSender } from '../types';
import StickyNoteCard from '../components/StickyNoteCard';
import colors from '../../../theme/colors';
import { useSpaces } from '../../spaces/context/SpacesContext';

type Props = NativeStackScreenProps<RootStackParamList, 'NotesHome'>;

type Filter = 'all' | 'you' | 'them';

const NotesHomeScreen: React.FC<Props> = ({ navigation }) => {
  const { notes } = useNotes();
  const { activeSpace } = useSpaces();

  const [filter, setFilter] = useState<Filter>('all');

  const filteredNotes = useMemo(() => {
    if (filter === 'all') return notes;

    const sender: NoteSender = filter === 'you' ? 'you' : 'them';
    return notes.filter((n) => n.sender === sender);
  }, [notes, filter]);

  const handlePressNote = (note: Note) => {
    navigation.navigate('NoteDetails', { noteId: note.id, startInEditMode: false });
  };

  const handleCreatePress = () => {
    navigation.navigate('CreateNote');
  };

  const handleSpacePress = () => {
    navigation.navigate('SpaceSwitcher');
  };

  const renderItem = ({ item }: { item: Note }) => (
    <View style={styles.noteColumnItem}>
      <StickyNoteCard note={item} onPress={() => handlePressNote(item)} />
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyStateContainer}>
      <Text style={styles.emptyTitle}>No notes yet</Text>
      <Text style={styles.emptySubtitle}>Tap the + button to leave a sweet note.</Text>
    </View>
  );

  const spaceLabel = activeSpace
    ? `${activeSpace.emoji} ${activeSpace.name}`
    : 'Select a space';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Fridge Notes</Text>
            <Text style={styles.subtitle}>Little notes for every fridge space.</Text>
          </View>

          <TouchableOpacity style={styles.spaceChip} onPress={handleSpacePress} activeOpacity={0.9}>
            <Text style={styles.spaceChipText}>{spaceLabel}</Text>
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          <FilterChip
            label="All"
            active={filter === 'all'}
            onPress={() => setFilter('all')}
          />
          <FilterChip
            label="From you"
            active={filter === 'you'}
            onPress={() => setFilter('you')}
          />
          <FilterChip
            label="From them"
            active={filter === 'them'}
            onPress={() => setFilter('them')}
          />
        </View>

        {/* Notes grid */}
        <View style={styles.listWrapper}>
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            numColumns={2}
            renderItem={renderItem}
            columnWrapperStyle={styles.columnWrapper}
            contentContainerStyle={
              filteredNotes.length === 0 ? styles.emptyListContent : styles.listContent
            }
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        </View>

        {/* Floating + button */}
        <TouchableOpacity style={styles.fab} onPress={handleCreatePress} activeOpacity={0.9}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

type FilterChipProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

const FilterChip: React.FC<FilterChipProps> = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    style={[
      styles.filterChip,
      active && {
        backgroundColor: colors.chipActiveBackground,
      },
    ]}
  >
    <Text
      style={[
        styles.filterChipText,
        active && {
          color: colors.chipActiveText,
          fontWeight: '600',
        },
      ]}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  header: {
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textSecondary,
  },
  spaceChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.chipBackground,
  },
  spaceChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  filterRow: {
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 8,
    gap: 8,
  },
  filterChip: {
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: colors.chipBackground,
  },
  filterChipText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listWrapper: {
    flex: 1,
    marginTop: 8,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  listContent: {
    paddingBottom: 100,
  },
  emptyListContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 100,
  },
  noteColumnItem: {
    flex: 1,
    marginRight: 8,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    marginTop: -2,
  },
});

export default NotesHomeScreen;
