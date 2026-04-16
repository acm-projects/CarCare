import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import type { MapMechanic, MapRegion } from '@/lib/mapApi';

type Props = {
  region: MapRegion;
  mechanics: MapMechanic[];
  style?: StyleProp<ViewStyle>;
};

/** `react-native-maps` is native-only; web shows a static placeholder so Metro can bundle. */
export function MechanicMapPreview({ region, mechanics, style }: Props) {
  return (
    <View style={[styles.placeholder, style]}>
      <Text style={styles.title}>Map preview</Text>
      <Text style={styles.sub}>
        Interactive maps run in the Expo Go app (iOS/Android). Use “View larger map” below to open
        in your browser.
      </Text>
      <Text style={styles.meta} numberOfLines={1}>
        {mechanics.length} nearby · {region.latitude.toFixed(2)}, {region.longitude.toFixed(2)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: '#D0E8F4',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#386FA4',
  },
  sub: {
    fontSize: 12,
    color: '#5A5A5A',
    textAlign: 'center',
    lineHeight: 18,
  },
  meta: {
    fontSize: 11,
    color: '#8D8D8D',
    marginTop: 4,
  },
});
