# CollaborNest - Design Interfaccia di Test

**Sistema di Testing WebSocket per Collaborazione Real-Time su Documenti**

---

## 🎯 Obiettivo

Creare un'interfaccia di test che permetta di:

1. **Simulare più utenti** contemporaneamente (User A, User B, User C...)
2. **Vedere in tempo reale** chi è connesso a quali documenti
3. **Monitorare eventi WebSocket** (join, leave, editing, viewing)
4. **Testare i 5 referti medici** con presenza utenti in tempo reale
5. **Visualizzare metriche globali** di sistema

---

## 📐 Struttura Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                    🔍 DEBUG SECTION                             │
│              MONITORING SOCKET METRICS                          │
│  ┌──────────┬──────────┬──────────┬──────────┐                │
│  │   👥 4   │   📄 3   │  ⚡ 127  │  📡 45ms │                │
│  │Connected │ Active   │  Events  │ Latency  │                │
│  │  Users   │Documents │  Total   │   Avg    │                │
│  └──────────┴──────────┴──────────┴──────────┘                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  👥 USER PANELS                            [+ Add New User]     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🟢 User A - Dr. Rossi (dr.rossi@hospital.it)    [🗑️]    │ │
│  ├───────────────────────────────────────────────────────────┤ │
│  │  🔑 JWT: [Generate JWT]  ✅ Connected (socket-abc123)     │ │
│  │                                                            │ │
│  │  📋 Current Activity:                                      │ │
│  │  └─ 📄 Referto MR-2024-001 › 📝 Note Chirurgiche (Editor) │ │
│  │                                                            │ │
│  │  ⚡ Mini Event Log:                                        │ │
│  │  [20:15:32] 🟢 CONNECTED                                   │ │
│  │  [20:15:45] 📘 JOINED document:surgical-notes              │ │
│  │  [20:16:12] 👤 USER_JOINED: Dr. Bianchi (viewer)          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │ 🟢 User B - Dr. Bianchi (...)                     [🗑️]    │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  📚 MEDICAL REPORTS (5 Referti) - Real-Time Presence View      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  [Dettagli sotto]                                               │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔍 SEZIONE 1: DEBUG MONITORING (Top Bar)

### Layout

Barra orizzontale con **4 metriche principali** in card compatte

### Metriche

1. **👥 Connected Users**
   - Numero: Quanti utenti simulati sono attualmente connessi
   - Colore: Blu
   - Icona: Users

2. **📄 Active Documents**
   - Numero: Quanti documenti hanno almeno 1 utente connesso
   - Colore: Verde
   - Icona: FileText

3. **⚡ Total Events**
   - Numero: Contatore eventi WebSocket totali
   - Colore: Viola
   - Icona: Zap

4. **📡 Avg Latency**
   - Numero: Latenza media WebSocket in ms
   - Colore: Arancione
   - Icona: Activity

### Visual Design

- Background: Bianco con bordo superiore blu (4px)
- Shadow: Leggera ombra
- Card metriche: Background colorato chiaro (es. bg-blue-50), bordo colorato
- Font numeri: Bold, 32px
- Font label: Regular, 12px

---

## 👥 SEZIONE 2: USER PANELS (Pannelli Utenti Espandibili)

### Header Sezione

- Titolo: "User Panels"
- Pulsante: "[+ Add New User]" (blu, top-right)
- Ogni click crea un nuovo pannello utente

### Singolo Pannello Utente

#### Header Pannello (sempre visibile)

```
┌─────────────────────────────────────────────────────────────┐
│ [▼] 🟢 Dr. Rossi (dr.rossi@hospital.it)  ✅ Connected [🗑️]│
└─────────────────────────────────────────────────────────────┘
```

**Elementi:**

- **[▼]**: Bottone collapse/expand
- **Avatar**: Cerchio colorato con iniziale (generato da nome)
- **Nome**: Input editabile inline
- **Email**: Input editabile inline  
- **Status Badge**:
  - 🟢 Connected (verde) con socketId
  - ⚪ Disconnected (grigio)
- **[🗑️]**: Elimina utente

#### Body Pannello (quando espanso)

**1. Sezione JWT & Connessione**

