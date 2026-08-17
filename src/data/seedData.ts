import { Contribution } from '../types';
import {
  AUTHENTIC_BEADED_5_IMAGE,
  AUTHENTIC_BEADED_A_IMAGE,
  AUTHENTIC_BEADED_LAPTOP_IMAGE,
} from './charmAssets';

export const INITIAL_CONTRIBUTIONS: Contribution[] = [
  // 1. Left: Dev Team's Beaded 5 Charm + Note
  {
    id: 'c-superstar-charm',
    authorName: 'DEV TEAM',
    type: 'tribute',
    posX: 80,
    posY: 100,
    rotation: 1,
    zIndex: 10,
    createdAt: '2026-08-16T10:00:00Z',
    charm: {
      title: 'SUPERSTAR 5',
      shape: 'number-5',
      imageUrl: AUTHENTIC_BEADED_5_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "Thank you for being such an extraordinary, inspiring teammate.\nHere's to 5 incredible years and many more to come!",
    },
  },
  // 2. Middle Top: Yangon Team's Beaded "A" Monogram + Note
  {
    id: 'c-top-charm',
    authorName: 'YANGON TEAM',
    type: 'tribute',
    posX: 560,
    posY: -80,
    rotation: -1,
    zIndex: 12,
    createdAt: '2026-08-16T10:15:00Z',
    charm: {
      title: 'AMANDA "A"',
      shape: 'initial-a',
      imageUrl: AUTHENTIC_BEADED_A_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "Sending warmest congratulations across the miles on your 5-year milestone!\nSo grateful for your endless support and bright guidance.",
    },
  },
  // 3. Right: Design & Product Team's Beaded Laptop + Note
  {
    id: 'c-design-charm',
    authorName: 'DESIGN TEAM',
    type: 'tribute',
    posX: 990,
    posY: 110,
    rotation: -2,
    zIndex: 11,
    createdAt: '2026-08-16T10:05:00Z',
    charm: {
      title: 'DEV LAPTOP',
      shape: 'laptop',
      imageUrl: AUTHENTIC_BEADED_LAPTOP_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "Happy 5th Work Anniversary!\nYour eye for craft, kindness, and vision elevates everything we build together.",
    },
  },
  // 4. Bottom Left: Sarah's Beaded "A" Monogram + Note
  {
    id: 'c-sarah-charm',
    authorName: 'SARAH',
    type: 'tribute',
    posX: 100,
    posY: 680,
    rotation: 2,
    zIndex: 13,
    createdAt: '2026-08-16T10:10:00Z',
    charm: {
      title: 'INITIAL "A"',
      shape: 'initial-a',
      imageUrl: AUTHENTIC_BEADED_A_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "You truly have the biggest heart on the team.\nThank you for always listening and lifting everyone up every day!",
    },
  },
  // 5. Bottom Center: Priya's Beaded 5 + Note
  {
    id: 'c-priya-charm',
    authorName: 'PRIYA',
    type: 'tribute',
    posX: 540,
    posY: 790,
    rotation: 0,
    zIndex: 14,
    createdAt: '2026-08-16T10:20:00Z',
    charm: {
      title: 'SUPERSTAR 5',
      shape: 'number-5',
      imageUrl: AUTHENTIC_BEADED_5_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "Thank you for being such a warm, patient, and helpful teammate.\nHere's to 5 wonderful years and counting!",
    },
  },
  // 6. Bottom Right: Alex's Beaded Laptop + Note
  {
    id: 'c-alex-charm',
    authorName: 'ALEX',
    type: 'tribute',
    posX: 1010,
    posY: 720,
    rotation: 2,
    zIndex: 15,
    createdAt: '2026-08-16T10:25:00Z',
    charm: {
      title: 'CODE & CRAFT',
      shape: 'laptop',
      imageUrl: AUTHENTIC_BEADED_LAPTOP_IMAGE,
      beadTheme: 'candy-cane',
    },
    letter: {
      greeting: 'Dear Amanda',
      body: "You bring so much brightness and positive energy to every sprint.\nCheers to 5 fabulous years!",
    },
  },
];

