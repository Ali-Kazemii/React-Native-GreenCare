import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Product } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { GetRecommendations } from '../../domain/usecases/GetRecommendations';
import { ProductCard } from '../components/ProductCard';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

const productRepo = new ProductRepositoryImpl();
const getRecommendations = new GetRecommendations(productRepo);

export function RecommendationsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { numColumns, contentMaxWidth } = useResponsive();

  useEffect(() => {
    getRecommendations.execute().then(setProducts);
  }, []);

  return (
    <View style={[styles.container, contentMaxWidth ? { alignItems: 'center' } : undefined]}>
      <View style={contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%' } : { flex: 1 }}>
        <Text style={styles.subtitle}>
          Products selected for your plants
        </Text>
        <FlatList
          key={`recs-${numColumns}`}
          data={products}
          numColumns={numColumns}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.grid}
          columnWrapperStyle={styles.row}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={[styles.gridItem, { maxWidth: `${Math.floor(100 / numColumns) - 2}%` }]}>
              <ProductCard product={item} />
            </View>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
    paddingBottom: spacing.xs,
  },
  grid: {
    padding: spacing.md,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
});
