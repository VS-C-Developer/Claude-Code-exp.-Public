import { useState, useMemo } from 'react';
import { Calendar, Download, CheckCircle, Circle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getCurrentWeek, getWeekDates, formatDate, isActivityDueThisWeek, intervalTypeToWeeks } from '../utils/dateUtils';
import type { CompletionRecord } from '../types';
import { generatePDF } from '../utils/pdfGenerator';

export function WeeklyPlan() {
  const { activities, rooms, completionRecords, addCompletionRecord } = useApp();
  const [selectedWeek, setSelectedWeek] = useState(getCurrentWeek());
  const [selectedActivities, setSelectedActivities] = useState<Set<string>>(new Set());
  const [pdfLanguage, setPdfLanguage] = useState<'de' | 'ru'>('de');

  const weekDates = getWeekDates(selectedWeek);

  // Finde alle fälligen Tätigkeiten
  const dueActivities = useMemo(() => {
    return activities.filter((activity) => {
      // Finde letzten Completion Record für diese Tätigkeit
      const lastCompletion = completionRecords
        .filter((r) => r.activityId === activity.id)
        .sort((a, b) => b.completedAt.localeCompare(a.completedAt))[0];

      const intervalWeeks = intervalTypeToWeeks(activity.intervalType, activity.intervalWeeks);
      return isActivityDueThisWeek(
        lastCompletion?.week || null,
        intervalWeeks,
        selectedWeek
      );
    });
  }, [activities, completionRecords, selectedWeek]);

  // Prüfe ob Tätigkeit bereits erledigt wurde diese Woche
  const isCompletedThisWeek = (activityId: string): boolean => {
    return completionRecords.some(
      (r) => r.activityId === activityId && r.week === selectedWeek
    );
  };

  const toggleActivity = (activityId: string) => {
    const newSelected = new Set(selectedActivities);
    if (newSelected.has(activityId)) {
      newSelected.delete(activityId);
    } else {
      newSelected.add(activityId);
    }
    setSelectedActivities(newSelected);
  };

  const markAsCompleted = (activityId: string) => {
    const activity = activities.find((a) => a.id === activityId);
    if (!activity) return;

    const record: CompletionRecord = {
      id: Date.now().toString(),
      activityId: activity.id,
      roomId: activity.roomId,
      completedAt: new Date().toISOString(),
      week: selectedWeek,
    };

    addCompletionRecord(record);
  };

  const handleGeneratePDF = () => {
    const selectedActivityList = activities
      .filter((a) => selectedActivities.has(a.id))
      .map((activity) => {
        const room = rooms.find((r) => r.id === activity.roomId);
        return { activity, room: room! };
      });

    if (selectedActivityList.length === 0) {
      alert('Bitte wählen Sie mindestens eine Tätigkeit aus.');
      return;
    }

    generatePDF({
      weekNumber: selectedWeek,
      startDate: formatDate(weekDates.start),
      endDate: formatDate(weekDates.end),
      activities: selectedActivityList,
    }, pdfLanguage);
  };

  const changeWeek = (offset: number) => {
    const [year, weekNum] = selectedWeek.split('-W').map(Number);
    const newWeekNum = weekNum + offset;
    // Vereinfachte Wochenberechnung
    if (newWeekNum < 1) {
      setSelectedWeek(`${year - 1}-W52`);
    } else if (newWeekNum > 52) {
      setSelectedWeek(`${year + 1}-W01`);
    } else {
      setSelectedWeek(`${year}-W${newWeekNum.toString().padStart(2, '0')}`);
    }
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(getCurrentWeek());
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Wochenplan</h2>
        <div className="flex items-center space-x-3">
          <select
            value={pdfLanguage}
            onChange={(e) => setPdfLanguage(e.target.value as 'de' | 'ru')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
          >
            <option value="de">🇩🇪 Deutsch</option>
            <option value="ru">🇷🇺 Русский</option>
          </select>
          <button
            onClick={handleGeneratePDF}
            disabled={selectedActivities.size === 0}
            className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5" />
            <span>PDF erstellen</span>
          </button>
        </div>
      </div>

      {/* Wochenauswahl */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Kalenderwoche {selectedWeek.split('-W')[1]}</h3>
              <p className="text-sm text-gray-600">
                {formatDate(weekDates.start)} - {formatDate(weekDates.end)}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => changeWeek(-1)}
              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              ← Vorherige
            </button>
            {selectedWeek !== getCurrentWeek() && (
              <button
                onClick={goToCurrentWeek}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Aktuelle Woche
              </button>
            )}
            <button
              onClick={() => changeWeek(1)}
              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Nächste →
            </button>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-blue-800">
          ℹ️ Wählen Sie die Tätigkeiten aus, die in dieser Woche erledigt werden sollen, und erstellen Sie ein PDF für Ihre Putzfrau.
        </p>
      </div>

      {/* Fällige Tätigkeiten */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Fällige Tätigkeiten ({dueActivities.length})
        </h3>
        {dueActivities.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
            <CheckCircle className="w-16 h-16 mx-auto text-green-500 mb-4" />
            <p className="text-gray-600">Keine fälligen Tätigkeiten für diese Woche</p>
          </div>
        ) : (
          <div className="space-y-3">
            {dueActivities.map((activity) => {
              const room = rooms.find((r) => r.id === activity.roomId);
              const isCompleted = isCompletedThisWeek(activity.id);
              const isSelected = selectedActivities.has(activity.id);

              return (
                <div
                  key={activity.id}
                  className={`bg-white p-4 rounded-lg shadow border-2 transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : isCompleted
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <button
                      onClick={() => !isCompleted && toggleActivity(activity.id)}
                      className={`mt-1 ${isCompleted ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      disabled={isCompleted}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isSelected ? (
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </button>

                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900">{activity.name}</h4>
                          <p className="text-sm text-gray-600">{room?.name}</p>
                          {activity.description && (
                            <p className="text-sm text-gray-500 mt-1">{activity.description}</p>
                          )}
                        </div>
                        {!isCompleted && (
                          <button
                            onClick={() => {
                              if (confirm('Als erledigt markieren?')) {
                                markAsCompleted(activity.id);
                              }
                            }}
                            className="ml-4 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                          >
                            Erledigt
                          </button>
                        )}
                        {isCompleted && (
                          <span className="ml-4 px-3 py-1 bg-green-100 text-green-800 text-sm rounded">
                            ✓ Erledigt
                          </span>
                        )}
                      </div>

                      {activity.tasks.length > 0 && (
                        <ul className="mt-3 space-y-1 text-sm text-gray-600 pl-4">
                          {activity.tasks.map((task, idx) => (
                            <li key={task.id} className="flex items-start">
                              <span className="mr-2">{idx + 1}.</span>
                              <span>{task.description}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Ausgewählte Tätigkeiten Info */}
      {selectedActivities.size > 0 && (
        <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
          <p className="text-gray-700">
            <strong>{selectedActivities.size}</strong> Tätigkeit(en) für PDF ausgewählt
          </p>
        </div>
      )}
    </div>
  );
}
