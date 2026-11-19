import type { L } from "../i18n";

export type Wing = "Bozok" | "Üçok";
export type SonId = "gun" | "ay" | "yildiz" | "gok" | "dag" | "deniz";
export type Confidence = "verified" | "reported" | "contested";

export type ResourceId = "azik" | "kereste" | "tas" | "demir" | "altin" | "celik";
export type Resources = Record<ResourceId, number>;

export type TroopId = "azap" | "okcu" | "sipahi";
export type Troops = Record<TroopId, number>;

export type BuildingId = "otag" | "cami" | "medrese" | "kervansaray" | "kisla" | "ahir" | "depo" | "demirci" | "sifahane" | "ciftlik" | "kerestehane" | "tasocagi" | "maden";
export type HerdId = "koyun" | "at" | "deve";
export type TowerType = "gozcu" | "okcuBurcu" | "mancinik";

/** Percentage bonuses a tribe, a conquered state or a hero can grant. */
export interface Buffs {
  azikPct?: number;
  kerestePct?: number;
  tasPct?: number;
  demirPct?: number;
  altinPct?: number;
  infantryPct?: number;
  archerPct?: number;
  cavalryPct?: number;
  defensePct?: number;
  buildCostPct?: number;
  trainCostPct?: number;
  healPct?: number;
  huntPct?: number;
  towerPct?: number;
}

export interface Son {
  id: SonId;
  name: string;
  meaning: L;
  wing: Wing;
  ongon: L;
  ongonConfidence: Confidence;
}

export interface Tribe {
  id: string;
  order: number;
  name: string;
  son: SonId;
  wing: Wing;
  meaning: L;
  meaningConfidence: Confidence;
  legacy: L;
  legacyConfidence: Confidence;
  colors: [string, string];
  specialty: L;
  buffs: Buffs;
}

export type Region = "Central Asia" | "Khorasan & Afghanistan" | "Iran" | "Anatolia" | "Levant & Iraq" | "Egypt" | "Caucasus" | "Hindustan" | "Pontic Steppe";

export interface HistoricalState {
  id: string;
  name: string;
  seat: string;
  region: Region;
  era: string;
  /** Tribe id of the ruling house when the sources link it to one of the 24 tribes. */
  tribeLink?: string;
  linkConfidence?: Confidence;
  note: L;
  /** Approximate longitude and latitude of the seat. */
  lonLat: [number, number];
  defenders: Troops;
  tribute: Buffs;
  tier: number;
}

/** Headwear and dress of a portrait; every look is fully covered period dress. */
export type HeroLook = "bork" | "akinci" | "turban" | "sultan" | "scholar" | "fez" | "hatun";

export interface Hero {
  id: string;
  name: string;
  role: string;
  troop: TroopId | "support";
  /** Tribe id when known; otherwise the hero is an allied commander outside the 24 tribes. */
  tribe?: string;
  origin: L;
  skill: string;
  power: number;
  unlockCost: number;
  gender: "m" | "f";
  /** Kaftan and trim colours for the portrait. */
  colors: [string, string];
  look: HeroLook;
  beard?: "full" | "moustache" | "white";
  conf?: Confidence;
}

export interface Beast {
  id: string;
  name: L;
  power: number;
  reward: Partial<Resources>;
  xp: number;
  cooldownMin: number;
  boss?: boolean;
}

export interface HeroState {
  level: number;
  xp: number;
}

/** A chronicle line: a text key from i18n/strings.ts with its values, so it shows in the player's language. */
export interface Msg {
  k: string;
  v?: Record<string, string | number>;
}

export interface BattleReport {
  title: Msg;
  win: boolean;
  lines: Msg[];
  at: number;
}

export interface GameState {
  version: number;
  tribe: string | null;
  resources: Resources;
  buildings: Record<BuildingId, number>;
  troops: Troops;
  wounded: Troops;
  herds: Record<HerdId, number>;
  heroes: Record<string, HeroState>;
  conquered: string[];
  towers: (TowerType | null)[];
  towerLevels: number[];
  defenseWave: number;
  huntCooldowns: Record<string, number>;
  log: BattleReport[];
  /** Up to three heroes taken into battle, hunts and sieges. */
  squad: string[];
  /** Feast (toy) buff: production +10% until this time. */
  toyUntil: number;
  lastToy: number;
  /** Path through history (eras.ts) and the current era index. */
  path: string | null;
  era: number;
  /** Forts taken by gaza. `conquered` holds the Muslim and Turkic states united by alliance. */
  forts: string[];
  huntsWon: number;
  /** Akıncı and frontier houses: level per house id. */
  ocaks: Record<string, number>;
  /** True once the last era of the path is complete. */
  founded: boolean;
  lastTick: number;
}
