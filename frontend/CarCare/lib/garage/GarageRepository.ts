/** Wraps `garageApi` so UI imports one module; swap implementation here if needed. */
import type { GarageVehicle } from '@/types/garage';
import {
  fetchGarageVehicles,
  addVehicleByVin as addVehicleByVinApi,
  removeVehicle as removeVehicleApi,
} from '@/services/garageApi';

export class GarageRepository {
  list(): Promise<GarageVehicle[]> {
    return fetchGarageVehicles();
  }

  addByVin(vin: string): Promise<GarageVehicle> {
    return addVehicleByVinApi(vin);
  }

  remove(vehicleId: string): Promise<void> {
    return removeVehicleApi(vehicleId);
  }
}

export const garageRepository = new GarageRepository();
