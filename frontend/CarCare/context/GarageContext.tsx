/**
 * Garage React context — shared vehicle list + mutations (`useGarage`).
 * Provider lives in `app/_layout.tsx`. Data: `GarageRepository` → `services/garageApi`.
 */
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { garageRepository } from '@/lib/garage/GarageRepository';
import type { GarageVehicle } from '@/types/garage';

export type GarageContextValue = {
  vehicles: GarageVehicle[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  addVehicleByVin: (vin: string) => Promise<GarageVehicle>;
  removeVehicleById: (vehicleId: string) => Promise<void>;
};

const GarageContext = createContext<GarageContextValue | null>(null);

// --- Provider: load list on mount; refetch after add/remove ---

export function GarageProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<GarageVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await garageRepository.list();
      setVehicles(data);
    } catch (e) {
      setError(e instanceof Error ? e : new Error(String(e)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  const addVehicleByVin = useCallback(async (vin: string) => {
    const created = await garageRepository.addByVin(vin);
    await refetch();
    return created;
  }, [refetch]);

  const removeVehicleById = useCallback(
    async (vehicleId: string) => {
      await garageRepository.remove(vehicleId);
      await refetch();
    },
    [refetch]
  );

  const value = useMemo<GarageContextValue>(
    () => ({
      vehicles,
      loading,
      error,
      refetch,
      addVehicleByVin,
      removeVehicleById,
    }),
    [vehicles, loading, error, refetch, addVehicleByVin, removeVehicleById]
  );

  return <GarageContext.Provider value={value}>{children}</GarageContext.Provider>;
}

// --- Hook: read garage state (must be inside GarageProvider) ---

export function useGarage(): GarageContextValue {
  const ctx = useContext(GarageContext);
  if (ctx == null) {
    throw new Error('useGarage must be used within <GarageProvider>');
  }
  return ctx;
}
