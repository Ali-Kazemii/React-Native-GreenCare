import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetRecommendations {
  constructor(private productRepository: ProductRepository) {}

  async execute(plantId?: string): Promise<Product[]> {
    return this.productRepository.getRecommendedProducts(plantId);
  }
}
