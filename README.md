# Resource Widget — Microfrontend LitElement

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
➡️ http://localhost:5173
