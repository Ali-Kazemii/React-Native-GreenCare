import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Product } from '../../domain/entities/Product';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { GetSaleProducts } from '../../domain/usecases/GetSaleProducts';
import { ProductCard } from '../components/ProductCard';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme/colors';
import { spacing, borderRadius } from '../theme/spacing';

const productRepo = new ProductRepositoryImpl();
const getSaleProducts = new GetSaleProducts(productRepo);

export function SaleScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const { numColumns, contentMaxWidth } = useResponsive();

  useEffect(() => {
    getSaleProducts.execute().then(setProducts);
  }, []);

  return (
    <View style={[styles.container, contentMaxWidth ? { alignItems: 'center' } : undefined]}>
      <View style={contentMaxWidth ? { maxWidth: contentMaxWidth, width: '100%' } : { flex: 1 }}>
        <View style={styles.banner}>
          <Text style={styles.bannerTitle}>Spring Sale</Text>
          <Text style={styles.bannerSubtitle}>
            Up to 35% off on selected items
          </Text>
        </View>
        <FlatList
          key={`sale-${numColumns}`}
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
  banner: {
    backgroundColor: colors.primaryDark,
    marginHorizontal: spacing.md,
    marginTop: 0,
    marginBottom: spacing.sm,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: colors.primaryLight,
    marginTop: 4,
  },
  grid: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.md,
  },
  row: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  gridItem: {
    flex: 1,
  },
});
