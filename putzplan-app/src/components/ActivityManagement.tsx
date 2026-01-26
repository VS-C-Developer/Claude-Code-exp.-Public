import { useState } from 'react';
import { Plus, Trash2, Edit2, ListTodo, X, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import type { Activity, IntervalType, Task } from '../types';
import { ActivityTemplateSelector } from './ActivityTemplateSelector';

export function ActivityManagement() {
  const { rooms, activities, addActivity, updateActivity, deleteActivity } = useApp();
  const [isAdding, setIsAdding] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    roomId: '',
    intervalType: 'weekly' as IntervalType,
    intervalWeeks: 1,
    tasks: [] as Task[],
  });
  const [newTaskDesc, setNewTaskDesc] = useState('');

  const intervalLabels: Record<IntervalType, string> = {
    weekly: 'Wöchentlich',
    biweekly: 'Alle 2 Wochen',
    monthly: 'Monatlich (alle 4 Wochen)',
    custom: 'Benutzerdefiniert',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.roomId) return;

    const activityData = {
      name: formData.name,
      description: formData.description,
      roomId: formData.roomId,
      intervalType: formData.intervalType,
      intervalWeeks: formData.intervalType === 'custom' ? formData.intervalWeeks : undefined,
      tasks: formData.tasks,
      createdAt: new Date().toISOString(),
    };

    if (editingActivity) {
      updateActivity({ ...editingActivity, ...activityData });
      setEditingActivity(null);
    } else {
      const newActivity: Activity = {
        id: Date.now().toString(),
        ...activityData,
      };
      addActivity(newActivity);
      setIsAdding(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      roomId: '',
      intervalType: 'weekly',
      intervalWeeks: 1,
      tasks: [],
    });
    setNewTaskDesc('');
  };

  const startEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      name: activity.name,
      description: activity.description,
      roomId: activity.roomId,
      intervalType: activity.intervalType,
      intervalWeeks: activity.intervalWeeks || 1,
      tasks: [...activity.tasks],
    });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingActivity(null);
    setIsAdding(false);
    resetForm();
  };

  const addTask = () => {
    if (!newTaskDesc.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      description: newTaskDesc,
      order: formData.tasks.length,
    };
    setFormData({ ...formData, tasks: [...formData.tasks, newTask] });
    setNewTaskDesc('');
  };

  const removeTask = (taskId: string) => {
    setFormData({
      ...formData,
      tasks: formData.tasks.filter((t) => t.id !== taskId),
    });
  };

  const groupedActivities = rooms.reduce((acc, room) => {
    acc[room.id] = activities.filter((a) => a.roomId === room.id);
    return acc;
  }, {} as Record<string, Activity[]>);

  const handleTemplateSelect = (
    selectedActivities: { template: Omit<Activity, 'id' | 'createdAt'>; rooms: any[] }[]
  ) => {
    selectedActivities.forEach((item, idx) => {
      item.rooms.forEach((room) => {
        setTimeout(() => {
          const { tasks, ...templateWithoutTasks } = item.template;
          const newActivity: Activity = {
            ...templateWithoutTasks,
            id: Date.now().toString() + Math.random(),
            roomId: room.id,
            createdAt: new Date().toISOString(),
            tasks: tasks.map((task, taskIdx) => ({
              ...task,
              id: Date.now().toString() + Math.random() + taskIdx,
            })),
          };
          addActivity(newActivity);
        }, idx * 10);
      });
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Tätigkeitsverwaltung</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowTemplateSelector(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
            disabled={rooms.length === 0}
            title="Tätigkeiten aus Vorlagen auswählen"
          >
            <Sparkles className="w-5 h-5" />
            <span>Vorlagen</span>
          </button>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            disabled={rooms.length === 0}
          >
            <Plus className="w-5 h-5" />
            <span>Tätigkeit hinzufügen</span>
          </button>
        </div>
      </div>

      {rooms.length === 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800">
            Bitte legen Sie zuerst Räume an, bevor Sie Tätigkeiten erstellen.
          </p>
        </div>
      )}

      {/* Formular */}
      {(isAdding || editingActivity) && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">
            {editingActivity ? 'Tätigkeit bearbeiten' : 'Neue Tätigkeit'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tätigkeitsname
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="z.B. Staubsaugen, Wischen, Fenster putzen"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Beschreibung
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Optionale Beschreibung der Tätigkeit"
                rows={2}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Raum</label>
              <select
                value={formData.roomId}
                onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Raum auswählen</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Intervall
                </label>
                <select
                  value={formData.intervalType}
                  onChange={(e) =>
                    setFormData({ ...formData, intervalType: e.target.value as IntervalType })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {Object.entries(intervalLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {formData.intervalType === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Alle X Wochen
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="52"
                    value={formData.intervalWeeks}
                    onChange={(e) =>
                      setFormData({ ...formData, intervalWeeks: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              )}
            </div>

            {/* Tasks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aufgaben (optional)
              </label>
              <div className="space-y-2">
                {formData.tasks.map((task, index) => (
                  <div key={task.id} className="flex items-center space-x-2 bg-gray-50 p-2 rounded">
                    <span className="text-gray-500 font-mono text-sm">{index + 1}.</span>
                    <span className="flex-1">{task.description}</span>
                    <button
                      type="button"
                      onClick={() => removeTask(task.id)}
                      className="text-red-600 hover:bg-red-50 p-1 rounded transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addTask();
                      }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Neue Aufgabe hinzufügen"
                  />
                  <button
                    type="button"
                    onClick={addTask}
                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 pt-4">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingActivity ? 'Speichern' : 'Hinzufügen'}
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

      {/* Tätigkeiten nach Räumen gruppiert */}
      <div className="space-y-6">
        {rooms.map((room) => {
          const roomActivities = groupedActivities[room.id] || [];
          return (
            <div key={room.id}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                <ListTodo className="w-5 h-5 mr-2 text-blue-600" />
                {room.name}
              </h3>
              {roomActivities.length === 0 ? (
                <p className="text-gray-500 italic pl-7">Keine Tätigkeiten in diesem Raum</p>
              ) : (
                <div className="space-y-3 pl-7">
                  {roomActivities.map((activity) => (
                    <div
                      key={activity.id}
                      className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          {activity.description && (
                            <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          )}
                        </div>
                        <div className="flex space-x-1 ml-4">
                          <button
                            onClick={() => startEdit(activity)}
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Bearbeiten"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Tätigkeit "${activity.name}" wirklich löschen?`)) {
                                deleteActivity(activity.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Löschen"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          {intervalLabels[activity.intervalType]}
                          {activity.intervalType === 'custom' && ` (${activity.intervalWeeks} Wochen)`}
                        </span>
                        {activity.tasks.length > 0 && (
                          <span className="text-gray-500">{activity.tasks.length} Aufgaben</span>
                        )}
                      </div>
                      {activity.tasks.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-gray-600">
                          {activity.tasks.map((task, idx) => (
                            <li key={task.id} className="flex items-start">
                              <span className="mr-2">{idx + 1}.</span>
                              <span>{task.description}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Template-Auswahl-Dialog */}
      <ActivityTemplateSelector
        isOpen={showTemplateSelector}
        onClose={() => setShowTemplateSelector(false)}
        onSelect={handleTemplateSelect}
        availableRooms={rooms}
      />
    </div>
  );
}