```
┌─────────────────────────────────────────────────────────────┐
│ 🔑 JWT Token                                                │
│ ┌─────────────────────────────────────┐  [Generate JWT]    │
│ │ eyJhbGc...XVCIsInR5cCI6Ik...        │                    │
│ └─────────────────────────────────────┘                    │
│                                                             │
│ [🔌 Connect]  oppure  [❌ Disconnect]                      │
└─────────────────────────────────────────────────────────────┘
```

**2. Sezione Selezione Risorsa**

```
┌─────────────────────────────────────────────────────────────┐
│ 📄 Select Document/Resource                                 │
│                                                             │
│ [Dropdown: Select Medical Report ▼]                        │
│  • MR-2024-001 - Mario Bianchi - Appendicectomia           │
│  • MR-2024-002 - Laura Verdi - Colecistectomia             │
│  • MR-2024-003 - Giuseppe Neri - Ernia Inguinale           │
│  • MR-2024-004 - Anna Russo - Tiroidectomia                │
│  • MR-2024-005 - Marco Ferrari - Gastrectomia              │
│                                                             │
│ 📑 Select Sub-Resource (Tab)                                │
│  ○ Note Chirurgiche     (document:surgical-notes)          │
│  ○ Dati Paziente        (form:patient-data)                │
│  ○ Steps Procedura      (page:/procedure/steps)            │
│                                                             │
│ Mode: ⦿ Editor  ○ Viewer                                    │
│                                                             │
│ [✅ Join Resource]  [❌ Leave Resource]                     │
└─────────────────────────────────────────────────────────────┘
```

**3. Sezione Current Activity**

```
┌─────────────────────────────────────────────────────────────┐
│ 📋 Current Activity                                         │
│                                                             │
│ ✅ Connected to: MR-2024-001 › Note Chirurgiche            │
│ Mode: ✏️ Editor                                             │
│ Joined at: 20:15:32                                         │
│                                                             │
│ 👥 Other users in this resource (2):                       │
│  • Dr. Bianchi (👁️ viewer) - joined 3 min ago             │
│  • Dr. Verdi (✏️ editor) - joined 1 min ago                │
└─────────────────────────────────────────────────────────────┘
```

**4. Mini Event Log (ultimi 5 eventi)**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚡ Event Log (last 5)                          [Clear Log]  │
│                                                             │
│ [20:16:12] 🟡 USER_JOINED                                   │
│  └─ Dr. Verdi joined as editor                             │
│                                                             │
│ [20:15:45] 🔵 RESOURCE_JOINED                               │
│  └─ document:surgical-notes (2 users active)               │
│                                                             │
│ [20:15:32] 🟢 CONNECT                                       │
│  └─ socketId: socket-abc123xyz                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 SEZIONE 3: MEDICAL REPORTS (Vista Referti con Presenza Real-Time)

### Lista Referti (5 Card)

Ogni referto mostra:

1. Info referto
2. Quanti utenti sono connessi
3. Chi sta facendo cosa (viewer/editor)
4. In quale sottorisorsa (tab)

