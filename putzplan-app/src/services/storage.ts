import type { AppState, Room, Activity, CompletionRecord } from '../types';

const STORAGE_KEY = 'putzplan-app-state';

// Initiale Daten
const initialState: AppState = {
  rooms: [],
  activities: [],
  completionRecords: [],
};

export class StorageService {
  // Laden des kompletten States
  static loadState(): AppState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Fehler beim Laden der Daten:', error);
    }
    return initialState;
  }

  // Speichern des kompletten States
  static saveState(state: AppState): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Fehler beim Speichern der Daten:', error);
    }
  }

  // Räume
  static getRooms(): Room[] {
    return this.loadState().rooms;
  }

  static saveRooms(rooms: Room[]): void {
    const state = this.loadState();
    state.rooms = rooms;
    this.saveState(state);
  }

  // Tätigkeiten
  static getActivities(): Activity[] {
    return this.loadState().activities;
  }

  static saveActivities(activities: Activity[]): void {
    const state = this.loadState();
    state.activities = activities;
    this.saveState(state);
  }

  // Erledigungs-Records
  static getCompletionRecords(): CompletionRecord[] {
    return this.loadState().completionRecords;
  }

  static saveCompletionRecords(records: CompletionRecord[]): void {
    const state = this.loadState();
    state.completionRecords = records;
    this.saveState(state);
  }

  // Hinzufügen eines neuen Completion Records
  static addCompletionRecord(record: CompletionRecord): void {
    const records = this.getCompletionRecords();
    records.push(record);
    this.saveCompletionRecords(records);
  }

  // Export aller Daten (für Backup)
  static exportData(): string {
    return JSON.stringify(this.loadState(), null, 2);
  }

  // Import von Daten (für Backup-Restore)
  static importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      this.saveState(data);
      return true;
    } catch (error) {
      console.error('Fehler beim Importieren der Daten:', error);
      return false;
    }
  }

  // Alle Daten löschen
  static clearAll(): void {
    localStorage.removeItem(STORAGE_KEY);
  }
}
