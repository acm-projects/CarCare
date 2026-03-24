/**
 * Garage HTTP API — implement these routes on the server; types in `types/garage.ts`.
 * Mock mode (`GARAGE_API_USE_MOCK`) uses `mockGarageStore` instead of `apiFetch`.
 */
import { apiFetch } from '@/api';
import { GARAGE_API_USE_MOCK } from '@/lib/garage/config';
import {
  getMockGarageSnapshot,
  mockGarageAppend,
  mockGarageRemove,
} from '@/lib/garage/mockGarageStore';
import type { GarageVehicle } from '@/types/garage';

// GET /api/garage/vehicles
export async function fetchGarageVehicles(): Promise<GarageVehicle[]> {
  if (GARAGE_API_USE_MOCK) {
    return Promise.resolve(getMockGarageSnapshot());
  }
  return apiFetch('/api/garage/vehicles') as Promise<GarageVehicle[]>;
}

// POST /api/garage/vehicles — body: { vin }; response: GarageVehicle
export async function addVehicleByVin(vin: string): Promise<GarageVehicle> {
  if (GARAGE_API_USE_MOCK) {
    const normalized = vin.trim().toUpperCase();
    const created: GarageVehicle = {
      id: `mock-${Date.now()}`,
      vin: normalized,
      displayName: `My vehicle (${normalized.slice(-4)})`,
      subtitle: 'Added from VIN (mock)',
      imageUrl: null,
      imageAsset: require('../assets/images/TypeR_HondaCivic_2017.png'),
      services: [],
    };
    mockGarageAppend(created);
    return Promise.resolve(created);
  }
  return apiFetch('/api/garage/vehicles', {
    method: 'POST',
    body: JSON.stringify({ vin: vin.trim() }),
  }) as Promise<GarageVehicle>;
}

// DELETE /api/garage/vehicles/:id
export async function removeVehicle(vehicleId: string): Promise<void> {
  if (GARAGE_API_USE_MOCK) {
    mockGarageRemove(vehicleId);
    return Promise.resolve();
  }
  await apiFetch(`/api/garage/vehicles/${encodeURIComponent(vehicleId)}`, {
    method: 'DELETE',
  });
}
