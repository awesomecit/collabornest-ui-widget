# UI Development Roadmap

**Project**: CollaborNest UI Widget  
**Current Version**: v0.1.0 (MVP)  
**Last Updated**: November 16, 2025

---

## 🎯 Current Status

### ✅ Phase 1: MVP Testing Interface (COMPLETED)

**Completed**: November 16, 2025  
**Files**: `ui/test-single-page.html`, `ui/README.md`

**Features Delivered**:
- ✅ Single-page HTML testing UI (no build step)
- ✅ JWT token generator (browser-safe HMAC-SHA256)
- ✅ WebSocket connection management (Socket.IO via CDN)
- ✅ Real-time presence tracking (join/leave resources)
- ✅ Multi-user collaboration (editor/viewer modes)
- ✅ Active users panel with mode badges
- ✅ Color-coded event log (100-entry buffer)
- ✅ Error handling (expired JWT, duplicate join, disconnect)

**Coverage**: 9/13 backend BDD scenarios validated

**Status**: ✅ **Production-ready for testing BE-001.1 + BE-001.2**

---

## 🚧 Phase 2: Lock Awareness & Warnings (NEXT - Week 3)

**Depends on**: BE-001.3 (Distributed Locks) - Delivery: Nov 25, 2025  
**Estimated**: 2-3 days (after backend ready)  
**Story Points**: 21 (6 stories)  
**Details**: See `docs/project/UI-001.3-LOCK-UI-TASKS.md` and `docs/project/BE-001.3-LOCK-DECISIONS.md`

### 2.1 Multi-Editor Warning (UI-Only) ⚡ Priority 1 (STORY-1)

**Can start now** (no backend dependency)

**Features**:
- ⚠️ Warning banner when 2+ editors in same resource
- 🔴 Red badge on user cards for conflicting editors
- 📊 Conflict counter in Active Users header

**Implementation**:
```javascript
// Add to updateActiveUsers()
const editors = users.filter(u => u.mode === 'editor');
if (editors.length > 1) {
  showConflictWarning(`⚠️ ${editors.length} editors active. Changes may conflict.`);
}
```

**Files to Edit**:
- `ui/test-single-page.html` (add warning banner div)
- CSS: Add `.conflict-warning` styles

**Effort**: ~2 hours

---

### 2.2 Lock Status Indicator (Requires BE-001.3) 🔒 (STORY-2)

**Blocked by**: Backend lock events (`lock_acquired`, `lock_denied`, `lock_released`)  
**Points**: 5 | **Sprint**: Week 3

**Features**:
- 🔒 Lock icon next to resource ID when locked
- 👤 "Locked by: Dr. Smith" display
- ⏱️ Lock expiration countdown timer
- 🔓 "Lock available" notification when released

**New Events to Handle**:
```javascript
socket.on('lock:acquired', (data) => {
  showLockStatus('acquired', data);
});

socket.on('lock:denied', (data) => {
  showLockStatus('denied', data.lockedBy);
  // Auto-downgrade join button to "Join as Viewer"
});

socket.on('lock:released', (data) => {
  showLockStatus('released');
  showNotification('Resource unlocked. You can now edit.');
});

socket.on('lock:expired', (data) => {
  showLockStatus('expired', data.previousOwner);
});
```

**UI Components**:
- Lock status badge in Resource Control panel
- Lock owner display (username + timestamp)
- Request lock button (for viewers)
- Lock renewal keep-alive (auto-send every 4 min)

**Effort**: ~1 day (HTML + CSS + JS logic)

---

### 2.3 Heartbeat & Toast (STORY-3, STORY-5)

**Points**: 5 | **Sprint**: Week 3 | **Blocked**: BE-001.3

**Features**:

- 🔄 60s heartbeat to renew lock TTL
- 🍞 Toast notifications on lock denied/released/expired
- 🔘 "Request Lock" button visible when resource locked by someone else
- 📬 Send `lock:acquire` event to backend
- ✅ Auto-switch to editor mode when lock acquired
- ❌ Show error if lock request denied

**Implementation**:
```javascript
function requestLock() {
  if (!wsService.currentResource) return;
  
  wsService.socket.emit('lock:acquire', {
    resourceId: wsService.currentResource,
    ttl: 300000 // 5 minutes
  });
}

// Add button to Resource Control panel
<button id="requestLockBtn" class="btn-primary" style="display: none;">
  🔒 Request Lock
</button>
```

