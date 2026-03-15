import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { mockProducts } from '../datasources/MockProductData';

export class ProductRepositoryImpl implements ProductRepository {
  async getProducts(): Promise<Product[]> {
    return mockProducts;
  }

  async getSaleProducts(): Promise<Product[]> {
    return mockProducts.filter((p) => p.isOnSale);
  }

  async getRecommendedProducts(_plantId?: string): Promise<Product[]> {
    return mockProducts.slice(0, 4);
  }
}
