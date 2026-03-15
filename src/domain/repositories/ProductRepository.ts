import { Product } from '../entities/Product';

export interface ProductRepository {
  getProducts(): Promise<Product[]>;
  getSaleProducts(): Promise<Product[]>;
  getRecommendedProducts(plantId?: string): Promise<Product[]>;
}
