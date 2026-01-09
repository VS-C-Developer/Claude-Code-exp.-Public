import { useState } from 'react';
import { Plus, Trash2, Edit2, Home, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Room, FloorLevel } from '../types';
import { RoomTemplateSelector } from './RoomTemplateSelector';

export function RoomManagement() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({ name: '', floor: 'ground' as FloorLevel });
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  const floorLabels: Record<FloorLevel, string> = {
    basement: 'Keller',
    ground: 'Erdgeschoss',
    first: '1. Etage',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingRoom) {
      updateRoom({ ...editingRoom, ...formData });
      setEditingRoom(null);
    } else {
      const newRoom: Room = {
        id: Date.now().toString(),
        name: formData.name,
        floor: formData.floor,
      };
      addRoom(newRoom);
      setIsAdding(false);
    }
    setFormData({ name: '', floor: 'ground' });
  };

  const startEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({ name: room.name, floor: room.floor });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingRoom(null);
    setIsAdding(false);
    setFormData({ name: '', floor: 'ground' });
  };

  const groupedRooms = {
    basement: rooms.filter((r) => r.floor === 'basement'),
    ground: rooms.filter((r) => r.floor === 'ground'),
    first: rooms.filter((r) => r.floor === 'first'),
  };

  const handleTemplateSelect = (selectedRooms: Omit<Room, 'id'>[]) => {
    selectedRooms.forEach((template, idx) => {
      setTimeout(() => {
        const newRoom: Room = {
          id: Date.now().toString() + Math.random(),
          ...template,
        };
        addRoom(newRoom);
      }, idx * 10); // Kleine Verzögerung für eindeutige IDs
    });
  };

  return (
    <div className="space-y-6 animate-slide-in-up">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-win11-gray-900 tracking-tight">Raumverwaltung</h2>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center space-x-2 bg-win11-blue-600 text-white px-4 py-2.5 rounded-win11 hover:bg-win11-blue-700 transition-all shadow-win11-sm hover:shadow-win11"
            title="Räume aus Vorlagen auswählen"
          >
            <Sparkles className="w-4 h-4" />
            <span className="font-medium text-sm">Vorlagen</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-win11-blue-600 text-white px-4 py-2.5 rounded-win11 hover:bg-win11-blue-700 transition-all shadow-win11-sm hover:shadow-win11"
          >
            <Plus className="w-4 h-4" />
            <span className="font-medium text-sm">Raum hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Formular */}
      {(isAdding || editingRoom) && (
        <div className="glass-card p-6 rounded-win11-lg shadow-win11 border border-white/20">
          <h3 className="text-lg font-semibold text-win11-gray-900 mb-5">
            {editingRoom ? 'Raum bearbeiten' : 'Neuer Raum'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-win11-gray-700 mb-2">
                Raumname
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-win11-gray-300 rounded-win11 focus:ring-2 focus:ring-win11-blue-500 focus:border-win11-blue-500 transition-all outline-none"
                placeholder="z.B. Badezimmer, Küche, Wohnzimmer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-win11-gray-700 mb-2">
                Etage
              </label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value as FloorLevel })}
                className="w-full px-4 py-2.5 border border-win11-gray-300 rounded-win11 focus:ring-2 focus:ring-win11-blue-500 focus:border-win11-blue-500 transition-all outline-none"
              >
                <option value="basement">Keller</option>
                <option value="ground">Erdgeschoss</option>
                <option value="first">1. Etage</option>
              </select>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-win11-blue-600 text-white px-4 py-2.5 rounded-win11 hover:bg-win11-blue-700 transition-all font-medium shadow-win11-sm hover:shadow-win11"
              >
                {editingRoom ? 'Speichern' : 'Hinzufügen'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-win11-gray-200 text-win11-gray-700 px-4 py-2.5 rounded-win11 hover:bg-win11-gray-300 transition-all font-medium"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Räume nach Etagen gruppiert */}
      <div className="space-y-8">
        {(['basement', 'ground', 'first'] as FloorLevel[]).map((floor) => (
          <div key={floor}>
            <h3 className="text-lg font-semibold text-win11-gray-900 mb-4 flex items-center">
              <Home className="w-5 h-5 mr-2.5 text-win11-blue-600" />
              {floorLabels[floor]}
            </h3>
            {groupedRooms[floor].length === 0 ? (
              <p className="text-win11-gray-500 italic pl-7">Keine Räume in dieser Etage</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-7">
                {groupedRooms[floor].map((room) => (
                  <div
                    key={room.id}
                    className="glass-card p-4 rounded-win11-lg shadow-win11-sm hover:shadow-win11 transition-all border border-white/20"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-win11-gray-900">{room.name}</h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(room)}
                          className="w-7 h-7 flex items-center justify-center text-win11-blue-600 hover:bg-win11-blue-50 rounded-win11 transition-all"
                          title="Bearbeiten"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Raum "${room.name}" wirklich löschen?`)) {
                              deleteRoom(room.id);
                            }
                          }}
                          className="w-7 h-7 flex items-center justify-center text-red-600 hover:bg-red-50 rounded-win11 transition-all"
                          title="Löschen"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {rooms.length === 0 && !isAdding && (
        <div className="text-center py-16 glass-card rounded-win11-xl shadow-win11 border border-white/20">
          <Home className="w-16 h-16 mx-auto text-win11-gray-400 mb-4" />
          <p className="text-win11-gray-600 mb-6">Noch keine Räume angelegt</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center space-x-2 bg-win11-blue-600 text-white px-6 py-3 rounded-win11 hover:bg-win11-blue-700 transition-all shadow-win11-sm hover:shadow-win11 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Ersten Raum hinzufügen</span>
          </button>
        </div>
      )}

      {/* Template-Auswahl-Dialog */}
      <RoomTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
      />
    </div>
  );
}
