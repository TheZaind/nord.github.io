# 🚀 Discord Clone - PythonAnywhere Deployment

## 📋 Was wurde angepasst:

### 1. **Server-URL Konfiguration**
- `src/config/config.js` - Automatische Erkennung von Development/Production
- WebSocket-Service nutzt jetzt `https://zaind.pythonanywhere.com`
- HTTP-Fallback für PythonAnywhere Free-Account

### 2. **Dual-Service Architektur**
- **WebSocket Service** (`src/services/websocket.js`) - Für Echtzeit-Chat
- **HTTP API Service** (`src/services/httpApi.js`) - Fallback für PythonAnywhere Free

### 3. **Smart Fallback Logic**
- Versucht zuerst WebSocket-Verbindung
- Fällt automatisch auf HTTP-Polling zurück
- Funktioniert sowohl lokal als auch auf PythonAnywhere

## 🔧 Deployment auf PythonAnywhere:

### **Schritt 1: Frontend (React) deployen**

1. **Build-Ordner hochladen:**
   ```bash
   # Die dist/ Ordner-Inhalte nach /home/Zaind/mysite/ kopieren
   ```

2. **Static Files konfigurieren:**
   - URL: `/`
   - Directory: `/home/Zaind/mysite`

### **Schritt 2: Backend (Python) läuft bereits**
- Server-Code ist in `/home/Zaind/discord-clone/server/app.py`
- WSGI-Datei ist konfiguriert: `/var/www/zaind_pythonanywhere_com_wsgi.py`

### **Schritt 3: Web-App reloaden**
- Klicke "Reload" in der PythonAnywhere Web-App Konfiguration

## 🌐 URLs:

- **Frontend:** https://zaind.pythonanywhere.com
- **API:** https://zaind.pythonanywhere.com/api/channels

## 🔍 Testing:

### **Lokal testen:**
```bash
# Frontend
npm run dev

# Backend
cd server
python app.py
```

### **Produktion testen:**
1. Öffne https://zaind.pythonanywhere.com
2. Prüfe Browser-Konsole auf Verbindungsstatus
3. Teste Chat-Funktionen

## 🛠️ Features:

### **Funktioniert mit PythonAnywhere Free:**
- ✅ HTTP-basierte Nachrichten
- ✅ File-Upload
- ✅ Persistente Speicherung
- ✅ Polling für neue Nachrichten (alle 2 Sekunden)

### **Funktioniert mit PythonAnywhere Paid:**
- ✅ Echtzeit WebSocket-Chat
- ✅ Typing-Indikatoren
- ✅ Sofortige Nachrichtenübertragung

## 🐛 Troubleshooting:

### **Frontend zeigt "Disconnected":**
- Prüfe Browser-Konsole auf Fehler
- Vergewissere dich, dass Backend läuft
- HTTP-Fallback sollte automatisch aktiviert werden

### **API-Fehler:**
- Prüfe `/var/www/zaind_pythonanywhere_com_wsgi.py`
- Prüfe Error-Logs in PythonAnywhere
- Stelle sicher, dass alle Python-Pakete installiert sind

### **File-Upload funktioniert nicht:**
- Prüfe Upload-Ordner Permissions: `/home/Zaind/discord-clone/server/data/uploads`
- Prüfe CORS-Konfiguration

## 📱 Browser-Unterstützung:
- ✅ Chrome, Firefox, Safari, Edge (moderne Versionen)
- ✅ Mobile Browser (iOS Safari, Chrome Mobile)

---

**🎉 Dein Discord-Clone ist jetzt production-ready!**
