import { useState, useMemo } from 'react';
import { Modal } from './Modal';
import { templateActivities, activityRoomMapping } from '../data/templates';
import type { Activity, Room } from '../types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ActivityTemplateSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (activities: { template: Omit<Activity, 'id' | 'createdAt'>; rooms: Room[] }[]) => void;
  availableRooms: Room[];
}

export function ActivityTemplateSelector({ isOpen, onClose, onSelect, availableRooms }: ActivityTemplateSelectorProps) {
  const [selectedActivities, setSelectedActivities] = useState<Map<number, Set<string>>>(new Map());
  const [expandedActivity, setExpandedActivity] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = ['Wöchentlich', 'Monatlich', 'Selten'];

  const filteredActivities = useMemo(() => {
    return templateActivities.filter((activity) => {
      return filterCategory === 'all' || activity.category === filterCategory;
    });
  }, [filterCategory]);

  const toggleActivity = (activityIndex: number, roomId: string) => {
    const newSelected = new Map(selectedActivities);
    const currentRooms = newSelected.get(activityIndex) || new Set<string>();

    if (currentRooms.has(roomId)) {
      currentRooms.delete(roomId);
      if (currentRooms.size === 0) {
        newSelected.delete(activityIndex);
      } else {
        newSelected.set(activityIndex, currentRooms);
      }
    } else {
      currentRooms.add(roomId);
      newSelected.set(activityIndex, currentRooms);
    }

    setSelectedActivities(newSelected);
  };

  const toggleAllRoomsForActivity = (activityIndex: number, suggestedRoomIds: string[]) => {
    const newSelected = new Map(selectedActivities);
    const currentRooms = newSelected.get(activityIndex) || new Set<string>();

    if (currentRooms.size === suggestedRoomIds.length) {
      newSelected.delete(activityIndex);
    } else {
      newSelected.set(activityIndex, new Set(suggestedRoomIds));
    }

    setSelectedActivities(newSelected);
  };

  const getSuggestedRooms = (activityName: string): Room[] => {
    const suggestedNames = activityRoomMapping[activityName] || [];
    return availableRooms.filter(room => suggestedNames.includes(room.name));
  };

  const handleAdd = () => {
    const activitiesToAdd = Array.from(selectedActivities.entries()).flatMap(([activityIndex, roomIds]) => {
      const template = templateActivities[activityIndex];
      const { category, ...activityTemplate } = template;
      const rooms = availableRooms.filter(r => roomIds.has(r.id));

      // Füge dummy roomId hinzu (wird später überschrieben)
      return rooms.map(room => ({
        template: { ...activityTemplate, roomId: '' },
        rooms: [room],
      }));
    });

    onSelect(activitiesToAdd);
    setSelectedActivities(new Map());
    setExpandedActivity(null);
    onClose();
  };

  const totalSelected = Array.from(selectedActivities.values()).reduce((sum, rooms) => sum + rooms.size, 0);

  const intervalLabels: Record<string, string> = {
    weekly: 'Wöchentlich',
    biweekly: 'Alle 2 Wochen',
    monthly: 'Monatlich',
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Tätigkeiten aus Vorlagen auswählen"
      footer={
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {totalSelected} Tätigkeit(en) zu Räumen ausgewählt
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
              disabled={totalSelected === 0}
              className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
            >
              Hinzufügen
            </button>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {availableRooms.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800">
            ⚠️ Bitte legen Sie zuerst Räume an, bevor Sie Tätigkeiten hinzufügen.
          </div>
        )}

        {/* Filter */}
        <div className="flex items-center space-x-3">
          <div className="flex-1">
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
        </div>

        {/* Tätigkeiten-Liste */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {filteredActivities.map((activity) => {
            const originalIndex = templateActivities.findIndex(a => a === activity);
            const suggestedRooms = getSuggestedRooms(activity.name);
            const selectedRooms = selectedActivities.get(originalIndex) || new Set<string>();
            const isExpanded = expandedActivity === originalIndex;
            const allSelected = selectedRooms.size === suggestedRooms.length && suggestedRooms.length > 0;

            return (
              <div
                key={originalIndex}
                className={`border-2 rounded-xl overflow-hidden transition-all duration-200 ${
                  selectedRooms.size > 0
                    ? 'border-blue-500 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow'
                }`}
              >
                {/* Header */}
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                        <span className={`text-xs px-2 py-1 rounded ${
                          activity.category === 'Wöchentlich' ? 'bg-green-100 text-green-700' :
                          activity.category === 'Monatlich' ? 'bg-blue-100 text-blue-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {activity.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>
                          {activity.intervalType === 'custom'
                            ? `Alle ${activity.intervalWeeks} Wochen`
                            : intervalLabels[activity.intervalType]}
                        </span>
                        {activity.tasks.length > 0 && (
                          <span>{activity.tasks.length} Aufgaben</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setExpandedActivity(isExpanded ? null : originalIndex)}
                      className="ml-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-gray-600" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {/* Schnellauswahl */}
                  {suggestedRooms.length > 0 && (
                    <div className="mt-3 flex items-center space-x-2">
                      <button
                        onClick={() => toggleAllRoomsForActivity(originalIndex, suggestedRooms.map(r => r.id))}
                        className={`text-sm px-3 py-1 rounded transition-colors ${
                          allSelected
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                        }`}
                      >
                        {allSelected ? '✓ ' : ''}Alle vorgeschlagenen Räume ({suggestedRooms.length})
                      </button>
                      {selectedRooms.size > 0 && (
                        <span className="text-sm text-gray-600">
                          {selectedRooms.size} ausgewählt
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Erweiterte Details */}
                {isExpanded && (
                  <div className="border-t border-gray-200 bg-gray-50 p-4 space-y-4">
                    {/* Aufgaben */}
                    {activity.tasks.length > 0 && (
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Aufgaben:</h5>
                        <ul className="space-y-1">
                          {activity.tasks.map((task) => (
                            <li key={task.id} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{task.description}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Raum-Auswahl */}
                    <div>
                      <h5 className="text-sm font-medium text-gray-700 mb-2">
                        Für diese Räume hinzufügen:
                      </h5>
                      {suggestedRooms.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {suggestedRooms.map(room => {
                            const isSelected = selectedRooms.has(room.id);
                            return (
                              <button
                                key={room.id}
                                onClick={() => toggleActivity(originalIndex, room.id)}
                                className={`text-left p-2 rounded-lg border transition-all ${
                                  isSelected
                                    ? 'border-blue-500 bg-blue-100 text-blue-900'
                                    : 'border-gray-300 bg-white hover:border-blue-300'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}}
                                    className="w-4 h-4 text-blue-600 rounded"
                                  />
                                  <span className="text-sm font-medium">{room.name}</span>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">
                          Keine passenden Räume gefunden. Diese Tätigkeit kann manuell hinzugefügt werden.
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Keine Tätigkeiten mit diesem Filter gefunden
          </div>
        )}
      </div>
    </Modal>
  );
}
