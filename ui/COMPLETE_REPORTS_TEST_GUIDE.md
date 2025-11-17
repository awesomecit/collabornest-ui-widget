# Complete Reports Testing - Setup Guide

## Quick Start

### 1. Start JWT Mock Server (Port 3001)

```bash
cd ui
node jwt-mock-server.js
```

This server generates valid JWT tokens without requiring `crypto.subtle`.

### 2. Start HTTP Server (Port 8081)

```bash
cd ui
python3 -m http.server 8081
```

### 3. Open the Test Page

Open in your browser:
- **Recommended**: http://127.0.0.1:8081/complete-reports-test.html
- Alternative: http://localhost:8081/complete-reports-test.html

### 4. Start Backend WebSocket Server (Port 3000)

Make sure your NestJS backend is running:

```bash
npm run start:dev
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser (UI)                             │
│  http://127.0.0.1:8081/complete-reports-test.html          │
└────────┬─────────────────────────────────┬──────────────────┘
         │                                 │
         │ JWT Generation                  │ WebSocket
         │ POST /auth/generate-token       │ Socket.IO
         │                                 │
         ▼                                 ▼
┌─────────────────────┐      ┌────────────────────────────────┐
│  JWT Mock Server    │      │   NestJS Backend               │
│  Port 3001          │      │   Port 3000                    │
│  (Node.js)          │      │   /collaboration namespace     │
└─────────────────────┘      └────────────────────────────────┘
```

## Features

### 1. Multi-User Testing
- Generate random users with "Generate User" button
- Open multiple browser tabs with different users
- Test same user across tabs (copy/paste credentials)

### 2. Reports & Tabs
- 5 mock surgical reports (MR-2024-001 to MR-2024-005)
- 3 tabs per report:
  - 📝 Note Chirurgiche
  - 📋 Dati Paziente
  - 📄 Steps Procedura

### 3. Real-Time Collaboration
- **Viewer Mode**: Read-only access
- **Editor Mode**: Editing access
- Active users panel shows who's in current tab
- Report cards show presence indicators

### 4. Event Log
- Complete WebSocket event history
- Color-coded event types
- Detailed event data inspection

## Testing Scenarios

### Scenario 1: Single User Navigation
1. Connect as User1
2. Click on a report
3. Switch between tabs
4. Watch event log for resource join/leave events

### Scenario 2: Multi-User Same Tab
1. **Tab 1**: Connect as User1 → Open Report MR-2024-001 → Tab "Note Chirurgiche" → Mode: Editor
2. **Tab 2**: Connect as User2 → Open Report MR-2024-001 → Tab "Note Chirurgiche" → Mode: Viewer
3. Both users see each other in "Active Users" panel
4. Report card shows presence indicators

### Scenario 3: Multi-User Different Tabs
1. **Tab 1**: User1 → MR-2024-001 → "Note Chirurgiche"
2. **Tab 2**: User2 → MR-2024-001 → "Dati Paziente"
3. Each user sees only themselves in their tab
4. Report card shows both users (aggregated presence)

### Scenario 4: Mode Switching
1. Connect as User1
2. Open report and tab
3. Switch between Viewer/Editor modes
4. Watch event log for mode change events
5. Other users see the mode change in real-time

## Troubleshooting

### JWT Mock Server Not Running
**Error**: `[JWT] ⚠️ JWT mock server not available (port 3001)`

**Solution**: 
```bash
cd ui
node jwt-mock-server.js
```

### WebSocket Connection Failed
**Error**: `[WS] ❌ Connection error: ...`

**Check**:
1. NestJS backend running on port 3000?
   ```bash
   npm run start:dev
   ```
2. Backend WebSocket namespace: `/collaboration`
3. Backend Socket.IO path: `/ws/socket.io`

### Fallback JWT Warning
**Warning**: `[JWT] ⚠️ Using client-side fallback (NOT SECURE!)`

This means the JWT mock server is not running. The page will generate tokens client-side, but they may not be valid for the backend.

**Solution**: Always run `jwt-mock-server.js` before testing.

### CORS Issues
If you see CORS errors:
1. Use `127.0.0.1` instead of `localhost`
2. Check backend CORS configuration
3. Ensure all services allow `Access-Control-Allow-Origin: *`

## Console Logging

All WebSocket operations are logged with prefixes:

- `[JWT] 🔑` - JWT generation
- `[WS] 🔌` - Connection events
- `[WS] 📍` - Resource join
- `[WS] 🚪` - Resource leave
- `[WS] 👤` - User joined
- `[WS] 👋` - User left
- `[WS] ✅` - Success
- `[WS] ❌` - Error
- `[WS] ⚠️` - Warning

## Files

- `complete-reports-test.html` - Main test interface
- `jwt-mock-server.js` - JWT generation server (Node.js)
- `COMPLETE_REPORTS_TEST_GUIDE.md` - This file

## Security Notes

⚠️ **This is a testing interface only!**

- JWT secret is hardcoded (same as backend dev environment)
- Client-side JWT fallback is NOT SECURE
- CORS is wide open (`*`)
- No authentication/authorization checks

**Never use this setup in production!**

## Next Steps

After testing, you can:
1. Integrate JWT generation into your main backend
2. Add proper authentication flow
3. Implement resource locking (editor exclusivity)
4. Add real-time content sync
5. Implement conflict resolution UI

---

**Happy Testing!** 🚀
