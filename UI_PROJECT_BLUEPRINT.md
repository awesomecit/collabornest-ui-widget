# CollaborNest UI - Project Blueprint
**Complete Setup Guide for GitHub Copilot / VS Code**

> **Date**: November 16, 2025, 22:10  
> **Deadline**: 00:00 (1h 50min remaining)  
> **Purpose**: Single-source-of-truth document for creating entire UI testing interface  
> **Backend Status**: ✅ WebSocket Gateway operational (13/13 BDD tests PASS)

---

## 📋 Table of Contents

1. [Project Structure](#project-structure)
2. [Package.json Setup](#packagejson-setup)
3. [Vite Configuration](#vite-configuration)
4. [Markdown Files Content](#markdown-files-content)
5. [LitElement Components Blueprint](#litelement-components-blueprint)
6. [WebSocket Integration Code](#websocket-integration-code)
7. [Step-by-Step Implementation](#step-by-step-implementation)
8. [Testing Checklist](#testing-checklist)

---

## 🗂️ Project Structure

```
ui/
├── .gitignore
├── package.json
├── vite.config.js
├── index.html
│
├── README.md
├── SETUP.md
├── DESIGN.md
├── API_INTEGRATION.md
├── TESTING_GUIDE.md
├── CONTRIBUTING.md
│
├── src/
│   ├── main.js                          # Entry point
│   ├── styles/
│   │   └── global.css                   # Global styles
│   │
│   ├── components/
│   │   ├── testing-interface.js         # Main container component
│   │   ├── connection-panel.js          # JWT + Connect/Disconnect
│   │   ├── resource-control.js          # Join/Leave resources
│   │   ├── active-users-panel.js        # Real-time user list
│   │   ├── event-log.js                 # WebSocket events display
│   │   └── status-badge.js              # Reusable status indicator
│   │
│   └── services/
│       ├── websocket-service.js         # Socket.IO client wrapper
│       └── jwt-generator.js             # Mock JWT token generator
│
└── docs/
    └── screenshots/                      # Test screenshots (manual)
```

---

## 📦 Package.json Setup

```json
{
  "name": "collabornest-ui-testing",
  "version": "0.1.0",
  "description": "WebSocket real-time collaboration testing interface for CollaborNest",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "format": "prettier --write \"src/**/*.{js,css,html}\"",
    "lint": "eslint src --ext .js"
  },
  "dependencies": {
    "lit": "^3.1.0",
    "socket.io-client": "^4.7.2"
  },
  "devDependencies": {
    "@types/node": "^20.10.5",
    "vite": "^5.0.8",
    "prettier": "^3.1.1",
    "eslint": "^8.56.0"
  },
  "keywords": [
    "websocket",
    "collaboration",
    "real-time",
    "lit-element",
    "healthcare",
    "testing-interface"
  ],
  "author": "CollaborNest Team",
  "license": "MIT"
}
```

---

## ⚙️ Vite Configuration

**File**: `vite.config.js`

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy WebSocket requests to backend (if needed)
      '/ws': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
});
```

---

## 📄 Markdown Files Content

### README.md

```markdown
# CollaborNest UI - WebSocket Testing Interface

Real-time collaboration testing interface for CollaborNest WebSocket Gateway.

## Features

- ✅ JWT Authentication Testing
- ✅ Multi-User Presence Tracking
- ✅ Resource Join/Leave Simulation
- ✅ Real-Time Event Monitoring
- ✅ WebSocket Connection Management

## Quick Start

### Prerequisites

- Node.js >= 18.x
- Backend WebSocket server running on `http://localhost:3000`

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

\`\`\`bash
npm run dev
# Opens browser at http://localhost:5173
\`\`\`

### Build

\`\`\`bash
npm run build
npm run preview
\`\`\`

## Usage

1. **Generate JWT Token**: Click "Generate JWT" in Connection Panel
2. **Connect**: Click "Connect to WebSocket"
3. **Join Resource**: Enter resource ID (e.g., `document:123`) and select mode (editor/viewer)
4. **Monitor Events**: Watch real-time events in Event Log panel
5. **Test Multi-User**: Open multiple browser tabs to simulate multiple users

## Backend API Reference

See: [API_INTEGRATION.md](./API_INTEGRATION.md)

## Testing Scenarios

See: [TESTING_GUIDE.md](./TESTING_GUIDE.md)

## Architecture

Built with:
- **LitElement** (Web Components)
- **Socket.IO Client** (WebSocket)
- **Vite** (Build tool)

See: [DESIGN.md](./DESIGN.md)

## Contributing

See: [CONTRIBUTING.md](./CONTRIBUTING.md)

## License

MIT
```

---

### SETUP.md

```markdown
# Setup Guide - CollaborNest UI Testing Interface

## System Requirements

- **Node.js**: 18.x or higher
- **npm**: 9.x or higher
- **Browser**: Chrome 90+, Firefox 88+, Safari 14+

## Step 1: Clone and Install

\`\`\`bash
cd ui/
npm install
\`\`\`

## Step 2: Verify Backend is Running

The UI requires the backend WebSocket server to be operational.

\`\`\`bash
# In backend repo
npm run start:dev
# Should see: "WebSocket Gateway listening on http://localhost:3000"
\`\`\`

## Step 3: Start Development Server

\`\`\`bash
npm run dev
\`\`\`

Browser will open automatically at `http://localhost:5173`

## Step 4: Verify Connection

1. UI should load with 4 panels:
   - Connection Panel (top-left)
   - Resource Control (top-right)
   - Active Users (bottom-left)
   - Event Log (bottom-right)

2. Click "Generate JWT Token" → should see a valid JWT in the textarea
3. Click "Connect to WebSocket" → status should change to "Connected ✅"
4. Event log should show: `CONNECTED | Socket ID: xxxxx`

## Troubleshooting

### "Connection Failed" Error

**Cause**: Backend not running or wrong URL

**Solution**:
\`\`\`bash
# Check backend is running
curl http://localhost:3000/health
# Should return: {"status":"ok"}

# Check WebSocket endpoint
curl http://localhost:3000/ws/socket.io/
# Should return Socket.IO handshake response
\`\`\`

### JWT Token Invalid

**Cause**: JWT secret mismatch between UI and backend

**Solution**: Update `src/services/jwt-generator.js` with correct secret from backend `.env`:

\`\`\`javascript
const JWT_SECRET = 'your_super_secure_jwt_secret_32_characters_minimum';
\`\`\`

### Port 5173 Already in Use

**Solution**:
\`\`\`bash
# Change port in vite.config.js
server: {
  port: 5174, // or any available port
}
\`\`\`

## Environment Variables (Optional)

Create `.env` file in `ui/` root:

\`\`\`env
VITE_WS_URL=http://localhost:3000
VITE_WS_PATH=/ws/socket.io
VITE_JWT_SECRET=your_super_secure_jwt_secret_32_characters_minimum
\`\`\`

Access in code:
\`\`\`javascript
const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000';
\`\`\`

## Next Steps

- Read [API_INTEGRATION.md](./API_INTEGRATION.md) for WebSocket API reference
- Read [TESTING_GUIDE.md](./TESTING_GUIDE.md) for manual test scenarios
- Read [DESIGN.md](./DESIGN.md) for component architecture
```

---

### DESIGN.md

```markdown
# Design Document - CollaborNest UI Testing Interface

## Overview

Single-page testing interface for validating WebSocket real-time collaboration features.

## Design Principles

1. **Developer-Focused**: Clear, functional, no-frills UI
2. **Real-Time First**: All state updates via WebSocket events
3. **Multi-User Testing**: Simulate 2+ users in different tabs
4. **Event Transparency**: Every WebSocket event visible in log
5. **Accessibility**: Keyboard navigation, ARIA labels, high contrast

## UI Layout

### Desktop Layout (>1024px)

```
┌─────────────────────────────────────────────────────┐
│  🔌 Connection Panel       │  📁 Resource Control   │
│  • JWT Token Generator     │  • Resource ID Input   │
│  • Connect/Disconnect      │  • Mode Selector       │
│  • Status: Connected ✅    │  • Join/Leave Buttons  │
├─────────────────────────────────────────────────────┤
│  👥 Active Users           │  📊 Event Log          │
│  • User 1 (editor)         │  • [12:34:56] CONNECT  │
│  • User 2 (viewer)         │  • [12:35:01] JOINED   │
│  • User 3 (editor)         │  • [12:35:15] USER_IN  │
└─────────────────────────────────────────────────────┘
```

### Mobile Layout (<768px)

Stacked vertically:
1. Connection Panel (collapsible)
2. Resource Control (collapsible)
3. Active Users (always visible, max-height 200px scroll)
4. Event Log (always visible, fills remaining space)

## Component Specifications

### 1. Connection Panel

**Purpose**: Manage WebSocket connection with JWT authentication

**Elements**:
- **JWT Textarea** (6 lines, monospace font)
  - Placeholder: "Paste JWT token or click Generate"
  - Validation: Real-time check for valid JWT format (3 parts separated by dots)
  
- **Generate JWT Button** (secondary style)
  - Generates mock JWT with test user credentials
  - Auto-populates textarea
  
- **Connect/Disconnect Button** (primary style when disconnected, danger when connected)
  - Label changes: "Connect to WebSocket" ↔ "Disconnect"
  - Disabled during connection attempt
  
- **Connection Status Badge**
  - Disconnected: ⚪ Gray "Disconnected"
  - Connecting: 🟡 Yellow "Connecting..."
  - Connected: 🟢 Green "Connected"
  - Error: 🔴 Red "Error: [message]"
  
- **Socket ID Display** (when connected)
  - Format: `Socket ID: abc123xyz` (truncated, with copy button)

**States**:
- `DISCONNECTED` (initial)
- `CONNECTING` (after clicking Connect)
- `CONNECTED` (after successful handshake)
- `ERROR` (after connection failure)

---

### 2. Resource Control Panel

**Purpose**: Join/Leave document resources

**Elements**:
- **Resource ID Input** (text field)
  - Placeholder: "document:123 | page:/patient/456 | form:789"
  - Validation: Format `type:identifier`
  - Examples dropdown (optional)
  
- **Mode Selector** (radio buttons)
  - 🖊️ Editor (default)
  - 👁️ Viewer
  
- **Join Button** (primary style)
  - Disabled when: not connected, already in same resource
  - Label: "Join as Editor" | "Join as Viewer"
  
- **Leave Button** (secondary style)
  - Only visible when currently in a resource
  - Label: "Leave [resourceId]"
  
- **Current Resource Display**
  - Shows: "Currently in: document:123 (editor mode)"
  - Hidden when not in any resource

**States**:
- `IDLE` (not in any resource)
- `JOINING` (waiting for confirmation)
- `ACTIVE` (joined, receiving updates)
- `LEAVING` (waiting for confirmation)

---

### 3. Active Users Panel

**Purpose**: Show real-time presence of users in current resource

**Elements**:
- **Header**: "Active Users ([count])"
- **User Cards** (list, max-height 400px, scrollable)
  - Avatar (generated from initials or ui-avatars.com)
  - Username (bold)
  - Email (muted text)
  - Mode Badge: 🖊️ EDITOR | 👁️ VIEWER
  - Joined Time (relative: "2m ago")
  - Socket ID (truncated, tooltip shows full)
  
- **Empty State**: "No active users. Join a resource to see collaborators."

**Auto-Update**: 
- Add user card when `user:joined` event received
- Remove user card when `user:left` event received
- Update mode if user changes (future feature)

---

### 4. Event Log Panel

**Purpose**: Real-time WebSocket event monitoring

**Elements**:
- **Header**: "Event Log" with Clear button
- **Auto-Scroll Toggle** (checkbox, default ON)
- **Filter Dropdown** (optional)
  - All Events
  - Connection Events Only
  - Resource Events Only
  - User Events Only
  
- **Event Entries** (reverse chronological, newest on top if auto-scroll off)
  - Timestamp: `[HH:mm:ss.SSS]`
  - Event Type Badge (color-coded)
  - Event Data (JSON formatted, collapsible)
  - Copy Button (per entry)

**Event Type Colors**:
- `connect` → 🟢 Green
- `connect_error` → 🔴 Red
- `disconnect` → 🟠 Orange
- `resource:joined` → 🔵 Blue
- `resource:left` → 🟣 Purple
- `user:joined` → 🟦 Light Blue
- `user:left` → 🟧 Light Orange
- `SERVER_SHUTDOWN` → 🔴 Red (bold)

**Max Entries**: 100 (auto-prune oldest when exceeded)

---

## Color Palette

### Primary Colors
- **Primary**: `#3B82F6` (Blue 500)
- **Secondary**: `#6B7280` (Gray 500)
- **Success**: `#10B981` (Green 500)
- **Warning**: `#F59E0B` (Amber 500)
- **Danger**: `#EF4444` (Red 500)

### Background Colors
- **Page Background**: `#F9FAFB` (Gray 50)
- **Card Background**: `#FFFFFF`
- **Input Background**: `#F3F4F6` (Gray 100)

### Text Colors
- **Primary Text**: `#111827` (Gray 900)
- **Secondary Text**: `#6B7280` (Gray 500)
- **Muted Text**: `#9CA3AF` (Gray 400)

### Status Colors
- **Connected**: `#10B981` (Green 500)
- **Disconnected**: `#9CA3AF` (Gray 400)
- **Editor**: `#8B5CF6` (Purple 500)
- **Viewer**: `#3B82F6` (Blue 500)

---

## Typography

- **Font Family**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`
- **Headings**: 
  - H1: 24px, bold (panel titles)
  - H2: 18px, semibold (section headers)
- **Body**: 14px, regular
- **Small**: 12px, regular (timestamps, metadata)
- **Monospace**: `'Fira Code', 'Courier New', monospace` (JWT, Socket IDs, JSON)

---

## Interaction Patterns

### Connection Flow
1. User enters or generates JWT
2. User clicks "Connect to WebSocket"
3. Status changes to "Connecting..." (button disabled)
4. On success: Status "Connected ✅", event log shows CONNECT
5. On failure: Status "Error: [message]", alert shown

### Join Resource Flow
1. User enters resource ID (e.g., `document:123`)
2. User selects mode (editor/viewer)
3. User clicks "Join as [mode]"
4. On success: 
   - Current resource displayed
   - Active Users panel populates with existing users
   - Event log shows `resource:joined` with user list
5. On failure: Alert shown with error message

### Multi-User Simulation
1. Open UI in Tab 1
2. Generate JWT for User A, connect, join `document:123` as editor
3. Open UI in Tab 2 (same browser or different)
4. Generate JWT for User B, connect, join `document:123` as viewer
5. Tab 1 Active Users should show User B (viewer)
6. Tab 2 Active Users should show User A (editor)
7. Both event logs show `user:joined` events

---

## Accessibility Requirements

### Keyboard Navigation
- Tab order: JWT textarea → Generate → Connect → Resource ID → Mode → Join → Leave
- Enter key: Submit forms (connect, join)
- Escape key: Close alerts/modals

### ARIA Labels
- `aria-label="JWT Token Input"`
- `aria-label="Connect to WebSocket Server"`
- `aria-live="polite"` on status badges
- `role="log"` on event log container

### Screen Reader Announcements
- "Connected to WebSocket server" when connection succeeds
- "Joined [resourceId] as [mode]" when join succeeds
- "User [username] joined as [mode]" when other user joins

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 for normal text)
- Status badges have sufficient contrast with backgrounds

---

## Responsive Breakpoints

- **Desktop**: ≥1024px (4-panel grid)
- **Tablet**: 768px - 1023px (2-column layout)
- **Mobile**: <768px (single column, stacked)

---

## Future Enhancements (Post-MVP)

- [ ] Dark mode toggle
- [ ] Export event log as JSON
- [ ] Multiple resource tabs (join 2+ resources simultaneously)
- [ ] Real-time typing indicators (Y.js CRDT integration)
- [ ] User avatar upload (instead of generated)
- [ ] WebRTC video presence (future epic)
- [ ] Internationalization (i18n)

---

## References

- Backend API: `../backend/docs/UI_TEAM_WEBSOCKET_API.md`
- BDD Tests: `../backend/scripts/bdd-tests/`
- Design Inspiration: Postman WebSocket Client, Firebase Console
```

---

### API_INTEGRATION.md

```markdown
# API Integration Guide - WebSocket Client

## Connection Setup

### Socket.IO Client Configuration

\`\`\`javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000/collaboration', {
  path: '/ws/socket.io',
  auth: {
    token: JWT_TOKEN // Your JWT from jwt-generator.js
  },
  transports: ['websocket', 'polling'],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 5
});
\`\`\`

### JWT Token Requirements

JWT must include these claims:

\`\`\`json
{
  "sub": "user-unique-id",
  "username": "dr_smith",
  "email": "smith@hospital.com",
  "iss": "collabornest",
  "aud": "collabornest-users",
  "iat": 1234567890,
  "exp": 1234571490
}
\`\`\`

**Secret**: Must match backend `JWT_SECRET` environment variable.

---

## Events Reference

### Outgoing Events (Client → Server)

#### 1. Join Resource

\`\`\`javascript
socket.emit('resource:join', {
  resourceId: 'document:123',
  mode: 'editor' // or 'viewer'
});
\`\`\`

**Parameters**:
- `resourceId` (string): Format `type:identifier`
  - Examples: `document:123`, `page:/patient/456`, `form:789`
- `mode` (string): `'editor'` or `'viewer'`

**Response**: See `resource:joined` event below

---

#### 2. Leave Resource

\`\`\`javascript
socket.emit('resource:leave', {
  resourceId: 'document:123'
});
\`\`\`

**Parameters**:
- `resourceId` (string): Must be a resource you're currently in

**Response**: See `resource:left` event below

---

### Incoming Events (Server → Client)

#### 1. Connection Success

\`\`\`javascript
socket.on('connect', () => {
  console.log('Connected!', socket.id);
});
\`\`\`

**Payload**: None (socket.id available via `socket.id`)

---

#### 2. Connection Error

\`\`\`javascript
socket.on('connect_error', (error) => {
  console.error('Connection failed:', error.message);
  // Example: "JWT_INVALID: JWT validation failed: jwt expired"
});
\`\`\`

**Error Types**:
- `JWT_INVALID`: Token expired, malformed, or wrong secret
- `JWT_MISSING`: No token provided
- `MAX_CONNECTIONS`: User exceeded 5 connections

---

#### 3. Disconnection

\`\`\`javascript
socket.on('disconnect', (reason) => {
  console.log('Disconnected:', reason);
  // reason examples: 'io server disconnect', 'transport close'
});
\`\`\`

**Auto-Cleanup**: Server removes user from all resources on disconnect.

---

#### 4. Resource Joined (Confirmation)

\`\`\`javascript
socket.on('resource:joined', (data) => {
  console.log('Joined resource:', data);
  // data = {
  //   success: true,
  //   resourceId: 'document:123',
  //   userId: 'user-abc',
  //   joinedAt: '2025-11-16T22:00:00.000Z',
  //   users: [
  //     { userId: 'user-abc', username: 'Dr. Smith', mode: 'editor', ... },
  //     { userId: 'user-xyz', username: 'Nurse Jane', mode: 'viewer', ... }
  //   ]
  // }
});
\`\`\`

**Payload**:
\`\`\`typescript
{
  success: boolean,
  resourceId: string,
  userId: string,
  joinedAt: string, // ISO 8601 timestamp
  users: Array<{
    userId: string,
    username: string,
    email: string,
    socketId: string,
    joinedAt: string,
    mode: 'editor' | 'viewer'
  }>,
  message?: string // Error message if success=false
}
\`\`\`

**Error Cases** (success=false):
- `"User already in this resource"` - Duplicate join attempt
- `"Resource not found"` - Invalid resource ID (future: if using DB)

---

#### 5. Resource Left (Confirmation)

\`\`\`javascript
socket.on('resource:left', (data) => {
  console.log('Left resource:', data);
  // data = {
  //   success: true,
  //   resourceId: 'document:123',
  //   userId: 'user-abc'
  // }
});
\`\`\`

**Payload**:
\`\`\`typescript
{
  success: boolean,
  resourceId: string,
  userId: string,
  message?: string // Error if success=false
}
\`\`\`

---

#### 6. User Joined (Broadcast to Others)

\`\`\`javascript
socket.on('user:joined', (data) => {
  console.log('Another user joined:', data);
  // data = {
  //   resourceId: 'document:123',
  //   user: {
  //     userId: 'user-xyz',
  //     username: 'Nurse Jane',
  //     email: 'jane@hospital.com',
  //     socketId: 'abc123',
  //     joinedAt: '2025-11-16T22:05:00.000Z',
  //     mode: 'viewer'
  //   }
  // }
});
\`\`\`

**When Triggered**: Another user joins the SAME resource you're in.

**Payload**:
\`\`\`typescript
{
  resourceId: string,
  user: {
    userId: string,
    username: string,
    email: string,
    socketId: string,
    joinedAt: string,
    mode: 'editor' | 'viewer'
  }
}
\`\`\`

---

#### 7. User Left (Broadcast to Others)

\`\`\`javascript
socket.on('user:left', (data) => {
  console.log('User left:', data);
  // data = {
  //   resourceId: 'document:123',
  //   user: {
  //     userId: 'user-xyz',
  //     username: 'Nurse Jane',
  //     socketId: 'abc123'
  //   },
  //   reason: 'explicit' // or 'disconnect'
  // }
});
\`\`\`

**Payload**:
\`\`\`typescript
{
  resourceId: string,
  user: {
    userId: string,
    username: string,
    socketId: string
  },
  reason: 'explicit' | 'disconnect'
}
\`\`\`

**Reason Types**:
- `explicit`: User clicked "Leave Resource" button
- `disconnect`: User closed tab/lost connection

---

#### 8. Server Shutdown (Maintenance)

\`\`\`javascript
socket.on('SERVER_SHUTDOWN', (data) => {
  alert('Server is shutting down for maintenance. Please save your work.');
  // data = { message: "Server is shutting down. Please reconnect." }
});
\`\`\`

**Payload**:
\`\`\`typescript
{
  message: string
}
\`\`\`

**When Triggered**: Server graceful shutdown (manual or deployment).

---

## Complete Integration Example

\`\`\`javascript
import { io } from 'socket.io-client';

class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentResource = null;
    this.activeUsers = [];
    this.eventLog = [];
  }

  connect(jwtToken) {
    this.socket = io('http://localhost:3000/collaboration', {
      path: '/ws/socket.io',
      auth: { token: jwtToken },
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      this.isConnected = true;
      this.logEvent('CONNECT', { socketId: this.socket.id });
      this.onStateChange();
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      this.logEvent('CONNECT_ERROR', { error: error.message });
      this.onStateChange();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.currentResource = null;
      this.activeUsers = [];
      this.logEvent('DISCONNECT', { reason });
      this.onStateChange();
    });

    this.socket.on('resource:joined', (data) => {
      this.currentResource = data.resourceId;
      this.activeUsers = data.users;
      this.logEvent('RESOURCE_JOINED', data);
      this.onStateChange();
    });

    this.socket.on('resource:left', (data) => {
      this.currentResource = null;
      this.activeUsers = [];
      this.logEvent('RESOURCE_LEFT', data);
      this.onStateChange();
    });

    this.socket.on('user:joined', (data) => {
      this.activeUsers.push(data.user);
      this.logEvent('USER_JOINED', data);
      this.onStateChange();
    });

    this.socket.on('user:left', (data) => {
      this.activeUsers = this.activeUsers.filter(
        u => u.socketId !== data.user.socketId
      );
      this.logEvent('USER_LEFT', data);
      this.onStateChange();
    });

    this.socket.on('SERVER_SHUTDOWN', (data) => {
      this.logEvent('SERVER_SHUTDOWN', data);
      alert(data.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinResource(resourceId, mode) {
    if (!this.isConnected) {
      throw new Error('Not connected to WebSocket');
    }
    this.socket.emit('resource:join', { resourceId, mode });
  }

  leaveResource(resourceId) {
    if (!this.isConnected) {
      throw new Error('Not connected to WebSocket');
    }
    this.socket.emit('resource:leave', { resourceId });
  }

  logEvent(type, data) {
    this.eventLog.unshift({
      timestamp: new Date().toISOString(),
      type,
      data
    });
    if (this.eventLog.length > 100) {
      this.eventLog.pop();
    }
  }

  onStateChange() {
    // Override this method to update UI
    console.log('State changed:', {
      isConnected: this.isConnected,
      currentResource: this.currentResource,
      activeUsers: this.activeUsers.length,
      eventLog: this.eventLog.length
    });
  }
}

export default WebSocketService;
\`\`\`

---

## Testing with Backend BDD Tests

The backend has 13 BDD test scenarios. You can replicate them manually:

### Scenario 1: Valid JWT Authentication
1. Generate JWT in UI
2. Click Connect
3. ✅ Should see "Connected" status
4. ✅ Event log shows `CONNECT` with socket ID

### Scenario 2: Expired JWT Rejection
1. Generate JWT, then manually change `exp` claim to past timestamp
2. Click Connect
3. ❌ Should see `connect_error` in event log
4. ❌ Error message: "JWT validation failed: jwt expired"

### Scenario 7: Join Resource as Editor
1. Connect with valid JWT
2. Enter `document:123` in Resource ID
3. Select "Editor" mode
4. Click "Join as Editor"
5. ✅ Current resource displays "document:123 (editor)"
6. ✅ Active Users shows your username

### Scenario 11: Multi-User Broadcast
1. **Tab 1**: Connect as User A, join `document:123` as editor
2. **Tab 2**: Connect as User B, join `document:123` as viewer
3. ✅ Tab 1 Active Users shows User B (viewer)
4. ✅ Tab 2 Active Users shows User A (editor)
5. ✅ Both event logs show `USER_JOINED` events

---

## Troubleshooting

### "JWT_INVALID" Error
- Check JWT secret matches backend `.env` file
- Verify JWT claims include: `sub`, `username`, `email`, `iss`, `aud`
- Check JWT not expired (`exp` claim > current timestamp)

### User Not Appearing in Active Users
- Verify both users joined SAME resourceId
- Check event log for `USER_JOINED` event
- Try refreshing tab and reconnecting

### Event Log Not Updating
- Check `autoScroll` is enabled
- Verify WebSocket connection is active (status = "Connected")
- Open browser DevTools → Network → WS tab to inspect raw WebSocket frames

### Backend Not Responding
\`\`\`bash
# Check backend health
curl http://localhost:3000/health

# Check WebSocket endpoint
curl http://localhost:3000/ws/socket.io/

# Restart backend
cd backend/
npm run start:dev
\`\`\`

---

## Rate Limits & Constraints

- **Max Connections per User**: 5 simultaneous connections
- **Max Resources per User**: Unlimited (in-memory only, no DB persistence yet)
- **JWT Expiration**: 1 hour (configurable in backend)
- **Event Log Max Entries**: 100 (client-side limit)

---

## Security Considerations

⚠️ **This is a TESTING interface**. In production:
- Never expose JWT secret in frontend code
- Use HTTPS for all WebSocket connections
- Implement proper authentication flow (OAuth2, SAML)
- Validate resource IDs against database permissions
- Encrypt sensitive data in event logs

---

## Backend Documentation References

- **Full API Spec**: `../backend/docs/UI_TEAM_WEBSOCKET_API.md`
- **BDD Test Scenarios**: `../backend/scripts/bdd-tests/be001-*.test.js`
- **Architecture**: `../backend/docs/ARCHITECTURE.md`
```

---

### TESTING_GUIDE.md

```markdown
# Manual Testing Guide - CollaborNest UI

Complete walkthrough of all testing scenarios based on backend BDD tests.

---

## Prerequisites

1. ✅ Backend WebSocket server running (`npm run start:dev` in backend repo)
2. ✅ UI dev server running (`npm run dev` in ui repo)
3. ✅ Browser DevTools open (F12) → Network → WS tab (to inspect WebSocket frames)

---

## Test Scenarios

### Scenario 1: Valid JWT Connection ✅

**Objective**: Verify successful connection with valid JWT token

**Steps**:
1. Open UI at `http://localhost:5173`
2. Click "Generate JWT Token" button
3. Verify JWT appears in textarea (3 parts separated by dots)
4. Click "Connect to WebSocket" button
5. Observe status change: "Disconnected" → "Connecting..." → "Connected ✅"

**Expected Results**:
- ✅ Status badge turns green "Connected"
- ✅ Socket ID displayed (format: `abc123xyz`)
- ✅ Event log shows: `[HH:mm:ss] CONNECT | Socket ID: [your-socket-id]`
- ✅ Connect button changes to "Disconnect" (red)

**Backend Verification**:
```bash
# Backend logs should show:
[WebSocketGateway] Client connected: abc123xyz (user: test-user-xxx)
```

---

### Scenario 2: Expired JWT Rejection ❌

**Objective**: Verify connection fails with expired JWT

**Steps**:
1. Generate JWT token
2. Open browser DevTools → Application → Local Storage
3. Decode JWT (use jwt.io or browser extension)
4. Manually change `exp` claim to past timestamp: `"exp": 1234567890`
5. Encode back to JWT format
6. Paste modified JWT into textarea
7. Click "Connect to WebSocket"

**Expected Results**:
- ❌ Status badge turns red "Error: JWT validation failed"
- ❌ Event log shows: `[HH:mm:ss] CONNECT_ERROR | JWT_INVALID: jwt expired`
- ❌ Alert popup: "Connection failed: JWT token expired"

**Alternative (Easier Method)**:
1. Wait 1 hour after generating JWT (if you have time 😅)
2. Try to connect → should fail with same error

---

### Scenario 3: Connection Pool Tracking 👥

**Objective**: Verify multiple users can connect simultaneously

**Steps**:
1. **Tab 1**: Generate JWT for User A, connect
2. **Tab 2**: Generate JWT for User B, connect
3. **Tab 3**: Generate JWT for User C, connect

**Expected Results**:
- ✅ All 3 tabs show "Connected" status
- ✅ Each tab has unique Socket ID
- ✅ Backend logs show 3 active connections

**Backend Verification**:
```bash
# Backend logs:
[WebSocketGateway] Active connections: 3
```

---

### Scenario 4: Max Connections Enforcement ⛔

**Objective**: Verify 6th connection from same user is rejected

**Steps**:
1. Open 5 tabs (Tab 1-5)
2. In each tab: Use **SAME username** (e.g., "test-user"), generate JWT, connect
3. All 5 should connect successfully
4. Open Tab 6
5. Use **SAME username**, generate JWT, try to connect

**Expected Results**:
- ✅ Tabs 1-5 remain connected
- ❌ Tab 6 shows: `CONNECT_ERROR | MAX_CONNECTIONS: User has reached maximum 5 connections`
- ❌ Tab 6 status: "Error: Max connections reached"

**Note**: Backend enforces 5 connections per `userId`, not per JWT token.

---

### Scenario 5: Join Resource as Editor 🖊️

**Objective**: Successfully join a document resource in editor mode

**Prerequisites**: Connected to WebSocket

**Steps**:
1. In Resource ID input, type: `document:123`
2. Select mode: "Editor" (radio button)
3. Click "Join as Editor" button
4. Wait for confirmation (~500ms)

**Expected Results**:
- ✅ Current Resource displays: "Currently in: document:123 (editor mode)"
- ✅ Active Users panel shows: Your username with "EDITOR" badge
- ✅ Event log shows:
  ```
  [HH:mm:ss] RESOURCE_JOINED | document:123
  {
    success: true,
    resourceId: "document:123",
    userId: "user-xxx",
    users: [ { username: "Your Name", mode: "editor", ... } ]
  }
  ```
- ✅ Leave button becomes visible

---

### Scenario 6: Join Resource as Viewer 👁️

**Objective**: Join same resource in viewer mode

**Prerequisites**: Connected to WebSocket

**Steps**:
1. Resource ID: `document:123`
2. Select mode: "Viewer"
3. Click "Join as Viewer"

**Expected Results**:
- ✅ Current Resource: "document:123 (viewer mode)"
- ✅ Active Users: Your username with "VIEWER" badge
- ✅ Event log: `RESOURCE_JOINED` with `mode: "viewer"`

---

### Scenario 7: Leave Resource Explicitly 🚪

**Objective**: Leave resource by clicking button

**Prerequisites**: Already joined a resource

**Steps**:
1. Click "Leave [resourceId]" button
2. Wait for confirmation

**Expected Results**:
- ✅ Current Resource display disappears
- ✅ Active Users panel shows "No active users"
- ✅ Event log shows:
  ```
  [HH:mm:ss] RESOURCE_LEFT | document:123
  {
    success: true,
    resourceId: "document:123",
    userId: "user-xxx"
  }
  ```
- ✅ Leave button disappears
- ✅ Join button re-enabled

---

### Scenario 8: Multi-User Collaboration 👥🖊️👁️

**Objective**: Test 2+ users in same resource simultaneously

**Steps**:

**Tab 1 (User A)**:
1. Generate JWT for username "Dr. Smith"
2. Connect
3. Join `document:123` as **Editor**

**Tab 2 (User B)**:
1. Generate JWT for username "Nurse Jane"
2. Connect
3. Join `document:123` as **Viewer**

**Expected Results**:

**Tab 1 Active Users**:
- ✅ Dr. Smith (EDITOR) ← You
- ✅ Nurse Jane (VIEWER)

**Tab 2 Active Users**:
- ✅ Dr. Smith (EDITOR)
- ✅ Nurse Jane (VIEWER) ← You

**Tab 1 Event Log**:
```
[HH:mm:ss] RESOURCE_JOINED | document:123 (2 users)
[HH:mm:ss] USER_JOINED | Nurse Jane (viewer)
```

**Tab 2 Event Log**:
```
[HH:mm:ss] RESOURCE_JOINED | document:123 (2 users)
```

**Tab 2 should NOT show** `USER_JOINED` for Dr. Smith because Dr. Smith joined BEFORE Nurse Jane.

---

### Scenario 9: User Leave Broadcast 📢

**Objective**: Verify other users are notified when someone leaves

**Prerequisites**: 2+ users in same resource (continue from Scenario 8)

**Steps**:
1. **Tab 1 (Dr. Smith)**: Click "Leave document:123"
2. Observe **Tab 2 (Nurse Jane)**

**Expected Results**:

**Tab 1**:
- ✅ Current Resource disappears
- ✅ Active Users: "No active users"
- ✅ Event log: `RESOURCE_LEFT | document:123`

**Tab 2**:
- ✅ Active Users: Nurse Jane only (Dr. Smith removed)
- ✅ Event log: `USER_LEFT | Dr. Smith (reason: explicit)`

---

### Scenario 10: Disconnect Cleanup 🔌❌

**Objective**: Verify disconnection removes user from all resources

**Prerequisites**: User A in `document:123`, User B watching

**Steps**:
1. **Tab 1 (User A)**: Join `document:123` as editor
2. **Tab 2 (User B)**: Join `document:123` as viewer
3. **Tab 1**: Close tab OR click browser "Back" button (abrupt disconnect)
4. Observe **Tab 2**

**Expected Results**:

**Tab 2 Event Log**:
```
[HH:mm:ss] USER_LEFT | User A (reason: disconnect)
```

**Tab 2 Active Users**:
- ✅ User A removed from list
- ✅ Only User B remains

**Backend Logs**:
```bash
[WebSocketGateway] Client disconnected: abc123 (cleanup: 1 resources)
```

---

### Scenario 11: Duplicate Join Attempt ⚠️

**Objective**: Verify error when trying to join same resource twice

**Prerequisites**: Already joined `document:123`

**Steps**:
1. While in `document:123`, try to join `document:123` again
2. Click "Join as Editor"

**Expected Results**:
- ❌ Alert: "Error: User already in this resource"
- ❌ Event log: `RESOURCE_JOINED | success: false, message: "already joined"`
- ✅ Current resource remains unchanged
- ✅ Active Users unchanged

---

### Scenario 12: Leave Without Joining ⚠️

**Objective**: Verify error when leaving resource you're not in

**Steps**:
1. Connect to WebSocket
2. Do NOT join any resource
3. Manually call `leaveResource('document:999')` (via browser console)

**Expected Results**:
- ❌ Event log: `RESOURCE_LEFT | success: false, message: "not in this resource"`
- ✅ No errors crash the app

**Browser Console**:
```javascript
window.wsService.leaveResource('document:999');
// Should log error message
```

---

### Scenario 13: Server Shutdown Notification 🛑

**Objective**: Verify graceful shutdown message is received

**Prerequisites**: Connected to WebSocket

**Steps**:
1. In backend terminal, press `Ctrl+C` (graceful shutdown)
2. Observe UI

**Expected Results**:
- 🔴 Alert popup: "Server is shutting down for maintenance. Please save your work."
- ❌ Status changes to "Disconnected"
- ❌ Event log: `SERVER_SHUTDOWN | message: "Server is shutting down"`
- ✅ No crash or uncaught errors

**Backend Logs**:
```bash
[WebSocketGateway] Graceful shutdown initiated
[WebSocketGateway] Sent SERVER_SHUTDOWN to 5 clients
```

---

## Performance Testing

### Test 14: Event Log Scrolling 📜

**Objective**: Verify event log handles 100+ events

**Steps**:
1. Connect → Join → Leave → Repeat 30 times
2. Scroll event log to bottom
3. Verify auto-scroll works
4. Check event count

**Expected Results**:
- ✅ Only latest 100 events displayed
- ✅ Older events auto-pruned
- ✅ Scroll performance smooth (no lag)

---

### Test 15: Multiple Resources (Future) 📁

**Objective**: Join 2+ resources simultaneously (if implemented)

**Steps**:
1. Join `document:123` as editor
2. Join `page:/patient/456` as viewer
3. Verify both active in UI

**Expected Results**:
- ✅ Tab/dropdown shows both resources
- ✅ Active Users panel switches when changing resource
- ✅ Leave works independently per resource

**Note**: This feature is **not yet implemented** in backend. Test only after EPIC-001.3+.

---

## Accessibility Testing

### Test 16: Keyboard Navigation ⌨️

**Steps**:
1. Load UI
2. Press `Tab` repeatedly
3. Verify focus order: JWT textarea → Generate → Connect → Resource ID → Mode → Join

**Expected Results**:
- ✅ All interactive elements reachable via Tab
- ✅ Visual focus indicator (blue outline)
- ✅ Enter key submits forms

---

### Test 17: Screen Reader ♿

**Steps**:
1. Enable screen reader (NVDA on Windows, VoiceOver on Mac)
2. Navigate UI
3. Connect to WebSocket

**Expected Results**:
- ✅ Status changes announced: "Connected to WebSocket server"
- ✅ Event log has `role="log"` and `aria-live="polite"`
- ✅ Buttons have descriptive labels

---

## Browser Compatibility

### Test 18: Cross-Browser Testing 🌐

**Browsers to Test**:
- ✅ Chrome 120+ (primary)
- ✅ Firefox 115+
- ✅ Safari 17+
- ✅ Edge 120+

**Steps**:
1. Open UI in each browser
2. Run Scenarios 1-8
3. Verify all functionality works

**Known Issues**:
- Safari may require explicit WebSocket permission
- Firefox may show CORS warnings (safe to ignore in dev)

---

## Troubleshooting Guide

### Issue: "Connection Failed" on First Load

**Cause**: Backend not running

**Solution**:
```bash
cd backend/
npm run start:dev
# Wait for: "WebSocket Gateway listening on http://localhost:3000"
```

---

### Issue: JWT Token Invalid Error

**Cause**: JWT secret mismatch

**Solution**:
1. Check backend `.env` file: `JWT_SECRET=...`
2. Update `src/services/jwt-generator.js`:
   ```javascript
   const JWT_SECRET = 'your_super_secure_jwt_secret_32_characters_minimum';
   ```
3. Restart UI dev server

---

### Issue: Active Users Not Updating

**Cause**: Not in same resource or event listener issue

**Debug Steps**:
1. Open DevTools → Network → WS tab
2. Filter for `user:joined` or `user:left` messages
3. Verify events are received
4. Check event log for corresponding entries
5. If events received but UI not updating → check component reactivity

---

### Issue: Event Log Not Auto-Scrolling

**Cause**: Auto-scroll disabled or browser performance throttling

**Solution**:
1. Verify "Auto-Scroll" checkbox is enabled
2. Check browser DevTools → Performance tab for throttling
3. Reduce event frequency (disconnect/reconnect less often)

---

## Test Reporting Template

After completing tests, fill this checklist:

```markdown
## Test Report - [Date]

### Environment
- Backend Version: v0.2.0
- UI Version: v0.1.0
- Node Version: 18.20.0
- Browser: Chrome 120.0.6099.109

### Test Results

- [ ] Scenario 1: Valid JWT Connection ✅ PASS
- [ ] Scenario 2: Expired JWT Rejection ❌ PASS
- [ ] Scenario 3: Connection Pool Tracking ✅ PASS
- [ ] Scenario 4: Max Connections Enforcement ⛔ PASS
- [ ] Scenario 5: Join Resource as Editor ✅ PASS
- [ ] Scenario 6: Join Resource as Viewer ✅ PASS
- [ ] Scenario 7: Leave Resource Explicitly ✅ PASS
- [ ] Scenario 8: Multi-User Collaboration ✅ PASS
- [ ] Scenario 9: User Leave Broadcast ✅ PASS
- [ ] Scenario 10: Disconnect Cleanup ✅ PASS
- [ ] Scenario 11: Duplicate Join Attempt ⚠️ PASS
- [ ] Scenario 12: Leave Without Joining ⚠️ PASS
- [ ] Scenario 13: Server Shutdown ✅ PASS

### Issues Found
- None

### Screenshots
- [Attach screenshots of successful tests]

### Performance Notes
- Event log handles 100+ events smoothly
- Multi-user latency: <100ms

### Recommendations
- Add dark mode toggle
- Improve error messages
- Add export event log feature
```

---

## Next Steps After Testing

1. ✅ All scenarios pass → Ready for code review
2. ❌ Some scenarios fail → File bugs in GitHub Issues
3. 🐛 Found UI bugs → Fix and re-test
4. 📸 Take screenshots → Add to docs/screenshots/
5. 📝 Update this guide with new findings

---

**Last Updated**: November 16, 2025  
**Test Coverage**: 13/13 BDD scenarios manual-testable
```

---

### CONTRIBUTING.md

```markdown
# Contributing to CollaborNest UI

Thank you for your interest! This guide will help you contribute effectively.

---

## Development Setup

### Prerequisites

- Node.js >= 18.x
- npm >= 9.x
- Git
- Backend WebSocket server running locally

### Initial Setup

```bash
# Clone repository
git clone <ui-repo-url>
cd ui/

# Install dependencies
npm install

# Start development server
npm run dev
```

Browser opens at `http://localhost:5173`

---

## Development Workflow

### 1. Pick an Issue

- Browse [GitHub Issues](https://github.com/your-org/ui/issues)
- Look for `good-first-issue` or `help-wanted` labels
- Comment on issue to claim it: "I'd like to work on this"

### 2. Create Feature Branch

```bash
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

**Branch Naming**:
- `feat/add-dark-mode` - New features
- `fix/event-log-scroll` - Bug fixes
- `docs/update-readme` - Documentation
- `refactor/websocket-service` - Code improvements

### 3. Make Changes

**Atomic Commits**: One logical change per commit

```bash
# Make changes to files
git add src/components/event-log.js
git commit -m "feat(event-log): add export to JSON button"
```

**Commit Message Format**:
```
<type>(<scope>): <subject>

<body (optional)>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples**:
```bash
git commit -m "feat(connection): add retry logic for failed connections"
git commit -m "fix(event-log): prevent memory leak with 100+ events"
git commit -m "docs(api): add JSDoc comments to WebSocketService"
```

### 4. Test Your Changes

```bash
# Manual testing checklist
- [ ] Connect with valid JWT → works
- [ ] Join resource → Active Users updates
- [ ] Leave resource → UI updates correctly
- [ ] Multi-user scenario → Both tabs see each other
- [ ] Error cases → Graceful error messages

# Future: Run automated tests (when added)
# npm test
```

### 5. Push and Create PR

```bash
git push -u origin feat/your-feature-name
```

Then open PR on GitHub with:

**PR Title**: `feat: Add dark mode toggle`

**PR Description Template**:
```markdown
## What does this PR do?
Adds a dark mode toggle in the header that persists to localStorage.

## Related Issue
Closes #42

## How to Test
1. Load UI
2. Click moon icon in top-right
3. Verify colors invert
4. Refresh page → dark mode persists

## Screenshots
[Attach before/after screenshots]

## Checklist
- [x] Tested manually in Chrome
- [x] Tested in Firefox
- [x] Updated README.md (if needed)
- [x] Added JSDoc comments
- [ ] Added automated tests (optional for MVP)
```

### 6. Code Review

- Maintainer reviews your code within 1-2 days
- Address feedback by pushing new commits to same branch
- Do NOT force-push (`git push --force`) unless requested
- Once approved → Maintainer merges

---

## Code Style

### JavaScript/LitElement

**Use**:
- ES6+ features (arrow functions, destructuring, async/await)
- Single quotes for strings: `'hello'`
- 2 spaces for indentation
- Semicolons required

**Example**:
```javascript
import { LitElement, html, css } from 'lit';

class EventLog extends LitElement {
  static properties = {
    events: { type: Array }
  };

  constructor() {
    super();
    this.events = [];
  }

  render() {
    return html`
      <div class="event-log">
        ${this.events.map(event => html`
          <div class="event">${event.type}</div>
        `)}
      </div>
    `;
  }
}

customElements.define('event-log', EventLog);
```

### CSS

**Naming**: BEM convention (Block__Element--Modifier)

```css
.connection-panel { } /* Block */
.connection-panel__button { } /* Element */
.connection-panel__button--primary { } /* Modifier */
```

**Example**:
```css
.event-log {
  max-height: 400px;
  overflow-y: auto;
}

.event-log__entry {
  padding: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.event-log__entry--error {
  background-color: #fee2e2;
  color: #991b1b;
}
```

---

## Component Guidelines

### LitElement Best Practices

1. **Declare Properties**:
   ```javascript
   static properties = {
     isConnected: { type: Boolean },
     socketId: { type: String }
   };
   ```

2. **Use Reactive Updates**:
   ```javascript
   // ✅ GOOD: Triggers re-render
   this.events = [...this.events, newEvent];

   // ❌ BAD: No re-render
   this.events.push(newEvent);
   ```

3. **Emit Custom Events**:
   ```javascript
   this.dispatchEvent(new CustomEvent('resource-joined', {
     detail: { resourceId: 'document:123' },
     bubbles: true,
     composed: true
   }));
   ```

4. **Listen to Events**:
   ```javascript
   connectedCallback() {
     super.connectedCallback();
     this.addEventListener('resource-joined', this._handleJoin);
   }

   disconnectedCallback() {
     this.removeEventListener('resource-joined', this._handleJoin);
     super.disconnectedCallback();
   }
   ```

---

## Testing (Future)

### Unit Tests (Not Yet Implemented)

When adding tests, use **Web Test Runner**:

```javascript
// test/event-log.test.js
import { fixture, html, expect } from '@open-wc/testing';
import '../src/components/event-log.js';

describe('EventLog Component', () => {
  it('renders event entries', async () => {
    const el = await fixture(html`
      <event-log .events=${[
        { type: 'CONNECT', timestamp: '2025-11-16T22:00:00Z' }
      ]}></event-log>
    `);

    const entry = el.shadowRoot.querySelector('.event-log__entry');
    expect(entry).to.exist;
    expect(entry.textContent).to.include('CONNECT');
  });
});
```

Run tests:
```bash
npm test
```

---

## Documentation

### JSDoc Comments

All public methods/properties require JSDoc:

```javascript
/**
 * Connects to WebSocket server with JWT authentication.
 * 
 * @param {string} jwtToken - Valid JWT token with required claims
 * @returns {Promise<void>}
 * @throws {Error} If JWT is invalid or connection fails
 * 
 * @example
 * await wsService.connect('eyJhbGciOi...');
 */
async connect(jwtToken) {
  // Implementation
}
```

### README Updates

When adding features, update:
- `README.md` → Quick Start section
- `DESIGN.md` → Component Specifications
- `API_INTEGRATION.md` → New event handlers (if applicable)

---

## Release Process (Maintainers Only)

### Versioning

We use **Semantic Versioning** (SemVer):

- `0.1.0` → `0.2.0` (Minor: new features, backward-compatible)
- `0.2.0` → `0.2.1` (Patch: bug fixes)
- `0.9.0` → `1.0.0` (Major: breaking changes)

### Steps to Release

```bash
# 1. Update version
npm version minor # or major, patch
# This updates package.json and creates git tag

# 2. Update CHANGELOG.md
# Add new section:
## [0.2.0] - 2025-11-17
### Added
- Dark mode toggle
- Export event log to JSON

### Fixed
- Event log scroll performance

# 3. Commit and push
git add package.json CHANGELOG.md
git commit -m "chore: bump version to 0.2.0"
git push origin main --tags

# 4. Build for production
npm run build

# 5. Deploy to hosting (Netlify, Vercel, etc)
# Or create GitHub Release with dist/ artifacts
```

---

## Getting Help

### Stuck on Something?

1. **Check Docs First**: README.md, DESIGN.md, API_INTEGRATION.md
2. **Search Issues**: Someone may have asked already
3. **Ask in Discussions**: GitHub Discussions (or Discord if available)
4. **File an Issue**: If you found a bug or need a feature

### Good Questions Include:

- "How do I handle WebSocket reconnection in LitElement?"
- "Where should I add the dark mode toggle component?"
- "The event log isn't updating when I join a resource. Here's my code: [link]"

### Not-So-Good Questions:

- "It doesn't work" (no context, no code, no error message)
- "Can you do this for me?" (we're here to help you learn, not do it for you)

---

## Code of Conduct

Be respectful, inclusive, and constructive. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).

**Examples**:
- ✅ "Great PR! One suggestion: could you add a JSDoc comment here?"
- ❌ "This code is terrible. Did you even test it?"

---

## Recognition

Contributors are recognized in:
- `README.md` → Contributors section
- GitHub Insights → Contributors graph
- Release notes acknowledgments

---

**Thank you for contributing! 🎉**
```

---

## 🔧 LitElement Components Blueprint

### Component 1: testing-interface.js (Main Container)

```javascript
// src/components/testing-interface.js
import { LitElement, html, css } from 'lit';
import './connection-panel.js';
import './resource-control.js';
import './active-users-panel.js';
import './event-log.js';
import WebSocketService from '../services/websocket-service.js';

/**
 * Main container component for WebSocket testing interface.
 * Coordinates communication between all child components.
 */
class TestingInterface extends LitElement {
  static properties = {
    wsService: { type: Object, state: true },
    isConnected: { type: Boolean, state: true },
    currentResource: { type: String, state: true },
    currentMode: { type: String, state: true },
    activeUsers: { type: Array, state: true },
    eventLog: { type: Array, state: true }
  };

  static styles = css`
    :host {
      display: block;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background-color: #f9fafb;
      min-height: 100vh;
      padding: 24px;
    }

    .container {
      max-width: 1400px;
      margin: 0 auto;
    }

    .header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 24px;
      border-radius: 12px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .header h1 {
      margin: 0 0 8px 0;
      font-size: 28px;
      font-weight: 700;
    }

    .header p {
      margin: 0;
      opacity: 0.9;
      font-size: 14px;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
    }

    @media (max-width: 1024px) {
      .grid {
        grid-template-columns: 1fr;
      }
    }

    .panel {
      background: white;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .panel-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 16px;
      padding-bottom: 12px;
      border-bottom: 2px solid #e5e7eb;
    }

    .panel-title {
      font-size: 18px;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }
  `;

  constructor() {
    super();
    this.wsService = new WebSocketService();
    this.isConnected = false;
    this.currentResource = null;
    this.currentMode = null;
    this.activeUsers = [];
    this.eventLog = [];

    // Bind WebSocket service state updates to component
    this.wsService.onStateChange = this._handleStateChange.bind(this);
  }

  _handleStateChange() {
    this.isConnected = this.wsService.isConnected;
    this.currentResource = this.wsService.currentResource;
    this.activeUsers = this.wsService.activeUsers;
    this.eventLog = this.wsService.eventLog;
    this.requestUpdate(); // Force re-render
  }

  _handleConnect(e) {
    const { jwtToken } = e.detail;
    this.wsService.connect(jwtToken);
  }

  _handleDisconnect() {
    this.wsService.disconnect();
  }

  _handleJoinResource(e) {
    const { resourceId, mode } = e.detail;
    this.currentMode = mode;
    this.wsService.joinResource(resourceId, mode);
  }

  _handleLeaveResource(e) {
    const { resourceId } = e.detail;
    this.wsService.leaveResource(resourceId);
  }

  render() {
    return html`
      <div class="container">
        <div class="header">
          <h1>🔌 CollaborNest Testing Interface</h1>
          <p>WebSocket Real-Time Collaboration - Development Testing Tool</p>
        </div>

        <div class="grid">
          <!-- Top Left: Connection Panel -->
          <div class="panel">
            <connection-panel
              .isConnected=${this.isConnected}
              .socketId=${this.wsService.socket?.id}
              @connect=${this._handleConnect}
              @disconnect=${this._handleDisconnect}
            ></connection-panel>
          </div>

          <!-- Top Right: Resource Control -->
          <div class="panel">
            <resource-control
              .isConnected=${this.isConnected}
              .currentResource=${this.currentResource}
              .currentMode=${this.currentMode}
              @join-resource=${this._handleJoinResource}
              @leave-resource=${this._handleLeaveResource}
            ></resource-control>
          </div>

          <!-- Bottom Left: Active Users -->
          <div class="panel">
            <active-users-panel
              .users=${this.activeUsers}
              .currentResource=${this.currentResource}
            ></active-users-panel>
          </div>

          <!-- Bottom Right: Event Log -->
          <div class="panel">
            <event-log
              .events=${this.eventLog}
            ></event-log>
          </div>
        </div>
      </div>
    `;
  }
}

customElements.define('testing-interface', TestingInterface);
```

---

### Component 2: connection-panel.js

```javascript
// src/components/connection-panel.js
import { LitElement, html, css } from 'lit';
import { generateJWT } from '../services/jwt-generator.js';

class ConnectionPanel extends LitElement {
  static properties = {
    isConnected: { type: Boolean },
    socketId: { type: String },
    jwtToken: { type: String, state: true },
    status: { type: String, state: true } // 'disconnected' | 'connecting' | 'connected' | 'error'
  };

  static styles = css`
    :host {
      display: block;
    }

    .form-group {
      margin-bottom: 16px;
    }

    label {
      display: block;
      font-weight: 600;
      color: #374151;
      margin-bottom: 8px;
      font-size: 14px;
    }

    textarea {
      width: 100%;
      min-height: 120px;
      padding: 12px;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 12px;
      resize: vertical;
      transition: border-color 0.2s;
    }

    textarea:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-bottom: 16px;
    }

    button {
      flex: 1;
      padding: 10px 16px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .btn-secondary {
      background-color: #f3f4f6;
      color: #374151;
    }

    .btn-secondary:hover:not(:disabled) {
      background-color: #e5e7eb;
    }

    .btn-primary {
      background-color: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #2563eb;
    }

    .btn-danger {
      background-color: #ef4444;
      color: white;
    }

    .btn-danger:hover:not(:disabled) {
      background-color: #dc2626;
    }

    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 600;
    }

    .status-disconnected {
      background-color: #f3f4f6;
      color: #6b7280;
    }

    .status-connecting {
      background-color: #fef3c7;
      color: #92400e;
    }

    .status-connected {
      background-color: #d1fae5;
      color: #065f46;
    }

    .status-error {
      background-color: #fee2e2;
      color: #991b1b;
    }

    .socket-id {
      margin-top: 12px;
      padding: 8px 12px;
      background-color: #f9fafb;
      border-radius: 6px;
      font-family: 'Fira Code', monospace;
      font-size: 12px;
      color: #4b5563;
    }

    .socket-id strong {
      color: #111827;
    }
  `;

  constructor() {
    super();
    this.isConnected = false;
    this.socketId = null;
    this.jwtToken = '';
    this.status = 'disconnected';
  }

  _handleGenerateJWT() {
    const username = `test-user-${Date.now()}`;
    const email = `${username}@example.com`;
    this.jwtToken = generateJWT(username, email);
  }

  _handleConnect() {
    if (!this.jwtToken.trim()) {
      alert('Please enter or generate a JWT token');
      return;
    }

    this.status = 'connecting';
    this.dispatchEvent(new CustomEvent('connect', {
      detail: { jwtToken: this.jwtToken },
      bubbles: true,
      composed: true
    }));
  }

  _handleDisconnect() {
    this.dispatchEvent(new CustomEvent('disconnect', {
      bubbles: true,
      composed: true
    }));
  }

  updated(changedProperties) {
    if (changedProperties.has('isConnected')) {
      this.status = this.isConnected ? 'connected' : 'disconnected';
    }
  }

  _getStatusBadge() {
    const statusConfig = {
      disconnected: { icon: '⚪', text: 'Disconnected', class: 'status-disconnected' },
      connecting: { icon: '🟡', text: 'Connecting...', class: 'status-connecting' },
      connected: { icon: '🟢', text: 'Connected', class: 'status-connected' },
      error: { icon: '🔴', text: 'Error', class: 'status-error' }
    };

    const config = statusConfig[this.status];
    return html`
      <div class="status-badge ${config.class}">
        <span>${config.icon}</span>
        <span>${config.text}</span>
      </div>
    `;
  }

  render() {
    return html`
      <div>
        <h2 style="margin: 0 0 16px 0; font-size: 18px; color: #111827;">
          🔌 Connection Panel
        </h2>

        <div class="form-group">
          <label for="jwt-token">JWT Token</label>
          <textarea
            id="jwt-token"
            placeholder="Paste JWT token or click Generate..."
            .value=${this.jwtToken}
            @input=${(e) => this.jwtToken = e.target.value}
          ></textarea>
        </div>

        <div class="button-group">
          <button
            class="btn-secondary"
            @click=${this._handleGenerateJWT}
          >
            Generate JWT Token
          </button>

          ${this.isConnected ? html`
            <button
              class="btn-danger"
              @click=${this._handleDisconnect}
            >
              Disconnect
            </button>
          ` : html`
            <button
              class="btn-primary"
              @click=${this._handleConnect}
              ?disabled=${this.status === 'connecting'}
            >
              ${this.status === 'connecting' ? 'Connecting...' : 'Connect to WebSocket'}
            </button>
          `}
        </div>

        ${this._getStatusBadge()}

        ${this.isConnected && this.socketId ? html`
          <div class="socket-id">
            <strong>Socket ID:</strong> ${this.socketId}
          </div>
        ` : ''}
      </div>
    `;
  }
}

customElements.define('connection-panel', ConnectionPanel);
```

---

### Component 3-5: Stubs (You'll implement with Copilot)

```javascript
// src/components/resource-control.js
// TODO: Implement with GitHub Copilot
// - Resource ID input field
// - Mode selector (editor/viewer radio buttons)
// - Join/Leave buttons
// - Current resource display

// src/components/active-users-panel.js
// TODO: Implement with GitHub Copilot
// - User card list
// - Avatar generation
// - Mode badges (editor/viewer)
// - Empty state

// src/components/event-log.js
// TODO: Implement with GitHub Copilot
// - Event entries list (reverse chronological)
// - Color-coded event types
// - Auto-scroll toggle
// - Clear button
// - Max 100 entries
```

---

## 🔌 WebSocket Integration Code

### Service: websocket-service.js

```javascript
// src/services/websocket-service.js
import { io } from 'socket.io-client';

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:3000/collaboration';
const WS_PATH = import.meta.env.VITE_WS_PATH || '/ws/socket.io';

/**
 * WebSocket service for managing Socket.IO connection and events.
 * Handles connection, presence tracking, and event logging.
 */
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.currentResource = null;
    this.activeUsers = [];
    this.eventLog = [];
    this.maxEventLogSize = 100;
  }

  /**
   * Connect to WebSocket server with JWT authentication.
   * @param {string} jwtToken - Valid JWT token
   */
  connect(jwtToken) {
    if (this.socket) {
      this.disconnect();
    }

    this.socket = io(WS_URL, {
      path: WS_PATH,
      auth: { token: jwtToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    this._setupEventListeners();
  }

  /**
   * Disconnect from WebSocket server.
   */
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.isConnected = false;
    this.currentResource = null;
    this.activeUsers = [];
  }

  /**
   * Join a resource (document/page/form).
   * @param {string} resourceId - Resource identifier (e.g., "document:123")
   * @param {string} mode - 'editor' or 'viewer'
   */
  joinResource(resourceId, mode) {
    if (!this.isConnected) {
      throw new Error('Not connected to WebSocket');
    }
    this.socket.emit('resource:join', { resourceId, mode });
  }

  /**
   * Leave a resource.
   * @param {string} resourceId - Resource identifier
   */
  leaveResource(resourceId) {
    if (!this.isConnected) {
      throw new Error('Not connected to WebSocket');
    }
    this.socket.emit('resource:leave', { resourceId });
  }

  /**
   * Setup all Socket.IO event listeners.
   * @private
   */
  _setupEventListeners() {
    // Connection events
    this.socket.on('connect', () => {
      this.isConnected = true;
      this._logEvent('CONNECT', { socketId: this.socket.id });
      this.onStateChange();
    });

    this.socket.on('connect_error', (error) => {
      this.isConnected = false;
      this._logEvent('CONNECT_ERROR', { error: error.message });
      this.onStateChange();
    });

    this.socket.on('disconnect', (reason) => {
      this.isConnected = false;
      this.currentResource = null;
      this.activeUsers = [];
      this._logEvent('DISCONNECT', { reason });
      this.onStateChange();
    });

    // Resource events
    this.socket.on('resource:joined', (data) => {
      this.currentResource = data.resourceId;
      this.activeUsers = data.users || [];
      this._logEvent('RESOURCE_JOINED', data);
      this.onStateChange();
    });

    this.socket.on('resource:left', (data) => {
      if (data.success) {
        this.currentResource = null;
        this.activeUsers = [];
      }
      this._logEvent('RESOURCE_LEFT', data);
      this.onStateChange();
    });

    // User presence events
    this.socket.on('user:joined', (data) => {
      this.activeUsers.push(data.user);
      this._logEvent('USER_JOINED', data);
      this.onStateChange();
    });

    this.socket.on('user:left', (data) => {
      this.activeUsers = this.activeUsers.filter(
        u => u.socketId !== data.user.socketId
      );
      this._logEvent('USER_LEFT', data);
      this.onStateChange();
    });

    // Server events
    this.socket.on('SERVER_SHUTDOWN', (data) => {
      this._logEvent('SERVER_SHUTDOWN', data);
      alert(data.message);
      this.onStateChange();
    });
  }

  /**
   * Log an event with timestamp.
   * @private
   */
  _logEvent(type, data) {
    const entry = {
      timestamp: new Date().toISOString(),
      type,
      data
    };

    this.eventLog.unshift(entry); // Newest first

    // Prune old events
    if (this.eventLog.length > this.maxEventLogSize) {
      this.eventLog = this.eventLog.slice(0, this.maxEventLogSize);
    }
  }

  /**
   * Override this method in consuming component to receive state updates.
   */
  onStateChange() {
    // Default no-op, override in component
  }
}

export default WebSocketService;
```

---

### Service: jwt-generator.js

```javascript
// src/services/jwt-generator.js

const JWT_SECRET = 'your_super_secure_jwt_secret_32_characters_minimum'; // MUST match backend .env
const JWT_ISSUER = 'collabornest';
const JWT_AUDIENCE = 'collabornest-users';

/**
 * Generate a mock JWT token for testing purposes.
 * WARNING: This is NOT secure for production use. Only for development testing.
 * 
 * @param {string} username - Username (e.g., "dr_smith")
 * @param {string} email - Email (e.g., "smith@hospital.com")
 * @returns {string} JWT token in format: header.payload.signature
 */
export function generateJWT(username, email) {
  const header = {
    alg: 'HS256',
    typ: 'JWT'
  };

  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: `user-${Date.now()}`, // Unique user ID
    username,
    email,
    iss: JWT_ISSUER,
    aud: JWT_AUDIENCE,
    iat: now,
    exp: now + 3600 // Expires in 1 hour
  };

  // Base64URL encode (remove padding, replace +/ with -_)
  const base64UrlEncode = (obj) => {
    const json = JSON.stringify(obj);
    const base64 = btoa(json);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const headerEncoded = base64UrlEncode(header);
  const payloadEncoded = base64UrlEncode(payload);

  // Mock signature (in real JWT, this would be HMAC-SHA256 of header.payload with secret)
  // For testing UI, backend will validate with actual secret
  const signature = base64UrlEncode({ mock: 'signature', secret: JWT_SECRET.substring(0, 10) });

  return `${headerEncoded}.${payloadEncoded}.${signature}`;
}

/**
 * Decode JWT payload (without verification).
 * @param {string} token - JWT token
 * @returns {object} Decoded payload
 */
export function decodeJWT(token) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid JWT format');

    const payload = parts[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decoded);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}
```

---

## 📝 Step-by-Step Implementation

### Phase 1: Project Setup (10 minutes)

```bash
# 1. Create project directory
mkdir ui && cd ui

# 2. Initialize npm project
npm init -y

# 3. Install dependencies
npm install lit socket.io-client
npm install -D vite prettier eslint

# 4. Create directory structure
mkdir -p src/{components,services,styles}
mkdir -p docs/screenshots

# 5. Create empty files
touch index.html vite.config.js
touch src/main.js
touch src/styles/global.css
touch .gitignore
```

---

### Phase 2: Configuration Files (5 minutes)

**Create `.gitignore`**:
```
node_modules/
dist/
.DS_Store
.env
*.log
```

**Create `index.html`**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CollaborNest WebSocket Testing Interface</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code&display=swap" rel="stylesheet">
</head>
<body>
  <testing-interface></testing-interface>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

**Create `src/main.js`**:
```javascript
import './components/testing-interface.js';
import './styles/global.css';
```

**Create `src/styles/global.css`**:
```css
* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  background-color: #f9fafb;
}
```

---

### Phase 3: Implement Components (30 minutes)

**With GitHub Copilot**:

1. Copy `testing-interface.js` code from this document → Create file
2. Copy `connection-panel.js` → Create file
3. Copy `websocket-service.js` → Create file
4. Copy `jwt-generator.js` → Create file

5. **Use Copilot to generate remaining components**:
   - Open `src/components/resource-control.js`
   - Type comment: `// Resource control panel with join/leave functionality`
   - Let Copilot generate based on `connection-panel.js` structure

6. Repeat for `active-users-panel.js` and `event-log.js`

---

### Phase 4: Test Locally (15 minutes)

```bash
# 1. Start backend (in separate terminal)
cd ../backend
npm run start:dev
# Wait for: "WebSocket Gateway listening on http://localhost:3000"

# 2. Start UI dev server
cd ../ui
npm run dev
# Browser opens at http://localhost:5173

# 3. Manual test:
# - Click "Generate JWT"
# - Click "Connect to WebSocket"
# - Verify status: "Connected ✅"
# - Enter resource ID: "document:123"
# - Click "Join as Editor"
# - Verify Active Users shows your username
```

---

### Phase 5: Create Markdown Files (20 minutes)

```bash
# Copy content from this blueprint into files:
touch README.md SETUP.md DESIGN.md API_INTEGRATION.md TESTING_GUIDE.md CONTRIBUTING.md

# Use text editor or VS Code to paste content from sections above
```

---

### Phase 6: Commit and Push (5 minutes)

```bash
git init
git add .
git commit -m "feat: initial UI testing interface implementation

- LitElement components for WebSocket testing
- Connection management with JWT auth
- Resource join/leave controls
- Real-time presence tracking
- Event log monitoring
- Complete documentation (README, SETUP, DESIGN, API, TESTING, CONTRIBUTING)"

git remote add origin <your-repo-url>
git branch -M main
git push -u origin main
```

---

## ✅ Testing Checklist

After implementation, verify:

### Basic Functionality
- [ ] UI loads at `http://localhost:5173`
- [ ] All 4 panels visible (Connection, Resource Control, Active Users, Event Log)
- [ ] Generate JWT button works → JWT appears in textarea
- [ ] Connect button works → Status changes to "Connected ✅"
- [ ] Socket ID displays after connection
- [ ] Join resource works → Current resource displays
- [ ] Active Users shows your username
- [ ] Leave resource works → UI resets correctly
- [ ] Disconnect button works → Status changes to "Disconnected"

### Multi-User Testing
- [ ] Open 2 browser tabs
- [ ] Tab 1: Connect as User A, join `document:123` as editor
- [ ] Tab 2: Connect as User B, join `document:123` as viewer
- [ ] Tab 1 Active Users shows User B
- [ ] Tab 2 Active Users shows User A
- [ ] Tab 1 Event Log shows `USER_JOINED | User B`
- [ ] Close Tab 2 → Tab 1 Event Log shows `USER_LEFT | User B (disconnect)`

### Error Handling
- [ ] Try connecting with empty JWT → Alert shown
- [ ] Try joining without connecting → Disabled or error shown
- [ ] Try joining same resource twice → Error message in event log
- [ ] Backend not running → `CONNECT_ERROR` in event log

### Responsive Design
- [ ] UI works on desktop (>1024px)
- [ ] UI works on tablet (768px - 1023px)
- [ ] UI works on mobile (<768px)

### Browser Compatibility
- [ ] Works in Chrome 120+
- [ ] Works in Firefox 115+
- [ ] Works in Safari 17+ (if available)

---

## 🎯 Success Criteria

**You've successfully completed this blueprint if**:

✅ UI project structure matches diagram  
✅ All 6 markdown files created with complete content  
✅ LitElement components compile without errors  
✅ WebSocket connection establishes successfully  
✅ Can join/leave resources and see real-time updates  
✅ Multi-user testing works (2+ tabs see each other)  
✅ Event log captures all WebSocket events  
✅ Code committed to Git repository

---

## 🚀 Next Steps After Completion

1. **Take Screenshots**: Capture successful connection, join, multi-user scenarios → Save to `docs/screenshots/`
2. **Write Test Report**: Fill template in `TESTING_GUIDE.md`
3. **File GitHub Issues**: For any bugs found during testing
4. **Share with Team**: Send repo link for code review
5. **Deploy to Netlify/Vercel** (optional): Make publicly accessible

---

## 📞 Support

**Stuck on something?**

1. Check backend is running: `curl http://localhost:3000/health`
2. Check browser DevTools → Console for errors
3. Check Network → WS tab for WebSocket frames
4. Verify JWT secret matches backend `.env`
5. Re-read `SETUP.md` Troubleshooting section

**Still stuck?**
- Create GitHub Issue with:
  - Error message (copy/paste)
  - Browser console screenshot
  - Steps to reproduce
  - Expected vs actual behavior

---

**Blueprint Version**: 1.0  
**Last Updated**: November 16, 2025, 22:10  
**Time to Complete**: ~90 minutes (phases 1-6)  
**Difficulty**: Intermediate (requires basic LitElement + WebSocket knowledge)

---

**END OF BLUEPRINT** 🎉

*This document contains everything needed to create the complete UI testing interface. Use with GitHub Copilot in VS Code for maximum efficiency. Good luck!*
