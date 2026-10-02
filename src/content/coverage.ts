import { site } from "@/config/site";
import { botswanaMap } from "./botswana-map";

/**
 * Reference towns for the coverage map. These are geographic reference points
 * only — Mayfair has one base (Gaborone). No branch or office is implied.
 * Coordinates: approximate town centres (public geographic data).
 */
export type Town = { name: string; lat: number; lon: number; labelSide?: "left" | "right" };

export const towns: Town[] = [
  { name: "Kasane", lat: -17.8167, lon: 25.15 },
  { name: "Maun", lat: -19.9833, lon: 23.4167, labelSide: "left" },
  { name: "Francistown", lat: -21.17, lon: 27.5078 },
  { name: "Ghanzi", lat: -21.6981, lon: 21.6458 },
  { name: "Selebi-Phikwe", lat: -21.9789, lon: 27.8481 },
  { name: "Palapye", lat: -22.55, lon: 27.1333, labelSide: "left" },
  { name: "Mahalapye", lat: -23.1, lon: 26.8333 },
  { name: "Jwaneng", lat: -24.6017, lon: 24.7281, labelSide: "left" },
  { name: "Lobatse", lat: -25.2167, lon: 25.6833 },
  { name: "Tsabong", lat: -26.05, lon: 22.45 },
];

/** Project lon/lat into the generated map's SVG coordinate space. */
export const project = (lon: number, lat: number) => {
  const { minLon, maxLat, kx, scale, pad } = botswanaMap.projection;
  return {
    x: Math.round(((lon - minLon) * kx * scale + pad) * 10) / 10,
    y: Math.round(((maxLat - lat) * scale + pad) * 10) / 10,
  };
};

/** Great-circle distance in km, rounded to the nearest 5. */
export const distanceFromBase = (lat: number, lon: number) => {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(lat - site.base.lat);
  const dLon = toRad(lon - site.base.lon);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(site.base.lat)) * Math.cos(toRad(lat)) * Math.sin(dLon / 2) ** 2;
  const km = 2 * R * Math.asin(Math.sqrt(a));
  return Math.round(km / 5) * 5;
};

export const formatCoord = (lat: number, lon: number) =>
  `${Math.abs(lat).toFixed(4)}° ${lat < 0 ? "S" : "N"}  ${Math.abs(lon).toFixed(4)}° ${lon < 0 ? "W" : "E"}`;
