import type { Room, Activity } from '../types';

// Template Räume
export const templateRooms: Omit<Room, 'id'>[] = [
  // Keller
  { name: 'Waschküche', floor: 'basement' },
  { name: 'Abstellraum', floor: 'basement' },
  { name: 'Heizungskeller', floor: 'basement' },

  // Erdgeschoss
  { name: 'Küche', floor: 'ground' },
  { name: 'Wohnzimmer', floor: 'ground' },
  { name: 'Esszimmer', floor: 'ground' },
  { name: 'Gäste-WC', floor: 'ground' },
  { name: 'Flur EG', floor: 'ground' },

  // 1. Etage
  { name: 'Schlafzimmer', floor: 'first' },
  { name: 'Kinderzimmer', floor: 'first' },
  { name: 'Badezimmer', floor: 'first' },
  { name: 'Arbeitszimmer', floor: 'first' },
  { name: 'Flur OG', floor: 'first' },
];

// Template Tätigkeiten (ohne roomId, wird später zugewiesen)
export const templateActivities: Omit<Activity, 'id' | 'roomId' | 'createdAt'>[] = [
  {
    name: 'Staubsaugen',
    description: 'Gründliches Staubsaugen aller Böden',
    intervalType: 'weekly',
    tasks: [
      { id: '1', description: 'Teppiche saugen', order: 0 },
      { id: '2', description: 'Unter Möbeln saugen', order: 1 },
      { id: '3', description: 'Ecken und Kanten beachten', order: 2 },
    ],
  },
  {
    name: 'Wischen',
    description: 'Böden feucht wischen',
    intervalType: 'weekly',
    tasks: [
      { id: '1', description: 'Boden kehren', order: 0 },
      { id: '2', description: 'Feucht wischen', order: 1 },
      { id: '3', description: 'Fußleisten abwischen', order: 2 },
    ],
  },
  {
    name: 'Staubwischen',
    description: 'Oberflächen von Staub befreien',
    intervalType: 'weekly',
    tasks: [
      { id: '1', description: 'Regale abwischen', order: 0 },
      { id: '2', description: 'Fensterbretter reinigen', order: 1 },
      { id: '3', description: 'Dekoration abstauben', order: 2 },
    ],
  },
  {
    name: 'Bad reinigen',
    description: 'Komplette Badreinigung',
    intervalType: 'weekly',
    tasks: [
      { id: '1', description: 'Toilette putzen', order: 0 },
      { id: '2', description: 'Waschbecken reinigen', order: 1 },
      { id: '3', description: 'Dusche/Badewanne putzen', order: 2 },
      { id: '4', description: 'Spiegel reinigen', order: 3 },
      { id: '5', description: 'Boden wischen', order: 4 },
    ],
  },
  {
    name: 'Küche putzen',
    description: 'Küche gründlich reinigen',
    intervalType: 'weekly',
    tasks: [
      { id: '1', description: 'Arbeitsflächen abwischen', order: 0 },
      { id: '2', description: 'Spüle reinigen', order: 1 },
      { id: '3', description: 'Herd reinigen', order: 2 },
      { id: '4', description: 'Fronten abwischen', order: 3 },
      { id: '5', description: 'Boden wischen', order: 4 },
    ],
  },
  {
    name: 'Fenster putzen',
    description: 'Fenster innen und außen reinigen',
    intervalType: 'monthly',
    tasks: [
      { id: '1', description: 'Scheiben innen putzen', order: 0 },
      { id: '2', description: 'Scheiben außen putzen', order: 1 },
      { id: '3', description: 'Rahmen abwischen', order: 2 },
    ],
  },
  {
    name: 'Kühlschrank reinigen',
    description: 'Kühlschrank ausräumen und putzen',
    intervalType: 'monthly',
    tasks: [
      { id: '1', description: 'Kühlschrank ausräumen', order: 0 },
      { id: '2', description: 'Fächer und Böden reinigen', order: 1 },
      { id: '3', description: 'Alles wieder einräumen', order: 2 },
    ],
  },
  {
    name: 'Schränke auswischen',
    description: 'Schränke innen reinigen',
    intervalType: 'custom',
    intervalWeeks: 6,
    tasks: [
      { id: '1', description: 'Schrank ausräumen', order: 0 },
      { id: '2', description: 'Innen auswischen', order: 1 },
      { id: '3', description: 'Ordentlich einräumen', order: 2 },
    ],
  },
];

// Mapping: Welche Tätigkeiten passen zu welchen Räumen
export const activityRoomMapping: Record<string, string[]> = {
  'Staubsaugen': ['Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer', 'Arbeitszimmer', 'Flur EG', 'Flur OG'],
  'Wischen': ['Küche', 'Badezimmer', 'Gäste-WC', 'Flur EG', 'Flur OG', 'Waschküche'],
  'Staubwischen': ['Wohnzimmer', 'Schlafzimmer', 'Esszimmer', 'Arbeitszimmer'],
  'Bad reinigen': ['Badezimmer', 'Gäste-WC'],
  'Küche putzen': ['Küche'],
  'Fenster putzen': ['Wohnzimmer', 'Küche', 'Schlafzimmer', 'Kinderzimmer'],
  'Kühlschrank reinigen': ['Küche'],
  'Schränke auswischen': ['Schlafzimmer', 'Küche', 'Kinderzimmer'],
};