**Effort**: ~4 hours

---

## 🏗️ Phase 3: Hierarchical Resources (Week 4)

**Depends on**: Backend hierarchical resource support  
**Estimated**: 3-4 days

### 3.1 Tab Selector UI

**Features**:
- 📑 Dropdown to select specific tab/section
- 🔗 Resource ID format: `document:123/tab:diagnosis`
- 🎚️ Quick actions: "Lock this tab", "Join all tabs"

**UI Mockup**:
```
Resource ID: [document:123      ▼]
Tab/Section: [diagnosis         ▼]
             - patient-info
             - diagnosis ← current
             - procedure-notes
             - signatures
```

**Effort**: ~1 day

---

### 3.2 Multi-Tab Presence View

**Features**:
- 📊 Show which users are in which tabs
- 🔒 Per-tab lock indicators
- 🎨 Color-code tabs by lock status (free/locked/your-lock)

**Active Users Panel Enhancement**:
```
👥 Active Users (3)
  📁 patient-info
    - Dr. Smith (editor) 🔒
  📁 diagnosis
    - You (editor) 🔒
    - Nurse Jane (viewer)
  📁 procedure-notes
    - (no users)
```

**Effort**: ~2 days

---

## 🚀 Phase 4: LitElement Refactor (Week 5-6)

**Goal**: Modular, reusable Web Components architecture

### 4.1 Component Structure

**New Files**:
```
src/
├── components/
│   ├── testing-interface.js         # Main container
│   ├── connection-panel.js          # JWT + Connect
│   ├── resource-control.js          # Join/Leave
│   ├── lock-status.js               # Lock indicator
│   ├── active-users-panel.js        # User list
│   ├── user-card.js                 # Individual user
│   ├── event-log.js                 # Event display
│   └── conflict-warning.js          # Warning banner
├── services/
│   ├── websocket-service.js         # Socket.IO wrapper
│   └── jwt-generator.js             # JWT creation
└── styles/
    └── global.css                   # Shared styles
```

**Effort**: ~1 week

---

### 4.2 Vite Build Setup

**Features**:
- ⚡ Hot module reload (HMR)
- 📦 Production build with minification
- 🎨 CSS modules
- 🧪 Test runner integration

**Files**:
- `package.json` - Dependencies (Lit, Vite, Socket.IO client)
- `vite.config.js` - Build configuration
- `index.html` - Entry point (replace `test-single-page.html`)

**Effort**: ~1 day

---

## 🎨 Phase 5: UI Polish & Features (Week 7-8)

### 5.1 Dark Mode Toggle

**Features**:
- 🌙 Toggle button in header
- 💾 Persist preference to localStorage
- 🎨 Dark theme color palette

**Effort**: ~4 hours

---

### 5.2 Export Event Log

**Features**:
- 💾 Export log as JSON file
- 📄 Export log as formatted text
- 📋 Copy individual events to clipboard

**Implementation**:
```javascript
function exportEventLog(format = 'json') {
  const data = format === 'json' 
    ? JSON.stringify(eventLog, null, 2)
    : eventLog.map(e => `[${e.timestamp}] ${e.type}: ${e.data}`).join('\n');
  
  const blob = new Blob([data], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `event-log-${Date.now()}.${format}`;
  a.click();
}
```

**Effort**: ~2 hours

---

### 5.3 User Avatars (Real Images)

**Features**:
- 📷 Upload custom avatar (future auth integration)
- 🎨 Gravatar integration (based on email)
- 🔤 Fallback to initials (current behavior)

**Effort**: ~4 hours

---

## 🧪 Phase 6: Y.js CRDT Integration (Week 9-10)

**Depends on**: BE-001.4 (Y.js CRDT Sync) - Backend Team

### 6.1 Real-Time Collaborative Editing

**Features**:
- ✍️ Google Docs-style real-time editing
- 🔄 Automatic conflict resolution via CRDT
- 👤 Typing indicators (cursor positions)
- 🎨 User-specific cursor colors

**New Events**:
```javascript
socket.on('yjs:update', (update) => {
  Y.applyUpdate(ydoc, update);
});

socket.emit('yjs:update', Y.encodeStateAsUpdate(ydoc));
```

