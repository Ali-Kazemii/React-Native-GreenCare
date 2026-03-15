export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'soil' | 'fertilizer' | 'tools' | 'pots' | 'seeds' | 'accessories';
  isOnSale: boolean;
  rating: number;
}
