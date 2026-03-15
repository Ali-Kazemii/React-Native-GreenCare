export interface Plant {
  id: string;
  name: string;
  species: string;
  image: string;
  wateringFrequency: string;
  sunlight: string;
  lastWatered: string;
  healthStatus: 'healthy' | 'needs_attention' | 'critical';
  notes?: string;
}