**Effort**: ~2 weeks (complex, needs Y.js learning curve)

---

### 6.2 Offline-First IndexedDB Sync

**Features**:
- 💾 Save edits to IndexedDB when offline
- 🔄 Auto-sync when connection restored
- ⚠️ Conflict resolution UI (if needed)

**Effort**: ~1 week

---

## 📊 Timeline Summary

| Phase | Duration | Status | Blocked By |
|-------|----------|--------|------------|
| **Phase 1**: MVP | ✅ Done | Complete | - |
| **Phase 2**: Lock Awareness | 2-3 days | 🟡 Ready | BE-001.3 |
| **Phase 3**: Hierarchical Resources | 3-4 days | ⏳ Waiting | Backend API |
| **Phase 4**: LitElement Refactor | 1 week | 📅 Planned | Phase 2 complete |
| **Phase 5**: UI Polish | 1 week | 📅 Planned | Phase 4 complete |
| **Phase 6**: Y.js CRDT | 2 weeks | ⏳ Waiting | BE-001.4 |

**Total Estimated Time**: ~6-7 weeks (excluding backend wait time)

---

## 🎯 Immediate Next Steps (This Week)

### Priority 1: Multi-Editor Warning (No Backend Dependency)
- [ ] Add conflict warning banner to UI
- [ ] Red badge for conflicting editors
- [ ] Test with 2+ tabs as editors

**Assignee**: UI Team  
**Effort**: ~2 hours  
**Status**: Ready to start

---

### Priority 2: Lock Status UI (Waiting for BE-001.3)
- [ ] Design lock indicator component
- [ ] Prepare event handlers (lock:acquired, lock:denied, etc.)
- [ ] Create CSS for lock badges

**Assignee**: UI Team  
**Effort**: ~1 day  
**Status**: Blocked by backend

---

### Priority 3: Commit Documentation
- [ ] Commit `UI_FEEDBACK_FOR_BACKEND.md`
- [ ] Commit `UI_ROADMAP.md`
- [ ] Update main `README.md` with roadmap link

**Assignee**: UI Team Lead  
**Effort**: ~15 minutes  
**Status**: Ready

---

## 🔗 Dependencies

### Backend Team Deliverables

| Feature | Epic | Expected | Critical for UI |
|---------|------|----------|-----------------|
| Distributed Locks | BE-001.3 | Week 3-4 | ✅ YES (Phase 2) |
| Hierarchical Resources | BE-001.3+ | Week 4 | ✅ YES (Phase 3) |
| Y.js CRDT Sync | BE-001.4 | Week 4-6 | ⚠️ OPTIONAL (Phase 6) |
| RabbitMQ Broadcasting | BE-001.5 | Week 5-6 | ❌ NO (scalability) |

**Critical Path**: BE-001.3 must complete before UI Phase 2-3

---

## 📝 Technical Debt

### Known Issues (Low Priority)

1. **Test coverage**: No automated E2E tests yet
   - **Fix**: Add Playwright tests in Phase 4
   - **Effort**: ~3 days

2. **Accessibility**: ARIA labels incomplete
   - **Fix**: Full keyboard navigation + screen reader testing
   - **Effort**: ~2 days

3. **Responsive design**: Mobile layout not optimized
   - **Fix**: Media queries for <768px screens
   - **Effort**: ~1 day

4. **Internationalization**: English only
   - **Fix**: i18n library (if needed for healthcare compliance)
   - **Effort**: ~1 week

---

## 🚀 Future Enhancements (Post-v1.0)

- 🎥 WebRTC video presence (video chat while editing)
- 📊 Analytics dashboard (edit time, conflicts, lock contention)
- 🔔 Push notifications (mobile app integration)
- 🤖 AI-powered suggestions (autocomplete, error detection)
- 🔐 Audit trail viewer (who changed what, when)

---

## 📞 Contact

**Questions or feedback?**  
- UI Team Lead: [Your Name]
- Backend Team Lead: [Backend Lead]
- Project Manager: [PM Name]

**Slack Channels**:  
- `#ui-development`
- `#backend-websocket`
- `#collabornest-general`

---

**Next Review**: After BE-001.3 completion  
**Last Updated**: November 16, 2025, 22:00
