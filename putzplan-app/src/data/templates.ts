import type { Room, Activity } from '../types';

// Template Räume mit Kategorien
export const templateRooms: (Omit<Room, 'id'> & { category?: string })[] = [
  // Keller
  { name: 'Waschküche', floor: 'basement', category: 'Standard' },
  { name: 'Abstellraum', floor: 'basement', category: 'Standard' },
  { name: 'Heizungskeller', floor: 'basement', category: 'Standard' },
  { name: 'Keller/Lagerraum', floor: 'basement', category: 'Standard' },
  { name: 'Hobbyraum', floor: 'basement', category: 'Optional' },
  { name: 'Weinkeller', floor: 'basement', category: 'Optional' },
  { name: 'Sauna', floor: 'basement', category: 'Wellness' },
  { name: 'Fitnessraum', floor: 'basement', category: 'Wellness' },

  // Erdgeschoss
  { name: 'Küche', floor: 'ground', category: 'Standard' },
  { name: 'Wohnzimmer', floor: 'ground', category: 'Standard' },
  { name: 'Esszimmer', floor: 'ground', category: 'Standard' },
  { name: 'Gäste-WC', floor: 'ground', category: 'Standard' },
  { name: 'Flur EG', floor: 'ground', category: 'Standard' },
  { name: 'Hauswirtschaftsraum', floor: 'ground', category: 'Optional' },
  { name: 'Gästezimmer', floor: 'ground', category: 'Optional' },
  { name: 'Wintergarten', floor: 'ground', category: 'Optional' },
  { name: 'Büro', floor: 'ground', category: 'Optional' },
  { name: 'Terrasse', floor: 'ground', category: 'Außen' },
  { name: 'Balkon EG', floor: 'ground', category: 'Außen' },

  // 1. Etage
  { name: 'Schlafzimmer', floor: 'first', category: 'Standard' },
  { name: 'Kinderzimmer 1', floor: 'first', category: 'Standard' },
  { name: 'Kinderzimmer 2', floor: 'first', category: 'Optional' },
  { name: 'Badezimmer', floor: 'first', category: 'Standard' },
  { name: 'Gäste-Bad', floor: 'first', category: 'Optional' },
  { name: 'Arbeitszimmer', floor: 'first', category: 'Standard' },
  { name: 'Flur OG', floor: 'first', category: 'Standard' },
  { name: 'Ankleide', floor: 'first', category: 'Optional' },
  { name: 'Balkon OG', floor: 'first', category: 'Außen' },
];

// Template Tätigkeiten (ohne roomId, wird später zugewiesen)
export const templateActivities: (Omit<Activity, 'id' | 'roomId' | 'createdAt'> & { category?: string })[] = [
  {
    name: 'Staubsaugen',
    description: 'Gründliches Staubsaugen aller Böden',
    intervalType: 'weekly',
    category: 'Wöchentlich',
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
    category: 'Wöchentlich',
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
    category: 'Wöchentlich',
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
    category: 'Wöchentlich',
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
    category: 'Wöchentlich',
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
    category: 'Monatlich',
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
    category: 'Monatlich',
    tasks: [
      { id: '1', description: 'Kühlschrank ausräumen', order: 0 },
      { id: '2', description: 'Fächer und Böden reinigen', order: 1 },
      { id: '3', description: 'Alles wieder einräumen', order: 2 },
    ],
  },
  {
    name: 'Backofen reinigen',
    description: 'Backofen gründlich reinigen',
    intervalType: 'monthly',
    category: 'Monatlich',
    tasks: [
      { id: '1', description: 'Backbleche und Roste entfernen', order: 0 },
      { id: '2', description: 'Innenraum reinigen', order: 1 },
      { id: '3', description: 'Glasscheibe putzen', order: 2 },
    ],
  },
  {
    name: 'Schränke auswischen',
    description: 'Schränke innen reinigen',
    intervalType: 'custom',
    intervalWeeks: 6,
    category: 'Selten',
    tasks: [
      { id: '1', description: 'Schrank ausräumen', order: 0 },
      { id: '2', description: 'Innen auswischen', order: 1 },
      { id: '3', description: 'Ordentlich einräumen', order: 2 },
    ],
  },
  {
    name: 'Lampen/Leuchten reinigen',
    description: 'Lampen abstauben und putzen',
    intervalType: 'custom',
    intervalWeeks: 8,
    category: 'Selten',
    tasks: [
      { id: '1', description: 'Lampen abstauben', order: 0 },
      { id: '2', description: 'Schirme abnehmen und reinigen', order: 1 },
      { id: '3', description: 'Wieder montieren', order: 2 },
    ],
  },
  {
    name: 'Gardinen waschen',
    description: 'Gardinen abnehmen und waschen',
    intervalType: 'custom',
    intervalWeeks: 12,
    category: 'Selten',
    tasks: [
      { id: '1', description: 'Gardinen abnehmen', order: 0 },
      { id: '2', description: 'Waschen und trocknen', order: 1 },
      { id: '3', description: 'Wieder aufhängen', order: 2 },
    ],
  },
  {
    name: 'Heizkörper reinigen',
    description: 'Heizkörper entstauben und putzen',
    intervalType: 'biweekly',
    category: 'Wöchentlich',
    tasks: [
      { id: '1', description: 'Außen abstauben', order: 0 },
      { id: '2', description: 'Zwischenräume reinigen', order: 1 },
    ],
  },
];

// Mapping: Welche Tätigkeiten passen zu welchen Räumen
export const activityRoomMapping: Record<string, string[]> = {
  'Staubsaugen': ['Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer 1', 'Kinderzimmer 2', 'Arbeitszimmer', 'Flur EG', 'Flur OG', 'Gästezimmer', 'Büro'],
  'Wischen': ['Küche', 'Badezimmer', 'Gäste-Bad', 'Gäste-WC', 'Flur EG', 'Flur OG', 'Waschküche', 'Hauswirtschaftsraum'],
  'Staubwischen': ['Wohnzimmer', 'Schlafzimmer', 'Esszimmer', 'Arbeitszimmer', 'Gästezimmer', 'Wintergarten'],
  'Bad reinigen': ['Badezimmer', 'Gäste-Bad', 'Gäste-WC'],
  'Küche putzen': ['Küche'],
  'Fenster putzen': ['Wohnzimmer', 'Küche', 'Schlafzimmer', 'Kinderzimmer 1', 'Kinderzimmer 2', 'Esszimmer', 'Arbeitszimmer', 'Wintergarten'],
  'Kühlschrank reinigen': ['Küche'],
  'Backofen reinigen': ['Küche'],
  'Schränke auswischen': ['Schlafzimmer', 'Küche', 'Kinderzimmer 1', 'Kinderzimmer 2', 'Ankleide'],
  'Lampen/Leuchten reinigen': ['Wohnzimmer', 'Esszimmer', 'Schlafzimmer', 'Flur EG', 'Flur OG'],
  'Gardinen waschen': ['Wohnzimmer', 'Esszimmer', 'Schlafzimmer', 'Kinderzimmer 1', 'Kinderzimmer 2'],
  'Heizkörper reinigen': ['Wohnzimmer', 'Schlafzimmer', 'Kinderzimmer 1', 'Kinderzimmer 2', 'Badezimmer', 'Flur EG', 'Flur OG'],
};
