export type ContributionType = 'tribute' | 'charm' | 'letter';

export type BeadTheme =
  | 'candy-cane' // Red, pearl white & gold (like the beaded 5 charm)
  | 'ocean' // Sapphire blue, seafoam & pearl
  | 'sunset' // Coral, amber & gold
  | 'lavender' // Lilac, cream & silver
  | 'forest' // Emerald, mint & gold
  | 'classic-pearl' // Lustrous pearls & gold beads
  | 'monochrome'; // Ink black, silver & pearl

export type ClaspType = 'silver-clip' | 'gold-ring' | 'heart-clasp';

export interface BeadedCharmContent {
  title: string; // e.g. "5", "STAR", "CHAMP", "A"
  shape?: string; // 'number-5' | 'star' | 'heart' | 'initial-a' | 'flower' | 'clover' | 'custom'
  beadTheme?: BeadTheme;
  claspType?: ClaspType;
  generatedSvg?: string;
  imageUrl?: string;
  genPrompt?: string;
  beadColors?: string[]; // primary, secondary, accent
  hangAngle?: number;
}

export interface LetterContent {
  greeting: string;
  body: string;
  signature?: string;
  paperTone?: 'ivory' | 'parchment' | 'newsprint' | 'vellum';
  sealColor?: string;
}

export interface Contribution {
  id: string;
  authorName: string;
  authorRole?: string;
  type: ContributionType;
  charm?: BeadedCharmContent;
  letter?: LetterContent;
  posX: number;
  posY: number;
  rotation: number;
  width?: number;
  height?: number;
  zIndex: number;
  createdAt: string;
}
