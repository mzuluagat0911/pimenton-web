export type Region = "LATAM" | "Europa" | "Norteamérica";

export interface Location {
  id: string;
  country: string;
  restaurants: number;
  region: Region;
  // Position as a percentage of the world map container, anchored at the
  // pin's center. Calibrated against /assets/map/worldmap.svg (viewBox
  // 1010x666). Approximate — easy to nudge per country if a pin lands off.
  x: number;
  y: number;
}

export const locations: Location[] = [
  { id: "usa", country: "Estados Unidos", restaurants: 6, region: "Norteamérica", x: 24, y: 38 },
  { id: "mexico", country: "México", restaurants: 11, region: "LATAM", x: 21, y: 47 },
  { id: "colombia", country: "Colombia", restaurants: 6, region: "LATAM", x: 30, y: 55 },
  { id: "peru", country: "Perú", restaurants: 8, region: "LATAM", x: 30, y: 64 },
  { id: "chile", country: "Chile", restaurants: 7, region: "LATAM", x: 31, y: 76 },
  { id: "argentina", country: "Argentina", restaurants: 7, region: "LATAM", x: 33, y: 78 },
  { id: "uruguay", country: "Uruguay", restaurants: 1, region: "LATAM", x: 35.5, y: 75 },
  { id: "espana", country: "España", restaurants: 21, region: "Europa", x: 48, y: 37 },
];
