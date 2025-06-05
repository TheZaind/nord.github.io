# Discord Clone

Ein funktionaler Discord-Clone entwickelt mit React und Vite, der die wichtigsten Chat-Features eines modernen Messaging-Systems bietet.

## 🚀 Features

- **Channel-basiertes Chat-System**: Verschiedene Channels zum Organisieren von Gesprächen
- **Datei-Upload**: Unterstützung für Bilder, Dokumente und andere Dateitypen
- **Lokaler Speicher**: Nachrichten werden lokal gespeichert und bleiben nach Neuladen erhalten
- **Discord-ähnliches Design**: Authentisches Look-and-Feel mit dunklem Theme
- **Responsive Design**: Funktioniert auf Desktop und mobilen Geräten
- **Auto-Scroll**: Automatisches Scrollen zu neuen Nachrichten
- **File-Validation**: Sichere Datei-Uploads mit Größen- und Typ-Validierung

## 🛠️ Technologie-Stack

- **Frontend**: React 19, Vite
- **Styling**: Pure CSS (Discord-inspiriert)
- **File Handling**: Lokale File-Upload Funktionalität
- **Daten**: localStorage für persistente Speicherung
- **Icons**: Unicode-Emojis für bessere Kompatibilität

## 📦 Installation

```bash
# Repository klonen
git clone <your-repo-url>
cd nord

# Dependencies installieren
npm install

# Development Server starten
npm run dev
```

## 🎯 Verwendung

1. **Channel auswählen**: Klicke auf einen Channel in der Sidebar
2. **Nachrichten senden**: Schreibe eine Nachricht und drücke Enter oder klicke "Send"
3. **Dateien hochladen**: Klicke auf das 📎 Symbol um Dateien anzuhängen
4. **Channel wechseln**: Alle Nachrichten werden automatisch pro Channel gespeichert

## 🏗️ Projektstruktur

```
src/
├── components/
│   ├── chat/
│   │   ├── ChatComponent.jsx    # Haupt-Chat-Interface
│   │   └── ChatArea.jsx         # Chat-Bereich (optional)
│   ├── layout/
│   │   ├── Sidebar.jsx          # Channel-Navigation
│   │   └── SidebarComponent.jsx # Sidebar-Implementation
│   └── common/
│       ├── Avatar.jsx           # User-Avatar Komponente
│       ├── Button.jsx           # Wiederverwendbare Button-Komponente
│       └── Modal.jsx            # Modal-Dialog Komponente
├── context/
│   ├── UserContext.jsx          # User-State Management
│   ├── ChannelContext.jsx       # Channel-State Management
│   └── MessageContext.jsx       # Message-State Management
├── utils/
│   ├── user.js                  # User-Utility-Funktionen
│   ├── formatDate.js            # Datum-Formatierung
│   ├── fileValidation.js        # Datei-Validierung
│   └── constants.js             # App-Konstanten
└── styles/
    ├── index.css                # Haupt-Styling
    └── App.css                  # App-spezifische Styles
```

## 🎨 Features im Detail

### Chat-System
- Multi-Channel Support mit automatischer Speicherung
- Echtzeit-ähnliche UI mit sofortiger Nachrichtenanzeige
- Automatisches Scrollen zu neuen Nachrichten

### File-Upload
- Unterstützte Dateitypen: Bilder, Videos, Audio, PDFs, Dokumente
- Maximale Dateigröße: 10MB
- Vorschau für Bilddateien
- Validierung und Fehlerbehandlung

### Design
- Discord-inspirierte Farbpalette und Layout
- Hover-Effekte und Animationen
- Responsive Design für verschiedene Bildschirmgrößen
- Dunkles Theme für bessere User Experience

## 🔧 Verfügbare Scripts

```bash
npm run dev      # Development Server starten
npm run build    # Production Build erstellen
npm run preview  # Production Build lokal testen
npm run lint     # Code-Qualität prüfen
```

## 🚧 Zukünftige Features

- [ ] Voice/Video Chat Integration
- [ ] User-Authentifizierung
- [ ] Real-time Messaging mit WebSockets
- [ ] Emoji-Reaktionen
- [ ] Nachricht-Threading
- [ ] Server/Guild-System
- [ ] User-Status und Präsenz
- [ ] Push-Benachrichtigungen

## 📝 Entwicklungsnotizen

Das Projekt wurde ohne externe UI-Bibliotheken entwickelt, um die volle Kontrolle über das Design zu behalten und die Bundle-Größe zu minimieren. Alle Styles sind in reinem CSS geschrieben und orientieren sich am Original-Discord-Design.

Die lokale Speicherung ermöglicht eine vollständig offline-funktionale Demo ohne Backend-Abhängigkeiten.

## 🤝 Beitragen

Verbesserungen und Bugfixes sind willkommen! Erstelle einfach einen Pull Request oder öffne ein Issue für Diskussionen.

## 📄 Lizenz

Dieses Projekt ist für Lern- und Demonstrationszwecke entwickelt worden.+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
