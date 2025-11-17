# CollaborNest - Embedded Reports View

Vista embedded che simula l'applicazione reale con lista referti medici e navigazione tra tab con presenza WebSocket real-time.

## Features

- **Lista 5 Referti Medici** (mock data)
  - Card con: ID, paziente, procedura, data
  - Visual states: no users (grigio), viewers (blu), editors (verde), conflict (arancione)
  - Badge utenti attivi in tempo reale

- **Dettaglio Referto con Tab Navigation**
  - 3 tab per referto: Note Chirurgiche, Dati Paziente, Steps Procedura
  - Ogni tab è una risorsa WebSocket separata
  - Switch automatico join/leave quando cambi tab

- **Presenza Real-Time**
  - Cambio mode: Viewer/Editor per ogni tab
  - Lista utenti attivi per tab (con indicatore "You")
  - Broadcast eventi: user:joined, user:left
  - Contatore utenti nei tab header

## How to Use

### 1. Start Backend

```bash
cd ../backend  # Assuming backend in sibling directory
npm run start:dev
```

Backend deve essere su `http://localhost:3000/collaboration`

### 2. Open UI

```bash
# Option 1: Direct file open
open ui/embedded-reports-view.html

# Option 2: With HTTP server (recommended)
cd ui
python3 -m http.server 8080
# Open http://localhost:8080/embedded-reports-view.html
```

### 3. Test Scenarios

#### Scenario 1: Single User Navigation

1. Open page → Auto-connects to WebSocket
2. Click on "MR-2024-001 - Mario Bianchi"
3. View "Note Chirurgiche" tab (default: Viewer mode)
4. Click "Editor" button → Switch to editor mode
5. Click "Dati Paziente" tab → Automatic join new resource, leave previous
6. Click "Back to Reports" → Leave resource, show list

**Expected**: Smooth navigation, no errors, connection status always green

#### Scenario 2: Multi-User Same Report, Different Tabs

1. **Tab 1**: Open page, click MR-2024-001, stay on "Note Chirurgiche" (Editor)
2. **Tab 2**: Open same URL, click MR-2024-001, click "Dati Paziente" (Editor)

**Expected**:

- Tab 1: Shows 1 user in "Note Chirurgiche" (you)
- Tab 2: Shows 1 user in "Dati Paziente" (you)
- Report card shows 2 users total (both editors)

#### Scenario 3: Multi-User Same Tab (Conflict Detection)

1. **Tab 1**: Open page, click MR-2024-001, "Note Chirurgiche" (Editor)
2. **Tab 2**: Open same URL, click MR-2024-001, "Note Chirurgiche" (Editor)

**Expected**:

- Both tabs show 2 users in "Active Users" sidebar
- Report card has orange border (conflict: 2+ editors)
- Both users see each other in real-time

#### Scenario 4: User Leaves Tab

1. **Tab 1**: MR-2024-001 → "Note Chirurgiche" (Editor)
2. **Tab 2**: MR-2024-001 → "Note Chirurgiche" (Viewer)
3. **Tab 1**: Click "Back to Reports"

**Expected**:

- Tab 2: Active users count decreases to 1
- Tab 2: User from Tab 1 disappears from list
- Report card updates in real-time

## Architecture

### Mock Data Structure

```javascript
{
  id: 'MR-2024-001',
  patientName: 'Mario Bianchi',
  procedure: 'Appendicectomia',
  date: '16/11/2024',
  tabs: [
    { id: 'surgical-notes', name: 'Note Chirurgiche', icon: '📝' },
    { id: 'patient-data', name: 'Dati Paziente', icon: '📋' },
    { id: 'procedure-steps', name: 'Steps Procedura', icon: '📄' }
  ]
}
```

### WebSocket Resource IDs

Format: `{reportId}/{tabId}`

Examples:

- `MR-2024-001/surgical-notes`
- `MR-2024-001/patient-data`
- `MR-2024-002/surgical-notes`

### State Management

```javascript
{
  currentReport: Report | null,
  currentTab: string | null,
  userPresenceByResource: {
    'MR-2024-001/surgical-notes': [UserPresence],
    'MR-2024-001/patient-data': [UserPresence],
    ...
  }
}
```

### Automatic Join/Leave Logic

```
showReportDetail(reportId)
  └─ renderTabs()
       └─ showTab(firstTabId)
            └─ wsService.joinResource(resourceId, mode)

showTab(newTabId)
  └─ wsService.joinResource(newResourceId, mode)
       └─ [internally] leaveResource(oldResourceId) first

showReportsList()
  └─ wsService.leaveResource()
       └─ emit 'resource:leave'
```

## UI Components

### Header

