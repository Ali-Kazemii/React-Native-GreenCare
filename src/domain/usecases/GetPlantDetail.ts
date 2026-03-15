import { Plant } from '../entities/Plant';
import { PlantRepository } from '../repositories/PlantRepository';

export class GetPlantDetail {
  constructor(private plantRepository: PlantRepository) {}

  async execute(plantId: string): Promise<Plant | undefined> {
    return this.plantRepository.getPlantById(plantId);
  }
}
