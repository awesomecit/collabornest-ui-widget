# CollaborNest UI - WebSocket Testing Interface (MVP)

## 🚀 Quick Start (15 seconds)

### Prerequisites
- Backend WebSocket server running on `http://localhost:3000`

### Open the UI
```bash
# Option 1: Open directly in browser
open ui/test-single-page.html
# or
xdg-open ui/test-single-page.html  # Linux
# or
start ui/test-single-page.html     # Windows

# Option 2: Use Python HTTP server (recommended for CORS)
cd ui/
python3 -m http.server 8080
# Then open: http://localhost:8080/test-single-page.html
```

---

## ✅ Test Scenario 1: Single User Connection

1. Click **"Generate JWT"** → JWT appears in textarea
2. Click **"Connect to WebSocket"** → Status changes to 🟢 Connected
3. Enter resource ID: `document:123`
4. Select mode: **Editor**
5. Click **"Join as Editor"**
6. ✅ Current Resource displays: "document:123 (editor mode)"
7. ✅ Active Users shows: Your username with EDITOR badge
8. ✅ Event Log shows: RESOURCE_JOINED event

**Expected**: Connection successful, joined resource, see yourself in Active Users panel.

---

## 👥 Test Scenario 2: Multi-User Presence (Requires 2 Browser Tabs)

### Tab 1 (User A)
1. Generate JWT → Connect → Join `document:123` as **Editor**
2. Active Users: Shows "User A (You) - EDITOR"

### Tab 2 (User B)
1. Generate JWT → Connect → Join `document:123` as **Viewer**
2. Active Users: Shows "User A - EDITOR" and "User B (You) - VIEWER"

### Verification
- ✅ Tab 1 Active Users should show 2 users: User A (You) + User B
- ✅ Tab 2 Active Users should show 2 users: User A + User B (You)
- ✅ Both Event Logs show `USER_JOINED` events
- ✅ Tab 1 should see: `[HH:mm:ss] USER_JOINED | User B (viewer)`

### Leave Test
- Tab 1: Click "Leave Resource"
- Tab 2: Active Users should update → Only User B remains
- Tab 2 Event Log: `[HH:mm:ss] USER_LEFT | User A (reason: explicit)`

**Expected**: Real-time presence tracking works, users see each other, leave notifications broadcast.

---

## 🐛 Test Scenario 3: Error Handling

### Test Expired JWT
1. Generate JWT
2. Open Browser DevTools → Console
3. Decode JWT: `JSON.parse(atob(jwtToken.split('.')[1]))`
4. Manually change `exp` to past timestamp: `1234567890`
5. Try to connect
6. ✅ Should see: `connect_error` in event log
7. ✅ Alert: "Connection failed: JWT validation failed: jwt expired"

### Test Duplicate Join
1. Connect → Join `document:123` as editor
2. Try to join `document:123` again
3. ✅ Should see: `RESOURCE_JOINED | success: false, message: "already joined"`
4. ✅ Alert: "Join failed: User already in this resource"

---

## 🔧 Configuration

### Backend URL
If backend is not on `localhost:3000`, edit line 580 in `test-single-page.html`:

```javascript
this.socket = io('http://YOUR_BACKEND_URL:3000/collaboration', {
```

### JWT Secret
If backend uses different JWT secret, edit line 281:

```javascript
const JWT_SECRET = 'your_actual_backend_secret_here';
```

**Find backend secret**: Check backend `.env` file → `JWT_SECRET=...`

---

## 📊 Features Implemented

✅ **Connection Panel**
- Generate JWT with mock user credentials
- Connect/Disconnect to WebSocket
- Status indicator (Connected/Disconnected/Error)
- Socket ID display

✅ **Resource Control**
- Join resource as Editor or Viewer
- Leave resource
- Current resource display

✅ **Active Users Panel**
- Real-time user list
- Mode badges (EDITOR/VIEWER)
- "You" indicator
- User count

✅ **Event Log**
- Color-coded event types
- Auto-scroll (newest first)
- JSON payload display
- Clear log button
- Max 100 entries

✅ **WebSocket Events**
- `connect` / `connect_error` / `disconnect`
- `resource:joined` / `resource:left`
- `user:joined` / `user:left`
- `SERVER_SHUTDOWN`

---

## 🎯 Backend API Verification

This MVP validates these backend BDD test scenarios:

- ✅ Scenario 1: Valid JWT Authentication
- ✅ Scenario 5: Join Resource as Editor
- ✅ Scenario 6: Join Resource as Viewer
- ✅ Scenario 8: Multi-User Collaboration
- ✅ Scenario 9: User Leave Broadcast
- ✅ Scenario 10: Disconnect Cleanup
- ✅ Scenario 11: Duplicate Join Attempt

**Total**: 7/13 backend BDD scenarios manually testable

---

## 🐛 Troubleshooting

### "Connection Failed" Error

**Check backend is running**:
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok"}
```

**Restart backend**:
```bash
cd backend/
npm run start:dev
```

### JWT Token Invalid

**Verify JWT secret matches backend**:
1. Check backend `.env`: `JWT_SECRET=...`
2. Update `test-single-page.html` line 281 with same secret
3. Refresh page and generate new JWT

### Active Users Not Updating

**Debug steps**:
1. Open DevTools → Network → WS tab
2. Verify WebSocket connection is active (green dot)
3. Filter for `user:joined` or `user:left` frames
4. Check Event Log for corresponding events
5. If events received but UI not updating → Browser console for JS errors

### Event Log Not Scrolling

**Auto-scroll is newest-first** (top of log)
- New events appear at top
- Scroll manually to see older events
- Click "Clear" to reset log

---

## 🔜 Next Steps

After validating backend API:

1. ✅ All tests pass → Backend API confirmed working
2. 🏗️ Refactor to LitElement components (modular architecture)
3. 📦 Add Vite build setup for production
4. 🎨 Add dark mode toggle
5. 📊 Add export event log to JSON
6. 🧪 Add automated E2E tests (Playwright)

---

## 📚 Related Documentation

- **Backend API**: `../backend/docs/UI_TEAM_WEBSOCKET_API.md`
- **BDD Tests**: `../backend/scripts/bdd-tests/`
- **Design Spec**: `../DESIGN_BRIEF.md`
- **Project Blueprint**: `../UI_PROJECT_BLUEPRINT.md`

---

**Status**: ✅ MVP Ready for Testing  
**Created**: November 16, 2025  
**Time to Test**: ~5 minutes  
**Backend Coverage**: 7/13 BDD scenarios
