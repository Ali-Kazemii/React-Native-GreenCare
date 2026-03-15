import { Plant } from '../../domain/entities/Plant';
import { PlantRepository } from '../../domain/repositories/PlantRepository';
import { mockMyPlants, mockRecommendedPlants } from '../datasources/MockPlantData';

export class PlantRepositoryImpl implements PlantRepository {
  async getMyPlants(): Promise<Plant[]> {
    return mockMyPlants;
  }

  async getPlantById(id: string): Promise<Plant | undefined> {
    return mockMyPlants.find((p) => p.id === id);
  }

  async getRecommendedPlants(): Promise<Plant[]> {
    return mockRecommendedPlants;
  }
}
