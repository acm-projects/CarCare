/** Seed vehicles for mock garage (`mockGarageStore`). */
import type { GarageVehicle } from '@/types/garage';

export const DEV_MOCK_VEHICLES: GarageVehicle[] = [
  {
    id: '1',
    vin: '19XFC2F59GE000001',
    displayName: 'My Honda Civic',
    subtitle: '2017 Honda Civic',
    imageUrl: null,
    imageAsset: require('../../assets/images/TypeR_HondaCivic_2017.png'),
    services: [],
  },
  {
    id: '2',
    vin: 'WBA3B5C50FD123456',
    displayName: 'My BMW 335i',
    subtitle: '2013 BMW 335i',
    imageUrl: null,
    imageAsset: require('../../assets/images/335i_BMW.png'),
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
