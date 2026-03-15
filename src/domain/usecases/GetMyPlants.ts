import { Plant } from '../entities/Plant';
import { PlantRepository } from '../repositories/PlantRepository';

export class GetMyPlants {
  constructor(private plantRepository: PlantRepository) {}

  async execute(): Promise<Plant[]> {
    return this.plantRepository.getMyPlants();
  }
}