```
┌─────────────────────────────────────────────────────────────────┐
│  📚 MEDICAL REPORTS - Real-Time Collaboration Status           │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 📄 MR-2024-001 - Mario Bianchi                 [Details ▼]│ │
│  │ Procedura: Appendicectomia | Data: 16/11/2024              │ │
│  │                                                            │ │
│  │ 👥 Active Users (3):                                       │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ ✏️ Dr. Rossi (Editor)                                │  │ │
│  │  │    └─ 📝 Note Chirurgiche                            │  │ │
│  │  │    └─ Joined 5 min ago                               │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ 👁️ Dr. Bianchi (Viewer)                             │  │ │
│  │  │    └─ 📝 Note Chirurgiche                            │  │ │
│  │  │    └─ Joined 3 min ago                               │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ ✏️ Dr. Verdi (Editor)                                │  │ │
│  │  │    └─ 📋 Dati Paziente                               │  │ │
│  │  │    └─ Joined 1 min ago                               │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  │                                                            │ │
│  │ 📑 Sub-Resources Status:                                   │ │
│  │  • 📝 Note Chirurgiche: 2 users (1 editor, 1 viewer)      │ │
│  │  • 📋 Dati Paziente: 1 user (1 editor)                    │ │
│  │  • 📄 Steps Procedura: 0 users                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 📄 MR-2024-002 - Laura Verdi                   [Details ▼]│ │
│  │ Procedura: Colecistectomia | Data: 15/11/2024              │ │
│  │ 👥 Active Users (0)                                        │ │
│  │ 💤 No users currently connected                            │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ 📄 MR-2024-003 - Giuseppe Neri                 [Details ▼]│ │
│  │ Procedura: Ernia Inguinale | Data: 15/11/2024              │ │
│  │ 👥 Active Users (1)                                        │ │
│  │  ┌─────────────────────────────────────────────────────┐  │ │
│  │  │ 👁️ Dr. Neri (Viewer)                                │  │ │
│  │  │    └─ 📝 Note Chirurgiche                            │  │ │
│  │  └─────────────────────────────────────────────────────┘  │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  [... Altri 2 referti ...]                                      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Visual Design Referti

**Card Referto States:**

- **Nessun utente**: Grigio chiaro, icona 💤
- **1+ viewers**: Azzurro chiaro, icona 👁️
- **1+ editors**: Verde chiaro con bordo verde, icona ✏️
- **Conflict (2+ editors)**: Arancione con bordo arancione, icona ⚠️

**User Badge:**

- Editor: Background viola chiaro, bordo viola, icona ✏️
- Viewer: Background azzurro chiaro, bordo azzurro, icona 👁️

**Sub-Resource Indicators:**

- Badge piccolo con conteggio
- Esempio: `📝 Note Chirurgiche: 2 users (1 ✏️, 1 👁️)`

---

## 🎨 Color Palette

### Status Colors

- **Connected**: `#4CAF50` (Verde)
- **Disconnected**: `#9E9E9E` (Grigio)
- **Editor Mode**: `#9C27B0` (Viola)
- **Viewer Mode**: `#00BCD4` (Azzurro)
- **Warning/Conflict**: `#FF9800` (Arancione)
- **Error**: `#F44336` (Rosso)

### UI Elements

- **Primary**: `#2196F3` (Blu)
- **Background**: `#FAFAFA` (Grigio chiaro)
- **Card Background**: `#FFFFFF` (Bianco)
- **Border**: `#E0E0E0` (Grigio bordi)
- **Text Primary**: `#212121` (Nero)
- **Text Secondary**: `#757575` (Grigio)

### Event Types

- **CONNECT**: Verde `#4CAF50`
- **DISCONNECT**: Rosso `#F44336`
- **RESOURCE_JOINED**: Blu `#2196F3`
- **USER_JOINED**: Viola `#9C27B0`
- **USER_LEFT**: Arancione `#FF9800`

---

## 📱 Responsive Behavior

### Desktop (>1200px)

- Debug metrics: 4 colonne orizzontali
- User panels: Lista verticale, 1 pannello per riga
- Medical reports: 2 colonne (2 referti per riga)

### Tablet (768px - 1200px)

- Debug metrics: 2×2 grid
- User panels: Lista verticale, 1 pannello per riga
- Medical reports: 1 colonna (1 referto per riga)

### Mobile (<768px)

- Debug metrics: 2×2 grid compatta
- User panels: Collapsati di default (solo header visibile)
- Medical reports: 1 colonna, collapsati di default

---

## 🔄 Interazioni Real-Time

### Quando User A si connette a un documento

1. ✅ Panel User A: Status diventa "Connected"
2. ✅ Panel User A: Event log mostra "CONNECT"
3. ✅ Debug metrics: "Connected Users" +1

### Quando User A fa join su "MR-2024-001 › Note Chirurgiche"

1. ✅ Panel User A: Current Activity mostra risorsa attiva
2. ✅ Panel User A: Event log mostra "RESOURCE_JOINED"
3. ✅ Debug metrics: "Active Documents" +1
4. ✅ Medical Reports: Card MR-2024-001 mostra User A nella lista
5. ✅ Se User B è già in quella risorsa: Panel User B riceve "USER_JOINED"

