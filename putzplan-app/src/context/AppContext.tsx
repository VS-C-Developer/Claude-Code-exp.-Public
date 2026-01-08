import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Room, Activity, CompletionRecord } from '../types';
import { StorageService } from '../services/storage';

interface AppContextType {
  rooms: Room[];
  activities: Activity[];
  completionRecords: CompletionRecord[];
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (roomId: string) => void;
  addActivity: (activity: Activity) => void;
  updateActivity: (activity: Activity) => void;
  deleteActivity: (activityId: string) => void;
  addCompletionRecord: (record: CompletionRecord) => void;
  getActivitiesByRoom: (roomId: string) => Activity[];
  getRoomById: (roomId: string) => Room | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [completionRecords, setCompletionRecords] = useState<CompletionRecord[]>([]);

  // Laden der Daten beim Start
  useEffect(() => {
    const state = StorageService.loadState();
    setRooms(state.rooms);
    setActivities(state.activities);
    setCompletionRecords(state.completionRecords);
  }, []);

  // Raum-Funktionen
  const addRoom = (room: Room) => {
    const newRooms = [...rooms, room];
    setRooms(newRooms);
    StorageService.saveRooms(newRooms);
  };

  const updateRoom = (room: Room) => {
    const newRooms = rooms.map((r) => (r.id === room.id ? room : r));
    setRooms(newRooms);
    StorageService.saveRooms(newRooms);
  };

  const deleteRoom = (roomId: string) => {
    const newRooms = rooms.filter((r) => r.id !== roomId);
    setRooms(newRooms);
    StorageService.saveRooms(newRooms);

    // Auch alle Tätigkeiten in diesem Raum löschen
    const newActivities = activities.filter((a) => a.roomId !== roomId);
    setActivities(newActivities);
    StorageService.saveActivities(newActivities);
  };

  // Tätigkeits-Funktionen
  const addActivity = (activity: Activity) => {
    const newActivities = [...activities, activity];
    setActivities(newActivities);
    StorageService.saveActivities(newActivities);
  };

  const updateActivity = (activity: Activity) => {
    const newActivities = activities.map((a) => (a.id === activity.id ? activity : a));
    setActivities(newActivities);
    StorageService.saveActivities(newActivities);
  };

  const deleteActivity = (activityId: string) => {
    const newActivities = activities.filter((a) => a.id !== activityId);
    setActivities(newActivities);
    StorageService.saveActivities(newActivities);
  };

  // Completion Record Funktionen
  const addCompletionRecord = (record: CompletionRecord) => {
    const newRecords = [...completionRecords, record];
    setCompletionRecords(newRecords);
    StorageService.saveCompletionRecords(newRecords);
  };

  // Hilfsfunktionen
  const getActivitiesByRoom = (roomId: string) => {
    return activities.filter((a) => a.roomId === roomId);
  };

  const getRoomById = (roomId: string) => {
    return rooms.find((r) => r.id === roomId);
  };

  const value: AppContextType = {
    rooms,
    activities,
    completionRecords,
    addRoom,
    updateRoom,
    deleteRoom,
    addActivity,
    updateActivity,
    deleteActivity,
    addCompletionRecord,
    getActivitiesByRoom,
    getRoomById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
