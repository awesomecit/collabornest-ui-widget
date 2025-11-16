# Architettura del Resource Widget

Il sistema è progettato come **microfrontend modulare** integrabile ovunque grazie ai Web Components.

## Componenti principali

### 1. ResourceWidget (Custom Element)

Gestisce:

- tabs
- presence
- locking
- stato online/offline
- viewer/editor
- integrazione Y.js
- rendering UI

### 2. Adapters (Backend-agnostic)

Gli adapter astraggono i servizi esterni:

- **PresenceAdapter**
- **LockingAdapter**
- **YjsProvider**

Questo permette di utilizzare:

- WebSocket
- REST / RPC
- WebRTC
- Providers custom

### 3. CRDT Engine (Y.js)

Ogni tab utilizza:

```
ydoc.getText("tab:<id>:text")
```

### 4. Offline-first

- IndexedDB sync
- Merge automatico tramite CRDT
- Ripristino dopo disconnessione

