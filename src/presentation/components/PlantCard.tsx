import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Plant } from '../../domain/entities/Plant';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

interface Props {
  plant: Plant;
  onPress: () => void;
  compact?: boolean;
}

const statusColors = {
  healthy: colors.success,
  needs_attention: colors.warning,
  critical: colors.error,
};

const statusLabels = {
  healthy: 'Healthy',
  needs_attention: 'Needs attention',
  critical: 'Critical',
};

export function PlantCard({ plant, onPress, compact }: Props) {
  return (
    <TouchableOpacity
      style={[styles.card, compact && styles.cardCompact]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: plant.image }}
        style={[styles.image, compact && styles.imageCompact]}
      />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {plant.name}
        </Text>
        <Text style={styles.species} numberOfLines={1}>
          {plant.species}
        </Text>
        {!compact && (
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: statusColors[plant.healthStatus] },
              ]}
            />
            <Text style={styles.statusText}>
              {statusLabels[plant.healthStatus]}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    overflow: 'hidden',
    width: 160,
    marginRight: spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    width: 140,
  },
  image: {
    width: '100%',
    height: 130,
    backgroundColor: colors.surfaceSecondary,
  },
  imageCompact: {
    height: 100,
  },
  info: {
    padding: spacing.sm,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  species: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
});
