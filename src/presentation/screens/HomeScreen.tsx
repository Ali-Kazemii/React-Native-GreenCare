import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Plant } from '../../domain/entities/Plant';
import { Product } from '../../domain/entities/Product';
import { PlantRepositoryImpl } from '../../data/repositories/PlantRepositoryImpl';
import { ProductRepositoryImpl } from '../../data/repositories/ProductRepositoryImpl';
import { GetMyPlants } from '../../domain/usecases/GetMyPlants';
import { GetSaleProducts } from '../../domain/usecases/GetSaleProducts';
import { PlantCard } from '../components/PlantCard';
import { ProductCard } from '../components/ProductCard';
import { SectionHeader } from '../components/SectionHeader';
import { useResponsive } from '../hooks/useResponsive';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

type Props = NativeStackScreenProps<any>;

const plantRepo = new PlantRepositoryImpl();
const productRepo = new ProductRepositoryImpl();
const getMyPlants = new GetMyPlants(plantRepo);
const getSaleProducts = new GetSaleProducts(productRepo);

export function HomeScreen({ navigation }: Props) {
  const [plants, setPlants] = useState<Plant[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const { isWeb, contentMaxWidth } = useResponsive();

  useEffect(() => {
    getMyPlants.execute().then(setPlants);
    getSaleProducts.execute().then(setSaleProducts);
  }, []);

  const needsAttention = plants.filter(
    (p) => p.healthStatus !== 'healthy'
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.inner, contentMaxWidth ? { maxWidth: contentMaxWidth, alignSelf: 'center', width: '100%' } : undefined]}>
        <View style={styles.header}>
          <Text style={styles.title}>GreenCare</Text>
        </View>

        {needsAttention.length > 0 && (
          <View style={styles.alertBanner}>
            <Text style={styles.alertText}>
              {needsAttention.length} plant{needsAttention.length > 1 ? 's' : ''} need
              your attention
            </Text>
          </View>
        )}

        <SectionHeader
          title="My Plants"
          onSeeAll={() => navigation.navigate('MyPlants')}
        />
        {isWeb ? (
          <View style={styles.webGrid}>
            {plants.slice(0, 4).map((item) => (
              <View key={item.id} style={styles.webPlantItem}>
                <PlantCard
                  plant={item}
                  onPress={() =>
                    navigation.navigate('PlantDetail', { plantId: item.id })
                  }
                />
              </View>
            ))}
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {plants.slice(0, 4).map((item) => (
              <PlantCard
                key={item.id}
                plant={item}
                onPress={() =>
                  navigation.navigate('PlantDetail', { plantId: item.id })
                }
              />
            ))}
          </ScrollView>
        )}

        <SectionHeader
          title="Sale"
          onSeeAll={() => navigation.navigate('SaleTab')}
        />
        {isWeb ? (
          <View style={styles.webGrid}>
            {saleProducts.map((item) => (
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
            {saleProducts.map((item) => (
              <View key={item.id} style={styles.productCardWrapper}>
                <ProductCard product={item} />
              </View>
            ))}
          </ScrollView>
        )}

        <View style={styles.bottomSpacer} />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  inner: {},
  header: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  alertBanner: {
    backgroundColor: '#FEF3C7',
    marginHorizontal: spacing.md,
    padding: spacing.sm,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  alertText: {
    color: '#92400E',
    fontSize: 13,
    fontWeight: '500',
  },
  horizontalList: {
    paddingHorizontal: spacing.md,
    paddingTop: 4,
    paddingBottom: spacing.sm,
  },
  productCardWrapper: {
    width: 180,
    marginRight: spacing.md,
  },
  webGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  webPlantItem: {
    width: 180,
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
