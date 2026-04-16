import 'dotenv/config';
import cors from 'cors';
import express from 'express';

const PORT = Number(process.env.PORT) || 3333;
const GOOGLE_KEY = (process.env.GOOGLE_PLACES_API_KEY || '').trim();

/** Static fallback when no key, no coords, or Places errors — same shape as app `MapMechanic` */
const STATIC_MAP_BUNDLE = {
  region: {
    latitude: 32.93,
    longitude: -96.8,
    latitudeDelta: 0.12,
    longitudeDelta: 0.12,
  },
  mechanics: [
    {
      id: '1',
      name: "Baker's Spring Valley Automotive",
      address: '7821 Spring Valley Rd, Dallas, TX 75254',
      distance: '3.4 mi',
      rating: 4.9,
      reviewCount: 579,
      hours: 'Open • Closes 6 PM',
      services: ['Oil Change', 'Brakes', 'Diagnostics'],
      review:
        "They are always kind and honest and get the job done well! I won't go anywhere else for my cars. - Haley Thomas",
      phone: 'tel:+12145551234',
      lat: 32.9196,
      lng: -96.858,
    },
    {
      id: '2',
      name: 'Precision Auto Care',
      address: '591 W Campbell Rd, Richardson, TX 75080',
      distance: '1.7 mi',
      rating: 4.7,
      reviewCount: 42,
      hours: 'Open • Closes 6 PM',
      services: ['Oil Change', 'Brakes', 'Diagnostics'],
      review:
        'I had the best experience with Jim! Had an easy fix on my brake right sensor and he ordered the part that day.',
      phone: 'tel:+12145555678',
      lat: 32.9806,
      lng: -96.7502,
    },
    {
      id: '3',
      name: 'Tidwell Auto Service',
      address: '3283 Independence Pkwy, Plano, TX 75075',
      distance: '4.1 mi',
      rating: 4.6,
      reviewCount: 128,
      hours: 'Open • Closes 7 PM',
      services: ['Oil Change', 'Brakes', 'Diagnostics'],
      review: 'Fast and professional. Will definitely come back for my next service.',
      phone: 'tel:+12145559999',
      lat: 33.045,
      lng: -96.698,
    },
  ],
};

function haversineMiles(lat1, lon1, lat2, lon2) {
  const R = 3958.8;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function formatDistanceMiles(mi) {
  if (mi < 0.1) return `${Math.round(mi * 5280)} ft`;
  if (mi < 10) return `${mi.toFixed(1)} mi`;
  return `${Math.round(mi)} mi`;
}

function hoursLabel(openingHours) {
  if (!openingHours) return 'Hours unknown';
  if (openingHours.open_now === true) return 'Open now';
  if (openingHours.open_now === false) return 'Closed now';
  return 'Hours unknown';
}

function placeToMechanic(p, userLat, userLng) {
  const lat = p.geometry?.location?.lat;
  const lng = p.geometry?.location?.lng;
  if (typeof lat !== 'number' || typeof lng !== 'number') return null;
  const mi = haversineMiles(userLat, userLng, lat, lng);
  return {
    id: p.place_id,
    placeId: p.place_id,
    name: p.name || 'Repair shop',
    address: p.vicinity || p.formatted_address || '',
    distance: formatDistanceMiles(mi),
    rating: typeof p.rating === 'number' ? p.rating : 0,
    reviewCount: typeof p.user_ratings_total === 'number' ? p.user_ratings_total : 0,
    hours: hoursLabel(p.opening_hours),
    services: ['Auto repair'],
    review: '',
    phone: '',
    lat,
    lng,
  };
}

function regionForMechanics(mechanics, userLat, userLng) {
  if (!mechanics.length) {
    return {
      latitude: userLat,
      longitude: userLng,
      latitudeDelta: 0.08,
      longitudeDelta: 0.08,
    };
  }
  let minLat = userLat;
  let maxLat = userLat;
  let minLng = userLng;
  let maxLng = userLng;
  for (const m of mechanics) {
    minLat = Math.min(minLat, m.lat);
    maxLat = Math.max(maxLat, m.lat);
    minLng = Math.min(minLng, m.lng);
    maxLng = Math.max(maxLng, m.lng);
  }
  const latD = Math.max((maxLat - minLat) * 1.35, 0.025);
  const lngD = Math.max((maxLng - minLng) * 1.35, 0.025);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: latD,
    longitudeDelta: lngD,
  };
}

async function fetchNearbyCarRepair(userLat, userLng, radiusMeters) {
  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${userLat},${userLng}`);
  url.searchParams.set('radius', String(radiusMeters));
  url.searchParams.set('type', 'car_repair');
  url.searchParams.set('key', GOOGLE_KEY);

  const res = await fetch(url.toString());
  const data = await res.json();

  if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
    const msg = data.error_message || data.status || 'Unknown Places error';
    throw new Error(msg);
  }

  const raw = data.results || [];
  const mechanics = [];
  for (const p of raw) {
    const m = placeToMechanic(p, userLat, userLng);
    if (m) mechanics.push(m);
  }
  mechanics.sort((a, b) => haversineMiles(userLat, userLng, a.lat, a.lng) - haversineMiles(userLat, userLng, b.lat, b.lng));
  return mechanics;
}

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

/**
 * `GET /api/map` — static demo bundle.
 * `GET /api/map?lat=..&lng=..` — Google Places nearby `car_repair` when GOOGLE_PLACES_API_KEY is set; else static.
 * Optional: `radius` in meters (default 15000).
 */
app.get('/api/map', async (req, res) => {
  const lat = req.query.lat != null ? Number(req.query.lat) : NaN;
  const lng = req.query.lng != null ? Number(req.query.lng) : NaN;
  const radius = req.query.radius != null ? Number(req.query.radius) : 15000;

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return res.json(STATIC_MAP_BUNDLE);
  }

  if (!GOOGLE_KEY) {
    console.warn('GOOGLE_PLACES_API_KEY not set — returning static map bundle (set key in map-api/.env)');
    return res.json(STATIC_MAP_BUNDLE);
  }

  try {
    const mechanics = await fetchNearbyCarRepair(lat, lng, Number.isFinite(radius) ? radius : 15000);
    const region = regionForMechanics(mechanics, lat, lng);
    return res.json({ region, mechanics });
  } catch (e) {
    console.error('Places nearby failed:', e.message || e);
    return res.json(STATIC_MAP_BUNDLE);
  }
});

app.listen(PORT, () => {
  console.log(`CarCare map API listening on http://localhost:${PORT}`);
  console.log('GET /api/map — optional ?lat=&lng=&radius= for Google Places (car_repair)');
  console.log(GOOGLE_KEY ? 'Google Places: key loaded' : 'Google Places: no key (static data only)');
});
