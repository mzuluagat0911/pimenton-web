export type Region = "LATAM" | "Europa" | "Norteamérica";

export interface Location {
  id: string;
  country: string;
  restaurants: number;
  region: Region;
  // Position as a percentage of the world map container, anchored at the
  // pin's center. Calibrated against /assets/map/worldmap.svg (viewBox
  // 1010x666, standard Mercator projection).
  x: number;
  y: number;
}

export const locations: Location[] = [
  { id: "usa", country: "Estados Unidos", restaurants: 6, region: "Norteamérica", x: 22, y: 38 },
  { id: "mexico", country: "México", restaurants: 11, region: "LATAM", x: 20, y: 48 },
  { id: "colombia", country: "Colombia", restaurants: 6, region: "LATAM", x: 25, y: 56 },
  { id: "peru", country: "Perú", restaurants: 8, region: "LATAM", x: 25, y: 65 },
  { id: "chile", country: "Chile", restaurants: 7, region: "LATAM", x: 27, y: 72 },
  { id: "argentina", country: "Argentina", restaurants: 7, region: "LATAM", x: 29, y: 73 },
  { id: "uruguay", country: "Uruguay", restaurants: 1, region: "LATAM", x: 31, y: 71 },
  { id: "espana", country: "España", restaurants: 21, region: "Europa", x: 46, y: 38 },
];
