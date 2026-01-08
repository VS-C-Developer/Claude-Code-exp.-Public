# 🧹 Putzplan Manager

Eine moderne Web-Anwendung zur Verwaltung und Planung von Reinigungsarbeiten.

## 📋 Funktionen

- **🏠 Raumverwaltung**: Organisieren Sie Räume über 3 Etagen (Erdgeschoss, 1. Etage, 2. Etage)
- **🧼 Tätigkeitsverwaltung**: Erstellen Sie Tätigkeiten mit flexiblen Beschreibungen und Unter-Aufgaben
- **⏰ Flexible Intervalle**: Wöchentlich, alle 2 Wochen, monatlich oder benutzerdefiniert (z.B. alle 6 Wochen)
- **📅 Wochenplan**: Übersichtliche Darstellung aller fälligen Tätigkeiten
- **✅ Erledigungsverfolgung**: Markieren Sie Tätigkeiten als erledigt und behalten Sie den Überblick
- **📊 Historie**: Vollständige Verlaufsansicht mit Statistiken
- **📄 PDF-Export**: Erstellen Sie professionelle Putzpläne für Ihre Putzfrau

## 🚀 Installation & Start

### Voraussetzungen
- Node.js (Version 18 oder höher)
- npm oder yarn

### Projekt starten

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Entwicklungsserver starten:**
   ```bash
   npm run dev
   ```
   Die App läuft dann unter `http://localhost:5173`

3. **Für Production bauen:**
   ```bash
   npm run build
   ```
   Die fertigen Dateien befinden sich im `dist` Ordner.

4. **Production-Build lokal testen:**
   ```bash
   npm run preview
   ```

## 🌐 Deployment

### Option 1: Vercel (Empfohlen)

1. Erstellen Sie einen Account auf [vercel.com](https://vercel.com)
2. Klicken Sie auf "New Project"
3. Importieren Sie Ihr Git-Repository
4. Vercel erkennt automatisch Vite und konfiguriert alles
5. Klicken Sie auf "Deploy"

### Option 2: Netlify

1. Build erstellen: `npm run build`
2. Auf [netlify.com](https://netlify.com) einloggen
3. Den `dist` Ordner per Drag & Drop hochladen

### Option 3: GitHub Pages

1. Fügen Sie in `vite.config.ts` die base URL hinzu:
   ```typescript
   export default defineConfig({
     base: '/ihr-repo-name/',
     // ...
   })
   ```
2. Build erstellen und auf GitHub Pages deployen

## 💡 Verwendung

### 1. Räume anlegen

- Navigieren Sie zu "Räume"
- Klicken Sie auf "Raum hinzufügen"
- Geben Sie Name und Etage ein
- Beispiele: Badezimmer, Küche, Wohnzimmer, Schlafzimmer

### 2. Tätigkeiten erstellen

- Gehen Sie zu "Tätigkeiten"
- Klicken Sie auf "Tätigkeit hinzufügen"
- Füllen Sie die Details aus:
  - Name (z.B. "Staubsaugen")
  - Beschreibung (optional)
  - Raum auswählen
  - Intervall festlegen (wöchentlich, alle 2 Wochen, etc.)
  - Optional: Aufgaben hinzufügen (z.B. "Unter dem Bett saugen", "Teppich ausklopfen")

### 3. Wochenplan erstellen

- Wechseln Sie zu "Wochenplan"
- Sehen Sie alle fälligen Tätigkeiten für die aktuelle Woche
- Wählen Sie die Tätigkeiten aus, die erledigt werden sollen
- Klicken Sie auf "PDF erstellen"
- Das PDF wird automatisch heruntergeladen

### 4. Tätigkeiten als erledigt markieren

- Im Wochenplan können Sie Tätigkeiten mit "Erledigt" markieren
- Die App merkt sich, wann was erledigt wurde
- Basierend darauf werden zukünftige fällige Tätigkeiten berechnet

### 5. Historie einsehen

- Unter "Historie" sehen Sie alle erledigten Tätigkeiten
- Mit Statistiken und Filteroptionen
- Sehen Sie, welche Räume wie oft gereinigt wurden

## 🗂️ Datenstruktur

Die App speichert alle Daten lokal im Browser (LocalStorage). Die Daten bleiben erhalten, auch wenn Sie den Browser schließen.

### Datensicherung

Die Daten werden automatisch im Browser gespeichert. Für manuelle Backups:
- Browser-Entwicklertools öffnen (F12)
- Console öffnen
- Eingeben: `localStorage.getItem('putzplan-app-state')`
- Den Inhalt kopieren und speichern

### Daten importieren

Um Daten auf einem anderen Gerät zu importieren:
```javascript
// In der Browser-Console
localStorage.setItem('putzplan-app-state', 'IHRE_GESPEICHERTEN_DATEN')
// Seite neu laden
location.reload()
```

## 🛠️ Technologie-Stack

- **React 18** - UI Framework
- **TypeScript** - Type-Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **jsPDF** - PDF-Generierung
- **Lucide React** - Icons
- **LocalStorage** - Datenspeicherung

## 📱 Browser-Kompatibilität

- Chrome/Edge (empfohlen)
- Firefox
- Safari
- Jeder moderne Browser mit LocalStorage-Unterstützung

## 🤝 Mitwirken

Feedback und Verbesserungsvorschläge sind willkommen!

## 📄 Lizenz

Dieses Projekt steht zur freien Verfügung.
