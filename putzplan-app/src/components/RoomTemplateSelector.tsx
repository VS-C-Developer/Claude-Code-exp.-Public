import { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { templateRooms } from '../data/templates';
import type { Room, FloorLevel } from '../types';

interface RoomTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (rooms: Omit<Room, 'id'>[]) => void;
}

export function RoomTemplateSelector({ isOpen, onClose, onSelect }: RoomTemplateSelectorProps) {
  const [selectedRooms, setSelectedRooms] = useState<Set<number>>(new Set());
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterFloor, setFilterFloor] = useState<string>('all');

  const categories = ['Standard', 'Optional', 'Wellness', 'Außen'];
  const floors: { value: FloorLevel | 'all'; label: string }[] = [
    { value: 'all', label: 'Alle Etagen' },
    { value: 'basement', label: 'Keller' },
    { value: 'ground', label: 'Erdgeschoss' },
    { value: 'first', label: '1. Etage' },
  ];

  const filteredRooms = useMemo(() => {
    return templateRooms.filter((room) => {
      const matchesCategory = filterCategory === 'all' || room.category === filterCategory;
      const matchesFloor = filterFloor === 'all' || room.floor === filterFloor;
      return matchesCategory && matchesFloor;
    });
  }, [filterCategory, filterFloor]);

  const toggleRoom = (index: number) => {
    const newSelected = new Set(selectedRooms);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedRooms(newSelected);
  };

  const selectAll = () => {
    const allIndexes = filteredRooms.map((room) =>
      templateRooms.findIndex(r => r === room)
    );
    setSelectedRooms(new Set(allIndexes));
  };

  const clearAll = () => {
    setSelectedRooms(new Set());
  };

  const handleAdd = () => {
    const roomsToAdd = Array.from(selectedRooms).map(idx => {
      const { category, ...room } = templateRooms[idx];
      return room;
    });
    onSelect(roomsToAdd);
    setSelectedRooms(new Set());
    onClose();
  };

  const floorLabels: Record<FloorLevel, string> = {
    basement: 'Keller',
    ground: 'EG',
    first: 'OG',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Räume aus Vorlagen auswählen"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedRooms.size} Raum/Räume ausgewählt
          </div>
          <div className="flex space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Abbrechen
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedRooms.size === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Filter */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kategorie
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Etage
            </label>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {floors.map(floor => (
                <option key={floor.value} value={floor.value}>{floor.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Auswahl-Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={selectAll}
            className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Alle auswählen
          </button>
          <button
            onClick={clearAll}
            className="text-sm px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Auswahl aufheben
          </button>
        </div>

        {/* Raum-Liste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
          {filteredRooms.map((room) => {
            const originalIndex = templateRooms.findIndex(r => r === room);
            const isSelected = selectedRooms.has(originalIndex);

            return (
              <button
                key={originalIndex}
                onClick={() => toggleRoom(originalIndex)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-blue-500 bg-blue-50 shadow-md scale-105'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                      />
                      <h4 className="font-semibold text-gray-900">{room.name}</h4>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {floorLabels[room.floor]}
                      </span>
                      {room.category && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          room.category === 'Standard' ? 'bg-green-100 text-green-700' :
                          room.category === 'Optional' ? 'bg-blue-100 text-blue-700' :
                          room.category === 'Wellness' ? 'bg-purple-100 text-purple-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {room.category}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {filteredRooms.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Keine Räume mit diesen Filtern gefunden
          </div>
        )}
      </div>
    </Modal>
  );
}
