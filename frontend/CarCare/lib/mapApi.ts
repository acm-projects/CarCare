import { Platform } from 'react-native';

export type MapMechanic = {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  reviewCount: number;
  hours: string;
  services: string[];
  review: string;
  /** `tel:+1...` when known; empty for Google Places–only rows */
  phone: string;
  /** Google Place ID — open in Maps when phone is missing */
  placeId?: string;
  lat: number;
  lng: number;
};

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type MapBundle = {
  region: MapRegion;
  mechanics: MapMechanic[];
};

const DEV_MAP_BASE =
  Platform.OS === 'android' ? 'http://10.0.2.2:3333' : 'http://localhost:3333';

function baseUrl(): string {
  const fromEnv = process.env.EXPO_PUBLIC_MAP_API_URL;
  if (fromEnv && fromEnv.length > 0) {
    return fromEnv.replace(/\/$/, '');
  }
  return DEV_MAP_BASE;
}

export type FetchMapOptions = {
  lat?: number;
  lng?: number;
  /** Search radius in meters (server default 15000) */
  radiusMeters?: number;
};

export async function fetchMapBundle(opts?: FetchMapOptions): Promise<MapBundle> {
  const params = new URLSearchParams();
  if (opts?.lat != null && opts?.lng != null && Number.isFinite(opts.lat) && Number.isFinite(opts.lng)) {
    params.set('lat', String(opts.lat));
    params.set('lng', String(opts.lng));
    if (opts.radiusMeters != null && Number.isFinite(opts.radiusMeters)) {
      params.set('radius', String(opts.radiusMeters));
    }
  }
  const q = params.toString();
  const res = await fetch(`${baseUrl()}/api/map${q ? `?${q}` : ''}`);
  if (!res.ok) {
    throw new Error(`Map API ${res.status}`);
  }
  return res.json() as Promise<MapBundle>;
}
