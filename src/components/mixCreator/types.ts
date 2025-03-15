export interface HarmonicBlock {
  id: string;
  code: string;
  name: string;
  type: "EB" | "PT" | "EP" | "ER" | "OP" | "CL" | "QS" | "CUSTOM";
  keyPattern: string[];
  energyProfile: number[];
  duration: number;
  trackPositions: {
    id: string;
    key: string;
    energy: number;
    trackId?: string;
    trackName?: string;
    artist?: string;
    bpm?: number;
    tags?: string[];
    bridgeType?: string;
  }[];
  color: string;
  genreAffinity?: string[];
  isCustom?: boolean;
}

export interface TransitionBridge {
  id: string;
  fromBlockId: string;
  toBlockId: string;
  type: "PERFECT" | "NATURAL" | "MODAL" | "ENERGY" | "TENSION";
  trackPositions: {
    id: string;
    key: string;
    trackId?: string;
    trackName?: string;
    artist?: string;
    bpm?: number;
  }[];
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  key: string;
  bpm: number;
  duration: number;
  energy: number;
  tags?: string[];
  genre?: string;
  waveform?: string;
  color?: string;
  role?: string;
  bridgeCompatibility?: string[];
}

export interface ModularBlocksCreatorProps {
  onComplete: (blocks: HarmonicBlock[], bridges: TransitionBridge[]) => void;
  onCancel: () => void;
  availableTracks?: Track[];
}

export interface MixState {
  blocks: HarmonicBlock[];
  bridges: TransitionBridge[];
  selectedBlockId: string | null;
  selectedPositionId: string | null;
}

export interface MixAction {
  type: string;
  payload?: any;
}

export interface MixTemplate {
  id: string;
  name: string;
  description: string;
  blocks: string[];
  duration: number;
  difficulty: string;
  genres: string[];
}

export interface SavedMix {
  id: string;
  name: string;
  description?: string;
  blocks: HarmonicBlock[];
  bridges: TransitionBridge[];
  created: string;
  lastModified?: string;
  duration: number;
}
