import React, { useMemo, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GradientText } from '@/styles/global';
import { fetchMapBundle, type MapMechanic } from '@/lib/mapApi';

type Message = {
  id: string;
  sender: 'assistant' | 'user';
  text: string;
};

type Row =
  | { id: string; kind: 'message'; payload: Message }
  | { id: string; kind: 'mechanic'; payload: MapMechanic };

export default function MapBotScreen() {
  const [lat, setLat] = useState('32.93');
  const [lng, setLng] = useState('-96.8');
  const [radius, setRadius] = useState('15000');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm1',
      sender: 'assistant',
      text: 'Map API assistant ready. Enter lat/lng and I will fetch nearby mechanics.',
    },
  ]);
  const [mechanics, setMechanics] = useState<MapMechanic[]>([]);

  const rows = useMemo<Row[]>(
    () => [
      ...messages.map((m) => ({ id: `msg-${m.id}`, kind: 'message' as const, payload: m })),
      ...mechanics.map((m) => ({ id: `shop-${m.id}`, kind: 'mechanic' as const, payload: m })),
    ],
    [messages, mechanics]
  );

  async function runLookup() {
    if (loading) return;
    const latNum = Number(lat);
    const lngNum = Number(lng);
    const radiusNum = Number(radius || '15000');

    if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          sender: 'assistant',
          text: 'Latitude/longitude are invalid. Example: 32.93 and -96.8',
        },
      ]);
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        sender: 'user',
        text: `Find mechanics near ${latNum}, ${lngNum} (${radiusNum}m)`,
      },
    ]);

    setLoading(true);
    try {
      const bundle = await fetchMapBundle({ lat: latNum, lng: lngNum, radiusMeters: radiusNum });
      setMechanics(bundle.mechanics);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text:
            bundle.mechanics.length > 0
              ? `Found ${bundle.mechanics.length} mechanics. Region center: ${bundle.region.latitude.toFixed(4)}, ${bundle.region.longitude.toFixed(4)}`
              : 'No mechanics returned for this location/radius.',
        },
      ]);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'assistant',
          text: `Map API request failed: ${msg}`,
        },
      ]);
      setMechanics([]);
    } finally {
      setLoading(false);
    }
  }

  function renderRow({ item }: { item: Row }) {
    if (item.kind === 'message') {
      const isUser = item.payload.sender === 'user';
      return (
        <View style={[styles.messageRow, isUser ? styles.userRow : styles.assistantRow]}>
          {isUser ? (
            <LinearGradient
              colors={['#84D2F6', '#386FA4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.bubble, styles.userBubble]}
            >
              <Text style={styles.userText}>{item.payload.text}</Text>
            </LinearGradient>
          ) : (
            <View style={[styles.bubble, styles.assistantBubble]}>
              <Text style={styles.assistantText}>{item.payload.text}</Text>
            </View>
          )}
        </View>
      );
    }

    const m = item.payload;
    return (
      <View style={styles.shopCard}>
        <View style={styles.shopHeader}>
          <Text style={styles.shopName} numberOfLines={2}>
            {m.name}
          </Text>
          <Text style={styles.distance}>{m.distance}</Text>
        </View>
        <Text style={styles.shopMeta}>{m.address}</Text>
        <Text style={styles.shopMeta}>
          {m.rating > 0 ? `${m.rating} (${m.reviewCount})` : 'No rating'} · {m.hours}
        </Text>
        <Text style={styles.shopMeta}>
          {m.lat.toFixed(4)}, {m.lng.toFixed(4)}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.header}>
          <View style={styles.iconBadge}>
            <Ionicons name="map-outline" size={22} color="#84D2F6" />
          </View>
          <GradientText style={styles.headerTitle}>Map API Assistant</GradientText>
        </View>

        <View style={styles.controls}>
          <TextInput
            style={styles.field}
            value={lat}
            onChangeText={setLat}
            placeholder="Latitude"
            placeholderTextColor="#8D8D8D"
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            style={styles.field}
            value={lng}
            onChangeText={setLng}
            placeholder="Longitude"
            placeholderTextColor="#8D8D8D"
            keyboardType="numbers-and-punctuation"
          />
          <TextInput
            style={styles.field}
            value={radius}
            onChangeText={setRadius}
            placeholder="Radius (meters)"
            placeholderTextColor="#8D8D8D"
            keyboardType="number-pad"
          />
          <TouchableOpacity style={styles.fetchBtn} onPress={runLookup} disabled={loading}>
            <Ionicons
              name={loading ? 'hourglass-outline' : 'search-outline'}
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.fetchText}>{loading ? 'Loading...' : 'Fetch'}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={rows}
          keyExtractor={(item) => item.id}
          renderItem={renderRow}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F4F4F4' },
  container: { flex: 1, backgroundColor: '#F4F4F4', paddingTop: 10, paddingHorizontal: 16 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  iconBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: '#84D2F6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    marginRight: 12,
  },
  headerTitle: { fontSize: 26, fontWeight: '400' },
  controls: { marginBottom: 8, gap: 8 },
  field: {
    minHeight: 48,
    borderWidth: 2,
    borderColor: '#84D2F6',
    borderRadius: 16,
    paddingHorizontal: 12,
    backgroundColor: '#F8F8F8',
    color: '#444444',
    fontSize: 16,
  },
  fetchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: '#386FA4',
    borderRadius: 16,
    minHeight: 46,
  },
  fetchText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  listContent: { paddingBottom: 20 },
  messageRow: { width: '100%', marginTop: 8 },
  assistantRow: { alignItems: 'flex-start' },
  userRow: { alignItems: 'flex-end' },
  bubble: {
    maxWidth: '85%',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  assistantBubble: { backgroundColor: '#DADADA' },
  userBubble: { backgroundColor: 'transparent' },
  assistantText: { color: '#555', fontSize: 15, lineHeight: 20 },
  userText: { color: '#FFF', fontSize: 15, lineHeight: 20 },
  shopCard: {
    marginTop: 10,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCEFFF',
  },
  shopHeader: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  shopName: { flex: 1, fontSize: 15, fontWeight: '700', color: '#386FA4' },
  distance: { fontSize: 12, fontWeight: '700', color: '#5FA8D3' },
  shopMeta: { marginTop: 4, fontSize: 12, color: '#6D6D6D' },
});