- App title: "CollaborNest"
- User info: Avatar + Username + Connection status
- Connection indicator: Green (connected) / Red (disconnected)

### Reports List

- Grid layout (responsive: 3 columns → 1 column on mobile)
- Card states:
  - Default: White background, gray border
  - Has viewers: Blue background, blue border
  - Has editors: Green background, green border
  - Conflict (2+ editors): Orange background, orange border
- User badges: Mode indicator (✏️/👁️) + Username

### Report Detail

- Back button → Return to list
- Report header: Patient name, procedure, ID, date
- Tabs navigation: Horizontal tabs with user count badges
- Tab content:
  - Main area: Placeholder content (dashed border)
  - Sidebar: Mode selector + Active users list

### Active Users List

- User card per user:
  - Avatar (2-letter initials)
  - Username + "(You)" if current user
  - Mode indicator (✏️ Editor / 👁️ Viewer)
  - Border color: Purple (editor) / Blue (viewer)
  - Bold border: Current user

## Technical Details

### JWT Generation

Reused from `test-single-page.html`:

- Browser-safe HMAC-SHA256 using Web Crypto API
- Claims: sub, username, email, iss, aud, iat, exp
- Secret: Must match backend `.env` JWT_SECRET

### WebSocket Events

**Outgoing**:

- `resource:join` → { resourceId, mode }
- `resource:leave` → { resourceId }

**Incoming**:

- `connect` → Connection established
- `resource:joined` → { success, users, resourceId, ... }
- `user:joined` → { userId, username, mode, socketId, ... }
- `user:left` → { userId, username, reason }
- `disconnect` → Connection lost

### State Updates

1. **User joins tab** → `user:joined` event → Update `activeUsers` array → Re-render sidebar + update card badges
2. **User leaves tab** → `user:left` event → Filter out user → Re-render
3. **Change mode** → Leave + rejoin with new mode → `user:joined` broadcast to others
4. **Switch tab** → Leave old resourceId → Join new resourceId → Reset sidebar

## Troubleshooting

### "Disconnected" status

- Check backend is running on `http://localhost:3000`
- Check backend WebSocket namespace: `/collaboration`
- Check backend WebSocket path: `/ws/socket.io`
- Verify JWT secret matches backend `.env`

### Users not appearing in Active Users

- Open browser console (F12) → Check for `user:joined` events
- Verify both users joined SAME resourceId (reportId + tabId)
- Check backend logs: Should see "User joined resource" messages

### Card not updating with user badges

- Check `userPresenceByResource` state in console
- Verify `renderReportsList()` called after `onUsersChange` event
- Inspect `getUsersForReport()` logic: aggregates all tabs

### Tab count badge not showing

- Check `updateActiveUsers()` → Updates tab badges dynamically
- Verify `userPresenceByResource[resourceId]` has data
- Inspect DOM: Badge should have class `tab-users-count`

## Known Limitations

1. **Mock data only**: No REST API integration (GET /api/reports)
2. **No persistence**: Refresh page = lose all state
3. **No real content**: Tab content is placeholder only
4. **Single instance**: No Redis/RabbitMQ (lost presence on backend restart)
5. **No locking**: Backend allows 2+ editors (see BE-001.3 gap in UI_FEEDBACK_FOR_BACKEND.md)

## Next Steps (Production)

1. **Integrate REST API**: Replace `MOCK_REPORTS` with `fetch('/api/reports')`
2. **Add real content**: Load report sections from backend
3. **Implement locking**: Use BE-001.3 (lock:acquire, lock:denied events)
4. **Add Y.js CRDT**: Real-time collaborative editing (BE-001.4)
5. **Error handling**: Show toasts for connection errors
6. **Persistence**: Save user preferences (last viewed report, mode)

## Files

- `embedded-reports-view.html` - Single-page application (1100+ lines)
  - Lines 1-400: CSS styles (responsive, component states)
  - Lines 400-500: HTML structure (header, list view, detail view)
  - Lines 500-800: JWT generator + WebSocket service (reused from test)
  - Lines 800-1100: ReportsApp class (state management, rendering, events)

## Testing Checklist

- [ ] Backend running on port 3000
- [ ] Page loads without errors
- [ ] Auto-connects to WebSocket (green status)
- [ ] Lista referti shows 5 cards
- [ ] Click card → Shows detail with 3 tabs
- [ ] Click tab → Joins resource (check console)
- [ ] Switch Editor/Viewer → Mode changes (check Active Users)
- [ ] Open 2 tabs → Both see each other (same report/tab)
- [ ] Close tab → Other tab sees user leave
- [ ] Back to Reports → Leaves resource cleanly

---

**Ready to test!** Open `embedded-reports-view.html` with backend running.
