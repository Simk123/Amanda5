import { BeadTheme } from '../types';
import designer4Url from '../assets/designer4.png';
import beadedAUrl from '../assets/beadedA.png';
import beadedLaptopUrl from '../assets/beaded_laptop.png';

export interface BeadThemeConfig {
  id: BeadTheme;
  label: string;
  previewColor: string;
  filter: string; // CSS filter applied to the authentic beaded charm photo
  primaryColor: string;
  secondaryColor: string;
  pearlTone: string;
  accentColor: string;
}

export const BEAD_THEME_CONFIGS: Record<BeadTheme, BeadThemeConfig> = {
  'candy-cane': {
    id: 'candy-cane',
    label: 'Candy Cane Ruby (Original)',
    previewColor: '#e73827',
    filter: 'none',
    primaryColor: '#e73827',
    secondaryColor: '#ffffff',
    pearlTone: '#fffdfa',
    accentColor: '#f59e0b',
  },
  'ocean': {
    id: 'ocean',
    label: 'Ocean Sapphire',
    previewColor: '#0ea5e9',
    filter: 'hue-rotate(185deg) saturate(1.3) brightness(1.02) contrast(1.04)',
    primaryColor: '#0284c7',
    secondaryColor: '#e0f2fe',
    pearlTone: '#f0f9ff',
    accentColor: '#38bdf8',
  },
  'sunset': {
    id: 'sunset',
    label: 'Sunset Amber',
    previewColor: '#f97316',
    filter: 'hue-rotate(330deg) saturate(1.4) brightness(1.05) contrast(1.02)',
    primaryColor: '#ea580c',
    secondaryColor: '#ffedd5',
    pearlTone: '#fff7ed',
    accentColor: '#facc15',
  },
  'lavender': {
    id: 'lavender',
    label: 'Lavender Amethyst',
    previewColor: '#a855f7',
    filter: 'hue-rotate(245deg) saturate(1.25) brightness(1.04) contrast(1.03)',
    primaryColor: '#9333ea',
    secondaryColor: '#f3e8ff',
    pearlTone: '#faf5ff',
    accentColor: '#d8b4fe',
  },
  'forest': {
    id: 'forest',
    label: 'Emerald Forest',
    previewColor: '#10b981',
    filter: 'hue-rotate(95deg) saturate(1.25) brightness(0.96) contrast(1.03)',
    primaryColor: '#059669',
    secondaryColor: '#ecfdf5',
    pearlTone: '#f0fdf4',
    accentColor: '#fbbf24',
  },
  'classic-pearl': {
    id: 'classic-pearl',
    label: 'Pure Pearl & Diamond',
    previewColor: '#f8fafc',
    filter: 'grayscale(1) brightness(1.22) contrast(1.08)',
    primaryColor: '#e2e8f0',
    secondaryColor: '#ffffff',
    pearlTone: '#ffffff',
    accentColor: '#94a3b8',
  },
  'monochrome': {
    id: 'monochrome',
    label: 'Onyx & Platinum',
    previewColor: '#334155',
    filter: 'grayscale(1) contrast(1.3) brightness(0.85)',
    primaryColor: '#1e293b',
    secondaryColor: '#cbd5e1',
    pearlTone: '#f1f5f9',
    accentColor: '#64748b',
  },
};

export const AUTHENTIC_BEADED_5_IMAGE = designer4Url || '/designer4.png';
export const AUTHENTIC_BEADED_A_IMAGE = beadedAUrl || '/beadedA.png';
export const AUTHENTIC_BEADED_LAPTOP_IMAGE = beadedLaptopUrl || '/beaded_laptop.png';

export interface CharmPreset {
  id: 'number-5' | 'initial-a' | 'laptop';
  name: string;
  subtitle: string;
  defaultTitle: string;
  imageUrl: string;
}

export const CHARM_PRESETS: CharmPreset[] = [
  {
    id: 'number-5',
    name: 'Anniversary 5',
    subtitle: 'Milestone 5 Charm',
    defaultTitle: 'SUPERSTAR 5',
    imageUrl: AUTHENTIC_BEADED_5_IMAGE,
  },
  {
    id: 'initial-a',
    name: 'Amanda "A"',
    subtitle: 'Beaded Monogram',
    defaultTitle: 'AMANDA "A"',
    imageUrl: AUTHENTIC_BEADED_A_IMAGE,
  },
  {
    id: 'laptop',
    name: 'Work Laptop',
    subtitle: 'Tech & Craft Charm',
    defaultTitle: 'DEV LAPTOP',
    imageUrl: AUTHENTIC_BEADED_LAPTOP_IMAGE,
  },
];

export function getCharmImageUrl(shape?: string): string {
  if (shape === 'initial-a' || shape === 'letter-a') {
    return AUTHENTIC_BEADED_A_IMAGE;
  }
  if (shape === 'laptop' || shape === 'computer') {
    return AUTHENTIC_BEADED_LAPTOP_IMAGE;
  }
  return AUTHENTIC_BEADED_5_IMAGE;
}

export function getBeadThemeFilter(theme?: BeadTheme): string {
  if (!theme || !BEAD_THEME_CONFIGS[theme]) return 'none';
  return BEAD_THEME_CONFIGS[theme].filter;
}

