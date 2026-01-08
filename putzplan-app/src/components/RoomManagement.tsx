import { useState } from 'react';
import { Plus, Trash2, Edit2, Home, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Room, FloorLevel } from '../types';
import { templateRooms } from '../data/templates';

export function RoomManagement() {
  const { rooms, addRoom, updateRoom, deleteRoom } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [formData, setFormData] = useState({ name: '', floor: 'ground' as FloorLevel });

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

  const loadTemplateRooms = () => {
    if (rooms.length > 0) {
      if (!confirm('Möchten Sie die Template-Räume zu den vorhandenen Räumen hinzufügen?')) {
        return;
      }
    }

    templateRooms.forEach((template) => {
      const newRoom: Room = {
        id: Date.now().toString() + Math.random(),
        ...template,
      };
      addRoom(newRoom);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Raumverwaltung</h2>
        <div className="flex space-x-2">
          <button
            onClick={loadTemplateRooms}
            className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            title="Standard-Räume als Vorlage laden"
          >
            <Sparkles className="w-5 h-5" />
            <span>Vorlagen laden</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Raum hinzufügen</span>
          </button>
        </div>
      </div>

      {/* Formular */}
      {(isAdding || editingRoom) && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingRoom ? 'Raum bearbeiten' : 'Neuer Raum'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raumname
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Badezimmer, Küche, Wohnzimmer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Etage
              </label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value as FloorLevel })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="basement">Keller</option>
                <option value="ground">Erdgeschoss</option>
                <option value="first">1. Etage</option>
              </select>
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingRoom ? 'Speichern' : 'Hinzufügen'}
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="flex-1 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Räume nach Etagen gruppiert */}
      <div className="space-y-6">
        {(['basement', 'ground', 'first'] as FloorLevel[]).map((floor) => (
          <div key={floor}>
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <Home className="w-5 h-5 mr-2 text-blue-600" />
              {floorLabels[floor]}
            </h3>
            {groupedRooms[floor].length === 0 ? (
              <p className="text-gray-500 italic pl-7">Keine Räume in dieser Etage</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pl-7">
                {groupedRooms[floor].map((room) => (
                  <div
                    key={room.id}
                    className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-900">{room.name}</h4>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => startEdit(room)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
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
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
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
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <Home className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-4">Noch keine Räume angelegt</p>
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Ersten Raum hinzufügen</span>
          </button>
        </div>
      )}
    </div>
  );
}
