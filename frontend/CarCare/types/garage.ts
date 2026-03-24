/** API contracts for garage + per-vehicle services (timeline + My Garage tags). */

/** Matches service timeline accent colors (red / orange / green). */
export type ServiceSeverity = 'red' | 'orange' | 'green';

/** One row from service timeline / maintenance API for a vehicle. */
export interface VehicleServiceItem {
  id: string;
  title: string;
  severity: ServiceSeverity;
  /**
   * Short copy for garage pills (use `\n` for two lines), e.g. `oil change\nneeded`.
   * If omitted, UI may derive from `title`.
   */
  shortLabel?: string;
}

/**
 * Vehicle shown on My Garage — keyed by VIN after user adds a car from vinEnter.
 */
export interface GarageVehicle {
  id: string;
  vin: string;
  /** e.g. "My BMW 335i" */
  displayName: string;
  /** e.g. "2013 BMW 335i" */
  subtitle: string;
  /** Signed URL or CDN path from API; null until backend returns an image. */
  imageUrl: string | null;
  /**
   * Dev-only: `require()` for static PNG while `imageUrl` is null.
   * Remove when all images come from API.
   */
  imageAsset?: number;
  services: VehicleServiceItem[];
}
