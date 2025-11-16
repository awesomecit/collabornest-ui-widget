# Design Brief: CollaborNest UI Widget - Real-Time Collaboration Testing Interface

**Project**: CollaborNest UI Widget - WebSocket Testing Interface  
**Date**: November 16, 2025  
**Purpose**: Create a testing UI to validate WebSocket real-time collaboration features  
**Backend Status**: ✅ BE-001.1 + BE-001.2 Complete (13/13 BDD tests PASS)

---

## 🎯 Project Context

### What is CollaborNest?
A **Web Component-based microfrontend** for real-time collaboration in healthcare surgical documentation systems. Built with:
- **LitElement** (Web Components)
- **Socket.IO** (WebSocket client)
- **Y.js** (CRDT for offline-first editing)
- **IndexedDB** (offline persistence)

### Current Status
- ✅ **Backend WebSocket Gateway**: Fully operational
  - Connection management with JWT authentication
  - Real-time presence tracking (who's viewing/editing)
  - Multi-user broadcast notifications
  - Graceful disconnection handling
- ⏳ **Frontend UI Widget**: Not yet started (this is what we're designing)

### What Needs to be Built
A **testing interface** that allows developers to:
1. Connect to WebSocket server with JWT token
2. Join/leave resources (documents, pages, forms)
3. See real-time presence of other users
4. Monitor WebSocket events live
5. Test multi-user scenarios (2+ users in same resource)

---

## 🔌 WebSocket API Summary

### Connection
```typescript
const socket = io('http://localhost:3000/collaboration', {
  path: '/ws/socket.io',
  auth: { token: JWT_TOKEN },
  transports: ['websocket', 'polling']
});
```

### Key Events

#### Outgoing (Client → Server)
- `resource:join` - Join a document/page/form as editor or viewer
- `resource:leave` - Leave a resource

#### Incoming (Server → Client)
- `connect` - Connection successful
- `connect_error` - Authentication failed (invalid/expired JWT)
- `disconnect` - Connection lost
- `resource:joined` - Confirmation after joining (includes user list)
- `resource:left` - Confirmation after leaving
- `user:joined` - Broadcast when another user joins same resource
- `user:left` - Broadcast when another user leaves
- `SERVER_SHUTDOWN` - Server maintenance notification

### Data Structures

**Join Resource Payload**
```typescript
{
  resourceId: string,      // "document:123" | "page:/patient/456" | "form:789"
  mode: 'editor' | 'viewer'
}
```

**User Presence Object**
```typescript
{
  userId: string,
  username: string,
  email: string,
  socketId: string,
  joinedAt: string,        // ISO 8601 timestamp
  mode: 'editor' | 'viewer'
}
```

**Resource Joined Response**
```typescript
{
  success: boolean,
  resourceId: string,
  userId: string,
  joinedAt: string,
  users: UserPresence[],   // All users currently in resource
  message?: string         // Error message if success=false
}
```

---

## 🎨 UI Requirements

### 1. Connection Panel (Top Section)
**Purpose**: Establish WebSocket connection

**Elements**:
- ✅ Connection status indicator (Connected/Disconnected/Connecting)
- 🔌 WebSocket URL input (default: `ws://localhost:3000/collaboration`)
- 🔑 JWT Token input (textarea, can paste multi-line tokens)
- 🔘 Connect/Disconnect button
- 📊 Connection metadata display:
  - Socket ID
  - Connected at timestamp
  - Ping latency (if available)

**States**:
- **Disconnected** (gray/neutral): Ready to connect
- **Connecting** (yellow/orange): Shows spinner
- **Connected** (green): Shows socket ID and timestamp
- **Error** (red): Shows error message (e.g., "JWT expired")

**Design Notes**:
- Make JWT input collapsible/hideable (security consideration)
- Include "Copy JWT from example" button with sample valid token
- Show last connection error in prominent red alert

---

### 2. Resource Control Panel (Middle Left)
**Purpose**: Join/leave resources and select mode

**Elements**:
- 📝 Resource ID input (text field)
  - Placeholder: `document:123` or `page:/patient/456`
- 🎚️ Mode selector (radio buttons or toggle):
  - `editor` (write access)
  - `viewer` (read-only)
- ✅ Join Resource button
- ❌ Leave Resource button
- 📋 Current resource display:
  - Resource ID you're in
  - Your mode (editor/viewer)
  - Joined at timestamp

**Quick Actions**:
- Pre-filled resource ID suggestions:
  - `document:test-001`
  - `page:/patient/surgical-001`
  - `form:operation-report-123`

**Design Notes**:
- Disable "Join" when not connected
- Disable "Leave" when not in any resource
- Highlight current resource in accent color

---

### 3. Active Users Panel (Middle Right)
**Purpose**: Show who else is in the current resource

**Elements**:
- 📊 User count badge (e.g., "3 users active")
- 👥 User list (cards or badges):
  - Avatar (generated from email via ui-avatars.com)
  - Username
  - Mode indicator (✏️ editor | 👁️ viewer)
  - Joined timestamp (relative time: "2 minutes ago")
- 🔄 Auto-refresh indicator (updates in real-time)

**User Card States**:
- **Editor**: Bold, accent border, pencil icon
- **Viewer**: Normal, subtle border, eye icon
- **You**: Highlighted background, "YOU" badge

**Empty State**:
- "No users in this resource" message
- Illustration or icon

**Design Notes**:
- Smooth animations when users join/leave
- Sort by: You first, then editors, then viewers
- Show skeleton loaders while fetching user list

---

### 4. Event Log (Bottom Section)
**Purpose**: Monitor all WebSocket events in real-time

**Elements**:
- 📜 Auto-scrolling event log (dark background, monospace font)
- 🎨 Color-coded event types:
  - `connect` → Green
  - `disconnect` → Red
  - `resource:joined` → Blue
  - `user:joined` → Cyan
  - `user:left` → Orange
  - `connect_error` → Red bold
- ⏱️ Timestamp for each event (HH:mm:ss.SSS)
- 📦 JSON payload display (collapsible/expandable)
- 🗑️ Clear log button
- 💾 Export log button (download as .txt or .json)

**Event Entry Format**:
```
[20:15:32.456] 🟢 CONNECT
└─ socketId: abc123xyz

[20:15:45.123] 🔵 RESOURCE_JOINED
└─ { "resourceId": "document:test-001", "success": true, "users": [...] }

[20:16:12.789] 🟡 USER_JOINED
└─ { "userId": "user-002", "username": "Dr. Smith", "mode": "viewer" }
```

**Design Notes**:
- Max 500 lines, auto-trim older entries
- Filter buttons (show only: connections, presence, errors)
- Search/filter by event type or keyword
- Copy individual event JSON button

---

### 5. Multi-User Testing Panel (Optional Advanced Feature)
**Purpose**: Simulate multiple users in one interface

**Elements**:
- 🧪 "Simulate User" button (opens modal)
- 👤 User simulator cards:
  - User ID (auto-generated or custom)
  - JWT token (auto-generated)
  - Resource ID
  - Mode (editor/viewer)
  - Connect/Join/Leave/Disconnect buttons
  - Mini event log per user
- 🎭 Quick scenario buttons:
  - "2 users, same resource"
  - "3 users, different modes"
  - "Join → Edit → Leave cycle"

**Design Notes**:
- Each simulated user is a collapsible card
- Different color accents per user (user1=blue, user2=green, etc.)
- Master "Disconnect All" button

---

## 🎨 Visual Design Guidelines

### Color Palette
- **Primary** (Actions): `#2196F3` (Blue)
- **Success** (Connected): `#4CAF50` (Green)
- **Warning** (Connecting): `#FF9800` (Orange)
- **Error** (Disconnected/Errors): `#F44336` (Red)
- **Neutral** (Backgrounds): `#FAFAFA` (Light Gray), `#212121` (Dark)
- **Accent** (Editor mode): `#9C27B0` (Purple)
- **Info** (Viewer mode): `#00BCD4` (Cyan)

### Typography
- **Headings**: Sans-serif, 600-700 weight (e.g., Inter, Roboto)
- **Body**: Sans-serif, 400-500 weight
- **Monospace** (Logs, JSON): `Fira Code`, `JetBrains Mono`, `Consolas`

### Spacing
- Base unit: `8px` (use multiples: 8, 16, 24, 32, 48)
- Section padding: `24px`
- Card padding: `16px`
- Button padding: `12px 24px`

### Components
- **Buttons**: Rounded corners (`border-radius: 8px`), elevation on hover
- **Inputs**: Outlined style, focus state with accent color
- **Cards**: Subtle shadow, `border-radius: 12px`
- **Badges**: Small pill-shaped, bold text, colored background

---

## 📐 Layout Structure

### Desktop (>1024px)
```
┌─────────────────────────────────────────────┐
│         Connection Panel (Full Width)       │
├──────────────────────┬──────────────────────┤
│  Resource Control    │  Active Users Panel  │
│  Panel (40%)         │  (60%)               │
│                      │                      │
│  - Resource ID       │  👤 User 1 (Editor)  │
│  - Mode Selector     │  👤 User 2 (Viewer)  │
│  - Join/Leave        │  👤 You (Editor)     │
│                      │                      │
├──────────────────────┴──────────────────────┤
│           Event Log (Full Width)            │
│  [20:15:32] 🟢 CONNECT                      │
│  [20:15:45] 🔵 RESOURCE_JOINED              │
│  [20:16:12] 🟡 USER_JOINED                  │
└─────────────────────────────────────────────┘
```

### Mobile (<768px)
```
┌───────────────────┐
│  Connection Panel │
├───────────────────┤
│  Resource Control │
├───────────────────┤
│  Active Users     │
│  (Collapsible)    │
├───────────────────┤
│  Event Log        │
│  (Bottom Sheet)   │
└───────────────────┘
```

---

## 🧪 Test Scenarios to Support

### Scenario 1: Single User Flow
1. Connect with JWT
2. Join resource as editor
3. See yourself in user list
4. Leave resource
5. Disconnect

### Scenario 2: Multi-User Presence (Requires 2 browser tabs)
**Tab 1**:
1. Connect as User A
2. Join `document:test-001` as editor

**Tab 2**:
1. Connect as User B
2. Join same `document:test-001` as viewer
3. Both tabs should show 2 users in Active Users panel
4. Event logs show `USER_JOINED` events

**Tab 1 or 2**:
- User leaves → Other tab receives `USER_LEFT` event

### Scenario 3: Error Handling
1. Connect with expired JWT → Show `connect_error` in red
2. Join same resource twice → Show error message "already joined"
3. Leave resource you're not in → Show error message
4. Server shutdown → Show `SERVER_SHUTDOWN` notification

### Scenario 4: Reconnection
1. Connect and join resource
2. Disconnect network
3. Wait for connection timeout
4. Reconnect → Auto-rejoin resource (if implemented)

---

## 🔧 Technical Considerations

### State Management
- Use reactive framework (LitElement reactive properties, or React state)
- Store:
  - `isConnected: boolean`
  - `socketId: string | null`
  - `currentResourceId: string | null`
  - `currentMode: 'editor' | 'viewer' | null`
  - `activeUsers: UserPresence[]`
  - `eventLog: LogEntry[]`

### WebSocket Event Handlers
```typescript
socket.on('connect', () => { /* Update connection state */ });
socket.on('connect_error', (err) => { /* Show error alert */ });
socket.on('resource:joined', (data) => { /* Update currentResource, activeUsers */ });
socket.on('user:joined', (user) => { /* Add to activeUsers, log event */ });
socket.on('user:left', (user) => { /* Remove from activeUsers, log event */ });
socket.on('disconnect', () => { /* Update connection state */ });
```

### Accessibility
- ✅ Keyboard navigation (Tab, Enter, Esc)
- ✅ ARIA labels for status indicators
- ✅ Focus management (auto-focus inputs after actions)
- ✅ High contrast mode support
- ✅ Screen reader announcements for events

### Performance
- Debounce JWT input validation
- Virtualize event log (render only visible entries)
- Throttle user list updates (max 1 update per 100ms)

---

## 📚 Reference Files (Provided)

### BDD Test Files (Behavior Examples)
- `be001-1-connection.test.js` - Shows all connection scenarios with JWT
- `be001-2-presence.test.js` - Shows join/leave/broadcast scenarios

**Key Insights from Tests**:
- JWT must include `sub`, `username`, `email`, `iss`, `aud`
- Max 5 connections per user (6th is rejected)
- Duplicate joins return `success: false` with message
- Disconnect automatically removes user from all resources
- `USER_LEFT` events include `reason: 'disconnect' | 'explicit'`

### Documentation Files
- `UI_TEAM_WEBSOCKET_API.md` - Complete API reference with TypeScript types
- `ARCHITECTURE.md` - System overview (adapters, Y.js, offline-first)
- `FLOWCHARTS.md` - State machine diagrams (tab states, locking)
- `BDD_TEST_COVERAGE.md` - Visual test flow diagram

---

## 🚀 Next Steps for Designer

1. **Create wireframes** for 5 main panels:
   - Connection Panel
   - Resource Control
   - Active Users
   - Event Log
   - (Optional) Multi-User Simulator

2. **Design component library**:
   - Button variants (primary, danger, outline)
   - Input fields (text, textarea)
   - Status badges (connected, editor, viewer)
   - User cards
   - Event log entries

3. **Design responsive breakpoints**:
   - Desktop (>1024px)
   - Tablet (768px - 1023px)
   - Mobile (<768px)

4. **Prototype key interactions**:
   - Connect → Join → See users → Leave flow
   - Real-time user join/leave animations
   - Event log scrolling and filtering

5. **Design error states**:
   - Connection failed (expired JWT)
   - Duplicate join attempt
   - Network disconnection

---

## 💡 Design Inspiration

### Similar Tools to Reference
- **Postman WebSocket Client** (for event log style)
- **Firebase Console** (for real-time data display)
- **Discord** (for user presence indicators)
- **VS Code Live Share** (for collaborative indicators)
- **Socket.IO Admin UI** (for event monitoring)

### Design System Suggestions
- **Material Design** (Google) - Good for healthcare/enterprise
- **Ant Design** (Alibaba) - Rich component library
- **Radix UI** (Modulz) - Accessible primitives
- **Chakra UI** (React-focused) - Good defaults

---

## ❓ Questions for Clarification

1. Should the UI support **multiple simultaneous resources** (tabs within the UI)?
2. Is **dark mode** required, or just light mode?
3. Should JWT token be **stored** (localStorage) or entered each time?
4. Do you need **user avatars** (real images) or generated (ui-avatars.com)?
5. Should event log persist across **page reloads** (localStorage)?
6. **Time zone** handling for timestamps (UTC vs local)?
7. **Internationalization** (i18n) required? (English only for testing UI?)

---

## 📊 Success Metrics

**This testing UI is successful if**:
- ✅ Developer can connect and authenticate in <30 seconds
- ✅ Multi-user scenarios (2+ users) are testable in <2 minutes
- ✅ All 13 BDD test scenarios are manually reproducible
- ✅ Event log captures 100% of WebSocket events
- ✅ Works in Chrome, Firefox, Safari (latest versions)
- ✅ Responsive on mobile devices (iPad, iPhone)

---

**End of Design Brief**

*This document provides all context needed for a UI/UX designer or AI design tool to create mockups and prototypes for the CollaborNest WebSocket testing interface.*
