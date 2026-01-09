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
          <div className="text-sm text-win11-gray-600 font-medium">
            {selectedRooms.size} Raum{selectedRooms.size !== 1 ? 'e' : ''} ausgewählt
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 border border-win11-gray-300 rounded-win11 hover:bg-win11-gray-50 transition-all font-medium text-win11-gray-700"
            >
              Abbrechen
            </button>
            <button
              onClick={handleAdd}
              disabled={selectedRooms.size === 0}
              className="px-6 py-2.5 bg-win11-blue-600 text-white rounded-win11 hover:bg-win11-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-win11-sm hover:shadow-win11 font-medium"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Filter */}
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-win11-gray-700 mb-2">
              Kategorie
            </label>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-2.5 border border-win11-gray-300 rounded-win11 focus:ring-2 focus:ring-win11-blue-500 focus:border-win11-blue-500 transition-all outline-none"
            >
              <option value="all">Alle Kategorien</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-win11-gray-700 mb-2">
              Etage
            </label>
            <select
              value={filterFloor}
              onChange={(e) => setFilterFloor(e.target.value)}
              className="w-full px-4 py-2.5 border border-win11-gray-300 rounded-win11 focus:ring-2 focus:ring-win11-blue-500 focus:border-win11-blue-500 transition-all outline-none"
            >
              {floors.map(floor => (
                <option key={floor.value} value={floor.value}>{floor.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Auswahl-Buttons */}
        <div className="flex space-x-3">
          <button
            onClick={selectAll}
            className="text-sm px-4 py-2 bg-win11-blue-50 text-win11-blue-700 rounded-win11 hover:bg-win11-blue-100 transition-all font-medium"
          >
            Alle auswählen
          </button>
          <button
            onClick={clearAll}
            className="text-sm px-4 py-2 bg-win11-gray-100 text-win11-gray-700 rounded-win11 hover:bg-win11-gray-200 transition-all font-medium"
          >
            Auswahl aufheben
          </button>
        </div>

        {/* Raum-Liste */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[400px] overflow-y-auto pr-2">
          {filteredRooms.map((room) => {
            const originalIndex = templateRooms.findIndex(r => r === room);
            const isSelected = selectedRooms.has(originalIndex);

            return (
              <button
                key={originalIndex}
                onClick={() => toggleRoom(originalIndex)}
                className={`text-left p-4 rounded-win11-lg border-2 transition-all duration-200 ${
                  isSelected
                    ? 'border-win11-blue-500 bg-win11-blue-50 shadow-win11'
                    : 'border-win11-gray-200 hover:border-win11-gray-300 hover:shadow-win11-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}}
                        className="w-4 h-4 text-win11-blue-600 rounded focus:ring-2 focus:ring-win11-blue-500"
                      />
                      <h4 className="font-semibold text-win11-gray-900">{room.name}</h4>
                    </div>
                    <div className="mt-3 flex items-center space-x-2 ml-7">
                      <span className="text-xs px-2.5 py-1 bg-win11-gray-100 text-win11-gray-700 rounded-win11">
                        {floorLabels[room.floor]}
                      </span>
                      {room.category && (
                        <span className={`text-xs px-2.5 py-1 rounded-win11 font-medium ${
                          room.category === 'Standard' ? 'bg-green-50 text-green-700' :
                          room.category === 'Optional' ? 'bg-blue-50 text-blue-700' :
                          room.category === 'Wellness' ? 'bg-purple-50 text-purple-700' :
                          'bg-orange-50 text-orange-700'
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
          <div className="text-center py-12 text-win11-gray-500">
            Keine Räume mit diesen Filtern gefunden
          </div>
        )}
      </div>
    </Modal>
  );
}
