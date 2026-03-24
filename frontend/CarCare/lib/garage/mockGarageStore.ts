/** In-memory garage when `GARAGE_API_USE_MOCK` — used by `garageApi` instead of HTTP. */
import type { GarageVehicle } from '@/types/garage';
import { DEV_MOCK_VEHICLES } from '@/lib/garage/devMockVehicles';

let store: GarageVehicle[] = [...DEV_MOCK_VEHICLES];

export function getMockGarageSnapshot(): GarageVehicle[] {
  return [...store];
}

export function mockGarageAppend(vehicle: GarageVehicle): void {
  store = [...store, vehicle];
}

export function mockGarageRemove(id: string): void {
  store = store.filter((v) => v.id !== id);
}

export function mockGarageReset(): void {
  store = [...DEV_MOCK_VEHICLES];
}
