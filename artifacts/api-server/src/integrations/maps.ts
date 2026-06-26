const MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
const BASE_URL = "https://maps.googleapis.com/maps/api";

export interface LatLng { lat: number; lng: number }

export interface PlaceResult {
  placeId: string;
  name: string;
  address: string;
  location: LatLng;
}

export async function geocode(address: string): Promise<LatLng | null> {
  if (!MAPS_API_KEY) return null;
  const res = await fetch(`${BASE_URL}/geocode/json?address=${encodeURIComponent(address)}&key=${MAPS_API_KEY}`);
  const data = await res.json() as { results: { geometry: { location: LatLng } }[]; status: string };
  if (data.status !== "OK" || !data.results[0]) return null;
  return data.results[0].geometry.location;
}

export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  if (!MAPS_API_KEY) return null;
  const res = await fetch(`${BASE_URL}/geocode/json?latlng=${lat},${lng}&key=${MAPS_API_KEY}`);
  const data = await res.json() as { results: { formatted_address: string }[]; status: string };
  if (data.status !== "OK" || !data.results[0]) return null;
  return data.results[0].formatted_address;
}

export async function searchPlaces(query: string, location?: LatLng, radius = 50000): Promise<PlaceResult[]> {
  if (!MAPS_API_KEY) return [];
  const locationParam = location ? `&location=${location.lat},${location.lng}&radius=${radius}` : "";
  const res = await fetch(`${BASE_URL}/place/textsearch/json?query=${encodeURIComponent(query)}${locationParam}&key=${MAPS_API_KEY}`);
  const data = await res.json() as {
    results: { place_id: string; name: string; formatted_address: string; geometry: { location: LatLng } }[];
    status: string;
  };
  if (data.status !== "OK") return [];
  return data.results.slice(0, 5).map((r) => ({
    placeId: r.place_id,
    name: r.name,
    address: r.formatted_address,
    location: r.geometry.location,
  }));
}

export function distanceKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const sin = Math.sin;
  const cos = Math.cos;
  const h = sin(dLat / 2) ** 2 + cos((a.lat * Math.PI) / 180) * cos((b.lat * Math.PI) / 180) * sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}
