import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plant } from '../../domain/entities/Plant';
import { Product } from '../../domain/entities/Product';
import { PlantRepositoryImpl } from '../../data/repositories/PlantRepositoryImpl';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { GetPlantDetail } from '../../domain/usecases/GetPlantDetail';
import { GetRecommendations } from '../../domain/usecases/GetRecommendations';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

type Props = NativeStackScreenProps<any>;

const plantRepo = new PlantRepositoryImpl();
const productRepo = new ProductRepositoryImpl();
const getPlantDetail = new GetPlantDetail(plantRepo);
const getRecommendations = new GetRecommendations(productRepo);

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

export function PlantDetailScreen({ route }: Props) {
  const { plantId } = route.params as { plantId: string };
  const [plant, setPlant] = useState<Plant | undefined>();
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const { isWeb, contentMaxWidth } = useResponsive();

  useEffect(() => {
    getPlantDetail.execute(plantId).then(setPlant);
    getRecommendations.execute(plantId).then(setRecommendations);
  }, [plantId]);

  if (!plant) {
    return (
      <View style={styles.loading}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : undefined]}>
        <Image source={{ uri: plant.image }} style={styles.heroImage} />

        <View style={styles.content}>
          <Text style={styles.name}>{plant.name}</Text>
          <Text style={styles.species}>{plant.species}</Text>

          <View style={styles.statusBadge}>
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

          {plant.notes && (
            <View style={styles.notesCard}>
              <Text style={styles.notesLabel}>Notes</Text>
              <Text style={styles.notesText}>{plant.notes}</Text>
            </View>
          )}

          <View style={[styles.careGrid, isWeb && styles.careGridWeb]}>
            <View style={[styles.careItem, isWeb && styles.careItemWeb]}>
              <Text style={styles.careLabel}>Watering</Text>
              <Text style={styles.careValue}>{plant.wateringFrequency}</Text>
            </View>
            <View style={[styles.careItem, isWeb && styles.careItemWeb]}>
              <Text style={styles.careLabel}>Sunlight</Text>
              <Text style={styles.careValue}>{plant.sunlight}</Text>
            </View>
            <View style={[styles.careItem, isWeb && styles.careItemWeb]}>
              <Text style={styles.careLabel}>Last Watered</Text>
              <Text style={styles.careValue}>{plant.lastWatered || 'N/A'}</Text>
            </View>
          </View>
        </View>

        <SectionHeader title="Recommended Products" />
        {isWeb ? (
          <View style={styles.webGrid}>
            {recommendations.map((item) => (
              <View key={item.id} style={styles.webProductItem}>
                <ProductCard product={item} />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {recommendations.map((item) => (
              <View key={item.id} style={styles.productCardWrapper}>
                <ProductCard product={item} />
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  heroImage: {
    width: '100%',
    height: 280,
    backgroundColor: colors.surfaceSecondary,
  },
  content: {
    padding: spacing.md,
  },
  name: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.text,
  },
  species: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
    fontStyle: 'italic',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceSecondary,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
  },
  notesCard: {
    backgroundColor: '#FEF3C7',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#78350F',
  },
  careGrid: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },
  careGridWeb: {
    flexDirection: 'row',
  },
  careItem: {
    backgroundColor: colors.surface,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  careItemWeb: {
    flex: 1,
  },
  careLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  careValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    paddingBottom: spacing.lg,
  },
  productCardWrapper: {
    width: 170,
    marginRight: spacing.md,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  webProductItem: {
    flex: 1,
    minWidth: 200,
    maxWidth: 280,
  },
  bottomSpacer: {
    height: 40,
  },
});
