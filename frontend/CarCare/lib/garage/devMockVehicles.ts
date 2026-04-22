/** Seed vehicles for mock garage (`mockGarageStore`). */
import type { GarageVehicle } from '@/types/garage';

export const DEV_MOCK_VEHICLES: GarageVehicle[] = [
  {
    id: '1',
    vin: '5YFBURHE8EP064592',
    displayName: 'My Rolla',
    subtitle: '2014 Toyota Corolla',
    imageUrl: null,
    imageAsset: require('../../assets/images/toyotaCorolla.webp'),
    services: [],
  },
  {
    id: '2',
    vin: 'WBA3B5C50FD123456',
    displayName: 'My Bibic',
    subtitle: '2017 Honda Civic',
    imageUrl: null,
    imageAsset: require('../../assets/images/TypeR_HondaCivic_2017.png'),
    services: [
      {
        id: 'svc-1',
        title: 'Service',
        severity: 'red',
        shortLabel: 'service\nneeded',
      },
    ],
  },
];
