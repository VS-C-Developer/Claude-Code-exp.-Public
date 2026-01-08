// Hilfsfunktionen für Datums- und Wochen-Berechnungen

// Gibt die Wochennummer im Format "2024-W01" zurück
export function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
}

// Gibt die aktuelle Wochennummer zurück
export function getCurrentWeek(): string {
  return getWeekNumber(new Date());
}

// Gibt Start- und End-Datum einer Woche zurück
export function getWeekDates(weekString: string): { start: Date; end: Date } {
  const [year, week] = weekString.split('-W').map(Number);
  const simple = new Date(year, 0, 1 + (week - 1) * 7);
  const dow = simple.getDay();
  const ISOweekStart = simple;
  if (dow <= 4)
    ISOweekStart.setDate(simple.getDate() - simple.getDay() + 1);
  else
    ISOweekStart.setDate(simple.getDate() + 8 - simple.getDay());

  const start = new Date(ISOweekStart);
  const end = new Date(ISOweekStart);
  end.setDate(end.getDate() + 6);

  return { start, end };
}

// Formatiert ein Datum in deutschen Format
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Formatiert ein Datum für Anzeige (z.B. "Mo, 01.01.2024")
export function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

// Prüft ob eine Tätigkeit in dieser Woche fällig ist
export function isActivityDueThisWeek(
  lastCompletedWeek: string | null,
  intervalWeeks: number,
  currentWeek: string = getCurrentWeek()
): boolean {
  if (!lastCompletedWeek) return true; // Noch nie gemacht

  const [lastYear, lastWeekNum] = lastCompletedWeek.split('-W').map(Number);
  const [currentYear, currentWeekNum] = currentWeek.split('-W').map(Number);

  // Berechne Differenz in Wochen (vereinfacht)
  const weeksDiff = (currentYear - lastYear) * 52 + (currentWeekNum - lastWeekNum);

  return weeksDiff >= intervalWeeks;
}

// Konvertiert IntervalType zu Wochen-Anzahl
export function intervalTypeToWeeks(intervalType: string, customWeeks?: number): number {
  switch (intervalType) {
    case 'weekly':
      return 1;
    case 'biweekly':
      return 2;
    case 'monthly':
      return 4;
    case 'custom':
      return customWeeks || 1;
    default:
      return 1;
  }
}
