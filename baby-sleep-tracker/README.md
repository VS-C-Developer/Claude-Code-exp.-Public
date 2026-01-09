# 👶 Baby Schlaf Tracker

Eine umfassende Web-App zum Tracken von Babyschlaf, Fütterungen, Windeln und mehr - inspiriert von der beliebten Napper App.

## ✨ Features

### 📊 Dashboard
- **Tagesübersicht** mit allen wichtigen Statistiken
- **Gesamtschlafzeit** des Tages auf einen Blick
- **Aktuelle Wachzeit** seit dem letzten Schlaf
- **Fütterungs- und Windelzähler**
- **Intelligente Empfehlungen** für den nächsten Schlaf
- **Timeline** aller heutigen Aktivitäten

### 😴 Schlaf-Tracking
- **Ein-Tap Schlaf-Tracking** mit Live-Timer
- **Automatische Berechnung** der Schlafdauer
- **Wachzeiten-Tracking** zwischen Schläfchen
- **Altersbasierte Empfehlungen** für optimale Schlafzeiten

### 🍼 Fütterungs-Tracking
- **Stillen tracken** mit Seitenwahl (links/rechts/beide)
- **Flaschennahrung tracken** mit Mengenangabe
- **Dauer der Fütterung** erfassen
- **Notizen** zu jeder Fütterung

### 🧷 Windel-Tracking
- **Schnelles Tracking** für nasse Windeln
- **Stuhlgang dokumentieren**
- **Kombinierte Windelwechsel** (nass + Stuhlgang)
- **Tägliche Übersicht** aller Windelwechsel

### 🎵 Schlafgeräusche & White Noise
- **8 verschiedene Geräusche:**
  - ⚪ Weißes Rauschen
  - 🌸 Rosa Rauschen
  - 🟤 Braunes Rauschen
  - 🌧️ Regen
  - 🌊 Ozean Wellen
  - ❤️ Herzschlag
  - 🎼 Wiegenlied
  - 🌀 Ventilator

- **Lautstärkeregler**
- **Sleep Timer** (5-60 Minuten)
- **Hintergrund-Wiedergabe**

### 📅 Altersbasierter Schlafplan
- **Personalisierte Empfehlungen** basierend auf Babyalter
- **Beispiel-Tagesabläufe**
- **Schlaf-Tipps** für jede Altersgruppe
- **Empfohlene Wachzeiten**

### 📝 Zusätzliche Features
- **Notizen hinzufügen** für besondere Beobachtungen
- **Vergangene Aktivitäten** nachtragen
- **Mehrere Babys** verwalten
- **Offline-Funktionalität** mit Local Storage
- **Vollständig responsive** für alle Geräte

## 🚀 Installation & Verwendung

### Lokale Nutzung
1. Repository klonen oder Dateien herunterladen
2. `index.html` in einem modernen Browser öffnen
3. Fertig! Die App läuft komplett im Browser

### Hosting
Einfach alle Dateien auf einen Webserver hochladen:
- `index.html`
- `styles.css`
- `app.js`

Die App funktioniert auf jedem Webserver (GitHub Pages, Netlify, Vercel, etc.)

## 💻 Technologie

- **Vanilla JavaScript** - Keine Frameworks erforderlich
- **CSS3** - Modernes, responsives Design
- **Web Audio API** - Für hochwertige Schlafgeräusche
- **Local Storage** - Daten bleiben auch nach Browser-Neustart erhalten
- **Progressive Web App ready** - Kann als App installiert werden

## 📱 Browser-Kompatibilität

- ✅ Chrome/Edge (empfohlen)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile Browser (iOS & Android)

## 🎯 Verwendung

### Baby hinzufügen
1. Klicken Sie auf das **+** Symbol im Header
2. Name und Geburtsdatum eingeben
3. Speichern

### Schlaf tracken
1. Zur **Tracking**-Seite navigieren
2. **"Schlaf starten"** drücken wenn Baby einschläft
3. **"Schlaf beenden"** drücken wenn Baby aufwacht
4. Dauer wird automatisch berechnet

### White Noise abspielen
1. Zur **Geräusche**-Seite navigieren
2. Gewünschtes Geräusch auswählen
3. Optional: Lautstärke und Timer einstellen
4. Zum Stoppen erneut auf den Sound klicken

### Empfehlungen nutzen
1. Babyalter im **Schlafplan** eintragen
2. Dashboard zeigt optimale Schlafzeit
3. Empfehlungen basieren auf wissenschaftlichen Standards

## 🔒 Datenschutz

- **100% Offline** - Alle Daten bleiben lokal auf Ihrem Gerät
- **Keine Server** - Keine Datenübertragung
- **Keine Cookies** - Nur Local Storage
- **Open Source** - Code kann eingesehen werden

## 🎨 Features im Detail

### Intelligente Empfehlungen
Die App berechnet basierend auf:
- Alter des Babys
- Letzter Schlafzeit
- Durchschnittlicher Wachzeit
- Wissenschaftlichen Schlafempfehlungen

### Altersbasierte Richtlinien
- **0-3 Monate**: 14-17 Stunden Schlaf, 45-60 Min Wachzeit
- **4-6 Monate**: 12-15 Stunden Schlaf, 1,5-2 Std Wachzeit
- **7-9 Monate**: 12-14 Stunden Schlaf, 2-3 Std Wachzeit
- **10+ Monate**: 11-14 Stunden Schlaf, 3-4 Std Wachzeit

## 🛠️ Anpassung

Die App kann einfach angepasst werden:
- **Farben**: In `styles.css` unter `:root` CSS-Variablen ändern
- **Geräusche**: Neue Sounds in `app.js` unter `configureSoundType` hinzufügen
- **Empfehlungen**: Schedule-Daten in `getScheduleRecommendations` anpassen

## 📄 Lizenz

MIT License - Frei verwendbar für private und kommerzielle Zwecke

## 🙏 Credits

Inspiriert von der Napper App und anderen beliebten Baby-Tracking-Apps.

## 📧 Support

Bei Fragen oder Problemen bitte ein Issue erstellen.

---

**Viel Erfolg beim Tracken! 👶💤**
