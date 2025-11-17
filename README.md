# Resource Wi## Struttura del progetto

- `src/components/` — Web Components (widget + editor Yjs)
- `src/adapters/` — Presence / Locking / CRDT provider
- `src/demo/` — Applicazione demo con LitElement
- `ui/` — Test pages per WebSocket API validation
- `ARCHITECTURE.md` — Documentazione dell'architettura
- `DIAGRAMS.md` — Diagrammi e FSM

## Quick Start - Testing UI

### Complete Reports Test (Multi-User Simulation)

```bash
# Terminal 1: Start JWT Mock Server (Port 3001)
cd ui
node jwt-mock-server.js

# Terminal 2: Start HTTP Server (Port 8081)
cd ui
python3 -m http.server 8081

# Terminal 3: Start Backend (Port 3000)
# From your backend repository
npm run start:dev

# Browser: http://127.0.0.1:8081/complete-reports-test.html
```

### Simple Single Page Test

```bash
# Start HTTP Server
cd ui
python3 -m http.server 8080

# Browser: http://localhost:8080/test-single-page.html
```

📖 **Full Documentation**: `ui/README.md` | `ui/COMPLETE_REPORTS_TEST_GUIDE.md`

## Demo localecrofrontend LitElement

Questo repository contiene un **widget universale** basato su Web Components (LitElement), integrabile in qualsiasi frontend (React, Angular, Svelte, Vue, Vanilla).

## Funzionalità principali

- Presence tracking multi‑utente
- Locking per tab/moduli con semantica standardizzata
- Supporto CRDT tramite **Y.js**
- Offline‑first con IndexedDB
- Microfrontend nativo tramite Custom Elements
- Adapter design pattern per collegare backend personalizzati

## Struttura del progetto

- `src/components/` — Web Components (widget + editor Yjs)
- `src/adapters/` — Presence / Locking / CRDT provider
- `src/demo/` — Applicazione demo con LitElement
- `ARCHITECTURE.md` — Documentazione dell’architettura
- `DIAGRAMS.md` — Diagrammi e FSM

## Demo locale

```bash
npm install
npm run dev
```

Apre la demo su:  
➡️ <http://localhost:5173>
