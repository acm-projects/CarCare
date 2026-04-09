import MapView, { Marker } from 'react-native-maps';
import type { StyleProp, ViewStyle } from 'react-native';
import type { MapMechanic, MapRegion } from '@/lib/mapApi';

type Props = {
  region: MapRegion;
  mechanics: MapMechanic[];
  style?: StyleProp<ViewStyle>;
};

export function MechanicMapPreview({ region, mechanics, style }: Props) {
  return (
    <MapView
      style={style}
      region={region}
      mapType="standard"
      scrollEnabled
      zoomEnabled
      pitchEnabled={false}
    >
      {mechanics.map((m) => (
        <Marker key={m.id} coordinate={{ latitude: m.lat, longitude: m.lng }} title={m.name} />
      ))}
    </MapView>
  );
}