### Quando User B fa join sulla stessa risorsa

1. ✅ Panel User A: Event log mostra "USER_JOINED: User B"
2. ✅ Panel User A: Current Activity mostra "Other users (1): User B"
3. ✅ Panel User B: Event log mostra "RESOURCE_JOINED" + lista utenti
4. ✅ Medical Reports: Card MR-2024-001 mostra sia User A che User B

### Quando User A lascia la risorsa

1. ✅ Panel User A: Current Activity torna vuoto
2. ✅ Panel User A: Event log mostra "RESOURCE_LEFT"
3. ✅ Panel User B: Event log mostra "USER_LEFT: User A"
4. ✅ Medical Reports: Card MR-2024-001 rimuove User A dalla lista

---

## 🎭 Scenari di Test Supportati

### Scenario 1: Utente Singolo

- Aggiungi User A
- Genera JWT
- Connetti
- Join su MR-2024-001 › Note Chirurgiche (Editor)
- Verifica presenza nella card referto
- Leave
- Disconnect

### Scenario 2: Due Utenti Stesso Documento

- User A: Join su MR-2024-001 › Note Chirurgiche (Editor)
- User B: Join su MR-2024-001 › Note Chirurgiche (Viewer)
- Entrambi vedono l'altro nella lista "Other users"
- Card MR-2024-001 mostra 2 utenti attivi

### Scenario 3: Due Utenti Sottorisorse Diverse

- User A: Join su MR-2024-001 › Note Chirurgiche (Editor)
- User B: Join su MR-2024-001 › Dati Paziente (Editor)
- Card MR-2024-001 mostra 2 utenti ma in tab diverse
- Status mostra: "Note Chirurgiche: 1 user", "Dati Paziente: 1 user"

### Scenario 4: Conflitto Editing (2+ Editor)

- User A: Join su MR-2024-001 › Note Chirurgiche (Editor)
- User B: Join su MR-2024-001 › Note Chirurgiche (Editor)
- Card MR-2024-001 mostra warning ⚠️ (2 editors sulla stessa risorsa)
- Badge arancione "Conflict: 2 editors"

### Scenario 5: Multi-Document Multi-User

- User A → MR-2024-001 › Note Chirurgiche
- User B → MR-2024-002 › Dati Paziente
- User C → MR-2024-001 › Steps Procedura
- User D → MR-2024-003 › Note Chirurgiche
- Debug metrics: "Active Documents: 3"
- Ogni referto mostra i propri utenti attivi

---

## 🛠️ Note Implementative (per Developer)

### API REST (da fornire)

L'interfaccia utilizzerà chiamate REST per:

- `GET /api/reports` - Ottenere lista dei 5 referti medici
- `GET /api/reports/:id` - Dettagli referto singolo
- `GET /api/reports/:id/resources` - Lista sottorisorse (tab) del referto
- Eventualmente CRUD per creare/modificare referti di test

### WebSocket Events

L'interfaccia monitorerà:

- `connect` / `disconnect`
- `resource:join` / `resource:joined`
- `resource:leave` / `resource:left`
- `user:joined` / `user:left`
- `connect_error`

### State Management

- Lista utenti simulati (array)
- Per ogni utente: {id, username, email, jwt, connected, socketId, currentResource, mode, eventLog}
- Lista referti (fetched da API REST)
- Global metrics (calcolati in tempo reale)

---

## ✅ Checklist Design

- [ ] Layout wireframe generale
- [ ] Design debug metrics bar
- [ ] Design user panel (collapsed/expanded)
- [ ] Design JWT generation flow
- [ ] Design resource selection interface
- [ ] Design "Current Activity" section
- [ ] Design mini event log per utente
- [ ] Design medical reports cards
- [ ] Design user presence badges
- [ ] Design conflict warning states
- [ ] Design responsive breakpoints
- [ ] Design color system & tokens
- [ ] Design icons set
- [ ] Prototype real-time animations (user join/leave)

---

**Fine del Documento di Design**

*Questo documento fornisce una visione completa dell'interfaccia di test. Il prossimo step è creare wireframe visuali o prototipi interattivi (Figma/Sketch).*
