// Intervall-Typen für Tätigkeiten
export type IntervalType = 'weekly' | 'biweekly' | 'monthly' | 'custom';

// Ebenen im Haus
export type FloorLevel = 'basement' | 'ground' | 'first';

// Raum-Typ
export interface Room {
  id: string;
  name: string;
  floor: FloorLevel;
}

// Tätigkeit (z.B. "Staubsaugen", "Wischen")
export interface Activity {
  id: string;
  name: string;
  description: string;
  roomId: string;
  intervalType: IntervalType;
  intervalWeeks?: number; // Für custom Intervalle (z.B. alle 6 Wochen)
  tasks: Task[];
  createdAt: string;
}

// Task (Unter-Aufgabe einer Tätigkeit)
export interface Task {
  id: string;
  description: string;
  order: number;
}

// Erledigungs-Record
export interface CompletionRecord {
  id: string;
  activityId: string;
  roomId: string;
  completedAt: string; // ISO Date String
  week: string; // Format: "2024-W01"
  notes?: string;
}

// Wochenplan (für PDF-Export)
export interface WeeklyPlan {
  weekNumber: string; // Format: "2024-W01"
  startDate: string;
  endDate: string;
  activities: {
    activity: Activity;
    room: Room;
  }[];
}

// App State
export interface AppState {
  rooms: Room[];
  activities: Activity[];
  completionRecords: CompletionRecord[];
}
