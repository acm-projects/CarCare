/** `Image` source: `imageUrl` → `imageAsset` → placeholder. */
import type { ImageSourcePropType } from 'react-native';
import type { GarageVehicle } from '@/types/garage';

const PLACEHOLDER = require('../../assets/images/TypeR_HondaCivic_2017.png');

export function resolveVehicleImageSource(vehicle: GarageVehicle): ImageSourcePropType {
  if (vehicle.imageUrl) {
    return { uri: vehicle.imageUrl };
  }
  if (vehicle.imageAsset != null) {
    return vehicle.imageAsset;
  }
  return PLACEHOLDER;
}
