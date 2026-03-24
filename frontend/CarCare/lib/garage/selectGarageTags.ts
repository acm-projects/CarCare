/** Picks up to `maxTags` service pills for My Garage — worst severity first (red → orange → green). */
import type { ServiceSeverity, VehicleServiceItem } from '@/types/garage';

const SEVERITY_ORDER: ServiceSeverity[] = ['red', 'orange', 'green'];

export function selectGarageTags(
  services: VehicleServiceItem[],
  maxTags = 2
): VehicleServiceItem[] {
  for (const severity of SEVERITY_ORDER) {
    const bucket = services.filter((s) => s.severity === severity);
    if (bucket.length > 0) {
      return bucket.slice(0, maxTags);
    }
  }
  return [];
}
