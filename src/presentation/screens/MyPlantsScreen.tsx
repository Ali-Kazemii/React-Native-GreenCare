import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plant } from '../../domain/entities/Plant';
import { PlantRepositoryImpl } from '../../data/repositories/PlantRepositoryImpl';
import { GetMyPlants } from '../../domain/usecases/GetMyPlants';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

type Props = NativeStackScreenProps<any>;

const plantRepo = new PlantRepositoryImpl();
const getMyPlants = new GetMyPlants(plantRepo);

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

export function MyPlantsScreen({ navigation }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const { contentMaxWidth } = useResponsive();

  useEffect(() => {
    getMyPlants.execute().then(setPlants);
  }, []);

  const renderPlant = ({ item }: { item: Plant }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('PlantDetail', { plantId: item.id })}
      activeOpacity={0.7}
    >
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.cardContent}>
        <Text style={styles.plantName}>{item.name}</Text>
        <Text style={styles.species}>{item.species}</Text>
        <View style={styles.detailsRow}>
          <Text style={styles.detail}>Water: {item.wateringFrequency}</Text>
        </View>
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: statusColors[item.healthStatus] },
            ]}
          />
          <Text style={styles.statusText}>
            {statusLabels[item.healthStatus]}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, contentMaxWidth ? { alignItems: 'center' } : undefined]}>
      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={renderPlant}
        contentContainerStyle={[styles.list, contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%', alignSelf: 'center' } : undefined]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.md,
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  image: {
    width: 100,
    alignSelf: 'stretch',
    backgroundColor: colors.surfaceSecondary,
  },
  cardContent: {
    flex: 1,
    padding: spacing.md,
    justifyContent: 'center',
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  species: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  detailsRow: {
    marginTop: spacing.sm,
  },
  detail: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.sm,
    gap: 6,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});
