import { useMemo, useState } from 'react';
import { History as HistoryIcon, Calendar, CheckCircle, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatDateLong, getWeekDates } from '../utils/dateUtils';

export function History() {
  const { completionRecords, activities, rooms } = useApp();
  const [filterWeek, setFilterWeek] = useState<string>('');
  const [filterRoom, setFilterRoom] = useState<string>('');

  // Sortiere Records nach Datum (neueste zuerst)
  const sortedRecords = useMemo(() => {
    let filtered = [...completionRecords].sort(
      (a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    );

    if (filterWeek) {
      filtered = filtered.filter((r) => r.week === filterWeek);
    }

    if (filterRoom) {
      filtered = filtered.filter((r) => r.roomId === filterRoom);
    }

    return filtered;
  }, [completionRecords, filterWeek, filterRoom]);

  // Gruppiere nach Woche
  const groupedByWeek = useMemo(() => {
    const groups: Record<string, typeof completionRecords> = {};
    sortedRecords.forEach((record) => {
      if (!groups[record.week]) {
        groups[record.week] = [];
      }
      groups[record.week].push(record);
    });
    return groups;
  }, [sortedRecords]);

  // Alle Wochen für Filter
  const allWeeks = useMemo(() => {
    const weeks = new Set(completionRecords.map((r) => r.week));
    return Array.from(weeks).sort().reverse();
  }, [completionRecords]);

  // Statistiken
  const stats = useMemo(() => {
    const last30Days = completionRecords.filter((r) => {
      const completedDate = new Date(r.completedAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return completedDate >= thirtyDaysAgo;
    });

    const byRoom: Record<string, number> = {};
    completionRecords.forEach((r) => {
      byRoom[r.roomId] = (byRoom[r.roomId] || 0) + 1;
    });

    return {
      total: completionRecords.length,
      last30Days: last30Days.length,
      byRoom,
    };
  }, [completionRecords]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Erledigungshistorie</h2>
      </div>

      {/* Statistiken */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Gesamt erledigt</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <CheckCircle className="w-12 h-12 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Letzte 30 Tage</p>
              <p className="text-3xl font-bold text-green-600">{stats.last30Days}</p>
            </div>
            <Calendar className="w-12 h-12 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Verschiedene Wochen</p>
              <p className="text-3xl font-bold text-purple-600">{allWeeks.length}</p>
            </div>
            <HistoryIcon className="w-12 h-12 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-600" />
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Woche filtern
              </label>
              <select
                value={filterWeek}
                onChange={(e) => setFilterWeek(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Alle Wochen</option>
                {allWeeks.map((week) => (
                  <option key={week} value={week}>
                    KW {week.split('-W')[1]} / {week.split('-W')[0]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Raum filtern
              </label>
              <select
                value={filterRoom}
                onChange={(e) => setFilterRoom(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Alle Räume</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {(filterWeek || filterRoom) && (
            <button
              onClick={() => {
                setFilterWeek('');
                setFilterRoom('');
              }}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>

      {/* Historie */}
      {sortedRecords.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow border border-gray-200">
          <HistoryIcon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">
            {completionRecords.length === 0
              ? 'Noch keine erledigten Tätigkeiten'
              : 'Keine Einträge mit den gewählten Filtern'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByWeek).map(([week, records]) => {
            const weekDates = getWeekDates(week);
            return (
              <div key={week} className="bg-white p-6 rounded-lg shadow border border-gray-200">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  KW {week.split('-W')[1]} - {week.split('-W')[0]}
                  <span className="ml-2 text-sm font-normal text-gray-600">
                    ({formatDateLong(weekDates.start)} - {formatDateLong(weekDates.end)})
                  </span>
                </h3>
                <div className="space-y-2">
                  {records.map((record) => {
                    const activity = activities.find((a) => a.id === record.activityId);
                    const room = rooms.find((r) => r.id === record.roomId);
                    return (
                      <div
                        key={record.id}
                        className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {activity?.name || 'Gelöschte Tätigkeit'}
                          </p>
                          <p className="text-sm text-gray-600">{room?.name || 'Gelöschter Raum'}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                          {formatDateLong(new Date(record.completedAt))}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Raum-Statistiken */}
      {stats.total > 0 && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Tätigkeiten pro Raum</h3>
          <div className="space-y-2">
            {Object.entries(stats.byRoom)
              .sort((a, b) => b[1] - a[1])
              .map(([roomId, count]) => {
                const room = rooms.find((r) => r.id === roomId);
                return (
                  <div key={roomId} className="flex items-center justify-between">
                    <span className="text-gray-700">{room?.name || 'Gelöschter Raum'}</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-48 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(count / stats.total) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-12 text-right">
                        {count}x
                      </span>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
