import jsPDF from 'jspdf';
import type { WeeklyPlan } from '../types';

type Language = 'de' | 'ru';

const translations = {
  de: {
    title: 'Putzplan',
    week: 'Kalenderwoche',
    tasks: 'Zu erledigende Tätigkeiten:',
    room: 'Raum:',
    taskList: 'Aufgaben:',
    createdOn: 'Erstellt am',
    page: 'Seite',
    of: 'von',
  },
  ru: {
    title: 'План уборки',
    week: 'Неделя',
    tasks: 'Задачи для выполнения:',
    room: 'Помещение:',
    taskList: 'Задания:',
    createdOn: 'Создано',
    page: 'Страница',
    of: 'из',
  },
};

export function generatePDF(plan: WeeklyPlan, language: Language = 'de') {
  const t = translations[language];
  const doc = new jsPDF();

  // Titel
  doc.setFontSize(20);
  doc.text(t.title, 105, 20, { align: 'center' });

  // Wocheninformation
  doc.setFontSize(12);
  doc.text(`${t.week} ${plan.weekNumber.split('-W')[1]}`, 105, 30, { align: 'center' });
  doc.text(`${plan.startDate} - ${plan.endDate}`, 105, 37, { align: 'center' });

  // Linie
  doc.setLineWidth(0.5);
  doc.line(20, 42, 190, 42);

  let yPosition = 52;

  // Tätigkeiten
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(t.tasks, 20, yPosition);
  yPosition += 10;

  plan.activities.forEach((item, index) => {
    const { activity, room } = item;

    // Prüfe ob genug Platz auf der Seite ist
    const neededSpace = activity.tasks.length > 0 ? 20 + activity.tasks.length * 7 : 20;
    if (yPosition + neededSpace > 280) {
      doc.addPage();
      yPosition = 20;
    }

    // Checkbox
    doc.setFontSize(10);
    doc.rect(20, yPosition - 4, 5, 5);

    // Tätigkeitsname und Raum
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`${index + 1}. ${activity.name}`, 30, yPosition);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`${t.room} ${room.name}`, 30, yPosition + 6);
    doc.setTextColor(0, 0, 0);

    yPosition += 12;

    // Beschreibung
    if (activity.description) {
      doc.setFontSize(9);
      doc.setTextColor(80, 80, 80);
      const splitDescription = doc.splitTextToSize(activity.description, 160);
      doc.text(splitDescription, 30, yPosition);
      yPosition += splitDescription.length * 5;
      doc.setTextColor(0, 0, 0);
    }

    // Tasks
    if (activity.tasks.length > 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(`${t.taskList}`, 30, yPosition);
      yPosition += 5;

      activity.tasks.forEach((task) => {
        doc.setFont('helvetica', 'normal');
        // Kleine Checkbox für Tasks
        doc.rect(35, yPosition - 3, 3, 3);
        const splitTask = doc.splitTextToSize(task.description, 145);
        doc.text(splitTask, 42, yPosition);
        yPosition += splitTask.length * 5;
      });
    }

    yPosition += 8;
  });

  // Footer mit Datum
  const pageCount = doc.getNumberOfPages();
  const locale = language === 'ru' ? 'ru-RU' : 'de-DE';
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `${t.createdOn} ${new Date().toLocaleDateString(locale)} - ${t.page} ${i} ${t.of} ${pageCount}`,
      105,
      290,
      { align: 'center' }
    );
  }

  // PDF speichern
  const weekNum = plan.weekNumber.split('-W')[1];
  const year = plan.weekNumber.split('-W')[0];
  doc.save(`Putzplan_KW${weekNum}_${year}.pdf`);
}
