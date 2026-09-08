export type ServedArea = {
  id: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  radiusKm: number;
  maxSpeed: string;
  packages: string[];
};

/**
 * Data ketersediaan jaringan fiber optik Dukodu.
 * Setiap area punya titik pusat + radius cakupan (dalam km) di sekitar
 * Jakarta Selatan (Mampang Prapatan, Tebet, Kebayoran Baru, Setiabudi).
 */
export const SERVED_AREAS: ServedArea[] = [
  {
    id: "residence",
    name: "Dukodu Residence",
    region: "Mampang Prapatan, Jakarta Selatan",
    lat: -6.2483,
    lng: 106.8256,
    radiusKm: 1.6,
    maxSpeed: "100 Mbps",
    packages: [
      "Paket Hemat 30 Mbps",
      "Paket Utama 50 Mbps",
      "Paket Premium 100 Mbps",
    ],
  },
  {
    id: "park",
    name: "Dukodu Park",
    region: "Tebet, Jakarta Selatan",
    lat: -6.2264,
    lng: 106.8522,
    radiusKm: 1.4,
    maxSpeed: "50 Mbps",
    packages: ["Paket Hemat 30 Mbps", "Paket Utama 50 Mbps"],
  },
  {
    id: "hills",
    name: "Dukodu Hills",
    region: "Kebayoran Baru, Jakarta Selatan",
    lat: -6.2396,
    lng: 106.8063,
    radiusKm: 1.7,
    maxSpeed: "100 Mbps",
    packages: [
      "Paket Hemat 30 Mbps",
      "Paket Utama 50 Mbps",
      "Paket Premium 100 Mbps",
    ],
  },
  {
    id: "kota",
    name: "Kota Dukodu",
    region: "Setiabudi / Kuningan, Jakarta Selatan",
    lat: -6.2109,
    lng: 106.8295,
    radiusKm: 2.2,
    maxSpeed: "100 Mbps",
    packages: [
      "Paket Hemat 30 Mbps",
      "Paket Utama 50 Mbps",
      "Paket Premium 100 Mbps",
    ],
  },
];

/** Kata kunci tambahan agar pencarian teks tetap cocok (Jakarta, dsb). */
export const SEARCH_ALIASES = [
  "jakarta",
  "dukodu",
  "mampang",
  "tebet",
  "setiabudi",
  "kebayoran",
  "kuningan",
  "pancoran",
  "menteng",
  "jaksel",
];

/** Cari area terlayani yang cocok dengan teks input (nama area atau alias). */
export function findAreaByText(
  input: string,
  areas: ServedArea[] = SERVED_AREAS
): ServedArea | null {
  const v = input.trim().toLowerCase();
  if (!v) return null;

  const byName = areas.find((area) => v.includes(area.name.toLowerCase()));
  if (byName) return byName;

  const matchedAlias = SEARCH_ALIASES.find((alias) => v.includes(alias));
  if (matchedAlias) return areas[0] || null;
  return null;
}

/** Jarak dua titik koordinat dalam km (rumus haversine). */
export function haversineKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

/** Cari area terlayani yang mencakup sebuah koordinat; null jika tidak ada. */
export function findAreaByCoords(
  lat: number,
  lng: number,
  areas: ServedArea[] = SERVED_AREAS
): { area: ServedArea; distanceKm: number } | null {
  let best: { area: ServedArea; distanceKm: number } | null = null;
  for (const area of areas) {
    const d = haversineKm(lat, lng, area.lat, area.lng);
    if (d <= area.radiusKm && (!best || d < best.distanceKm)) {
      best = { area, distanceKm: d };
    }
  }
  return best;
}