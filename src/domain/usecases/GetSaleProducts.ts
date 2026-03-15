import { Product } from '../entities/Product';
import { ProductRepository } from '../repositories/ProductRepository';

export class GetSaleProducts {
  constructor(private productRepository: ProductRepository) {}

  async execute(): Promise<Product[]> {
    return this.productRepository.getSaleProducts();
  }
}
