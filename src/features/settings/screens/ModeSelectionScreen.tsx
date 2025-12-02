import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../../navigation/types';
import { AppMode, useSettings } from '../context/SettingsContext';
import colors from '../../../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'ModeSelection'>;

const ModeSelectionScreen: React.FC<Props> = ({ navigation }) => {
  const { mode, setMode } = useSettings();

  const handleSelect = async (selectedMode: AppMode) => {
    await setMode(selectedMode);
    navigation.reset({
      index: 0,
      routes: [{ name: 'NotesHome' }],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Fridge Notes</Text>
      <Text style={styles.subtitle}>Choose how you’ll use the app</Text>

      <View style={styles.cardsContainer}>
        <ModeCard
          title="Couple mode"
          description="Little notes between two hearts, just for you and your partner."
          active={mode === 'couple'}
          onPress={() => handleSelect('couple')}
        />

        <ModeCard
          title="Roommates & family"
          description="Shared notes for flatmates, friends or family members."
          active={mode === 'roommates'}
          onPress={() => handleSelect('roommates')}
        />
      </View>

      <Text style={styles.footerNote}>
        You can change this later from the settings. (για αργότερα 😊)
      </Text>
    </View>
  );
};

interface ModeCardProps {
  title: string;
  description: string;
  active: boolean;
  onPress: () => void;
}

const ModeCard: React.FC<ModeCardProps> = ({ title, description, active, onPress }) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      style={[
        styles.modeCard,
        active && {
          borderColor: colors.accent,
          borderWidth: 2,
        },
      ]}
    >
      <Text style={styles.modeTitle}>{title}</Text>
      <Text style={styles.modeDescription}>{description}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
    paddingTop: 72,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    marginTop: 6,
    fontSize: 15,
    color: colors.textSecondary,
  },
  cardsContainer: {
    marginTop: 32,
    gap: 16,
  },
  modeCard: {
    borderRadius: 24,
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 18,
    shadowColor: colors.cardShadow,
    shadowOpacity: 1,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
  modeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  modeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  footerNote: {
    marginTop: 32,
    fontSize: 13,
    color: colors.textSecondary,
  },
});

export default ModeSelectionScreen;
