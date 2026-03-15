import { Plant } from '../entities/Plant';

export interface PlantRepository {
  getMyPlants(): Promise<Plant[]>;
  getPlantById(id: string): Promise<Plant | undefined>;
  getRecommendedPlants(): Promise<Plant[]>;
}
