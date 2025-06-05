# Discord Clone Server

Ein Python Flask-Server mit WebSocket-Unterstützung für den Discord Clone.

## 🚀 Features

- **Real-time Messaging**: WebSocket-basierte Kommunikation
- **File Upload**: Bilder, Videos, Dokumente hochladen
- **Channel Management**: Multi-Channel Support
- **User Management**: Online-Status und Typing-Indikatoren
- **File Storage**: Automatische Thumbnail-Generierung für Bilder
- **Persistent Storage**: JSON-basierte Message-Speicherung

## 📦 Installation & Start

### Automatischer Start (Empfohlen):

```bash
# Windows
.\start.bat

# Linux/Mac oder manuell
python setup_and_run.py
```

### Manueller Start:

```bash
# 1. Dependencies installieren
pip install -r requirements.txt

# 2. Server starten
python app.py
```

## 🔧 Server Configuration

- **Port**: 5000
- **WebSocket**: Aktiviert mit CORS-Support
- **File Uploads**: Bis zu 10MB
- **Storage**: `data/` Ordner für alle Daten

## 📁 Projektstruktur

```
server/
├── app.py                 # Haupt-Server-Datei
├── requirements.txt       # Python Dependencies
├── setup_and_run.py      # Auto-Setup Script
├── start.bat             # Windows Batch-Datei
└── data/
    ├── channels/         # Channel-Nachrichten (JSON)
    └── uploads/          # Hochgeladene Dateien
```

## 🌐 API Endpoints

### HTTP Endpoints:
- `GET /api/health` - Server Status
- `GET /api/channels/{id}/messages` - Channel-Nachrichten abrufen
- `POST /api/upload` - Datei hochladen
- `GET /api/files/{filename}` - Datei herunterladen

### WebSocket Events:

#### Client → Server:
- `join_user` - User-Registrierung
- `join_channel` - Channel beitreten
- `leave_channel` - Channel verlassen
- `send_message` - Nachricht senden
- `typing_start` - Typing-Indikator starten
- `typing_stop` - Typing-Indikator stoppen

#### Server → Client:
- `connected` - Verbindung bestätigt
- `new_message` - Neue Nachricht empfangen
- `channel_messages` - Channel-Nachrichten geladen
- `user_connected` - User ist online
- `user_disconnected` - User ist offline
- `user_typing` - User tippt
- `online_users` - Liste online Users

## 🔒 Sicherheit

- File-Type Validierung
- File-Size Limits (10MB)
- Secure Filename Handling
- CORS-Protection
- Input Sanitization

## 🛠️ Entwicklung

### Dependencies:
- `flask` - Web Framework
- `flask-socketio` - WebSocket Support
- `flask-cors` - CORS Handling
- `pillow` - Image Processing
- `python-magic` - File Type Detection
- `eventlet` - Async Server

### Datenformat (Messages):
```json
{
  "id": "uuid",
  "user_id": "user_uuid", 
  "username": "string",
  "content": "string",
  "type": "text|file",
  "file": {...},
  "timestamp": "ISO_string",
  "channel_id": "channel_id"
}
```

## 🚨 Troubleshooting

### Port bereits in Verwendung:
```bash
# Windows: Port 5000 freigeben
netstat -ano | findstr :5000
taskkill /F /PID [PID_NUMBER]

# Linux/Mac
lsof -i :5000
kill [PID]
```

### Python Dependencies:
```bash
# Virtual Environment erstellen (empfohlen)
python -m venv discord_env
discord_env\Scripts\activate  # Windows
source discord_env/bin/activate  # Linux/Mac

# Dependencies installieren
pip install -r requirements.txt
```

### Logs anzeigen:
- Server-Logs werden in der Konsole angezeigt
- Debug-Modus ist standardmäßig aktiviert

## 📝 Hinweise

- Starte den Server BEFORE du den React-Client startest
- Server läuft auf `http://localhost:5000`
- WebSocket-Verbindungen werden automatisch erkannt
- Dateien werden lokal in `data/uploads/` gespeichert
- Nachrichten werden in `data/channels/` als JSON gespeichert
