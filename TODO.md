# 🗺️ CollaborNest UI - Roadmap Viewer Mode & Presenza Real-Time

> **Guida completa per Junior Developer UI**  
> Implementazione sistema di presenza, viewer mode e monitoraggio WebSocket

---

## 📋 Indice

1. [Overview](#overview)
2. [Epic 1: Connessione e Autenticazione](#epic-1-connessione-e-autenticazione)
3. [Epic 2: Presenza in Modalità Viewer](#epic-2-presenza-in-modalità-viewer)
4. [Epic 3: Gestione Risorse e Sub-Risorse](#epic-3-gestione-risorse-e-sub-risorse)
5. [Epic 4: Monitoraggio e Logging](#epic-4-monitoraggio-e-logging)
6. [Epic 5: Gestione Multi-Utente](#epic-5-gestione-multi-utente)
7. [Riferimenti Tecnici](#riferimenti-tecnici)

---

## Overview

### 🎯 Obiettivo

Implementare un'interfaccia Web Component (LitElement) per la gestione della presenza real-time in modalità **viewer**, con supporto completo per:

- Connessione WebSocket autenticata
- Join/Leave su risorse e sub-risorse
- Visualizzazione presenza altri utenti (editor/viewer)
- Monitoraggio eventi e logging console dettagliato
- Gestione errori e riconnessione

### 🏗️ Architettura

```
┌─────────────────────────────────────────────────────┐
│         CollaborNest WebSocket Gateway             │
│         (Backend già operativo)                     │
└─────────────────────────────────────────────────────┘
                        ↕ Socket.IO
┌─────────────────────────────────────────────────────┐
│    <presence-viewer-widget>                         │
│    (Web Component - DA IMPLEMENTARE)                │
│                                                      │
│    ├─ Connection Manager                            │
│    ├─ Resource Manager                              │
│    ├─ Presence Tracker                              │
│    └─ Event Logger                                  │
└─────────────────────────────────────────────────────┘
```

### 🔗 Repository Disponibili

- **Backend**: WebSocket Gateway con test BDD completi
- **UI Widget**: Repository in creazione (questo documento è la guida)

---

## Epic 1: Connessione e Autenticazione

### 📌 User Story

> **Come** viewer/editor  
> **Voglio** connettermi al WebSocket Gateway in modo sicuro  
> **Per** partecipare alla collaborazione real-time

### ✅ Task 1.1: Setup Socket.IO Client

**Checklist**:

- [ ] Installa `socket.io-client` tramite npm
- [ ] Crea file `src/lib/socket-manager.ts`
- [ ] Configura connessione con path `/ws/socket.io`
- [ ] Configura namespace `/collaboration`
- [ ] Imposta transport: `['websocket', 'polling']`

**Codice di riferimento**:

```typescript
import { io, Socket } from 'socket.io-client';

export class SocketManager {
  private socket: Socket | null = null;

  connect(jwtToken: string): void {
    this.socket = io('http://localhost:3000/collaboration', {
      path: '/ws/socket.io',
      auth: { token: jwtToken },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5
    });

    console.log('🔌 [SOCKET] Connecting...', { 
      namespace: '/collaboration', 
      transport: 'websocket' 
    });
  }
}
```

**Scenari BDD**:

```gherkin
Scenario: Connessione con JWT valido
  Given ho un JWT token valido
  When mi connetto al WebSocket Gateway
  Then ricevo l'evento "connected"
  And il socketId è presente nei dati
  And lo status è "connected"
  And vedo in console: "🔌 [SOCKET] Connecting..."
  And vedo in console: "✅ [SOCKET] Connected - socketId: xxx"

Scenario: Connessione con JWT scaduto
  Given ho un JWT token scaduto
  When mi connetto al WebSocket Gateway
  Then ricevo l'evento "connect_error"
  And il messaggio contiene "Token expired"
  And lo status rimane "disconnected"
  And vedo in console: "❌ [AUTH] JWT expired"

Scenario: Connessione senza JWT
  Given non fornisco alcun token
  When mi connetto al WebSocket Gateway
  Then ricevo l'evento "connect_error"
  And il messaggio contiene "Authentication required"
  And vedo in console: "❌ [AUTH] No token provided"
```

### ✅ Task 1.2: Gestione Eventi di Connessione

**Checklist**:

- [ ] Implementa listener `connect`
- [ ] Implementa listener `connect_error`
- [ ] Implementa listener `disconnect`
- [ ] Implementa listener `reconnect`
- [ ] Gestisci stato connessione in proprietà reattiva

**Codice di riferimento**:

```typescript
private setupConnectionListeners(): void {
  this.socket?.on('connect', () => {
    console.log('✅ [SOCKET] Connected', {
      socketId: this.socket?.id,
      timestamp: new Date().toISOString()
    });
    this.connectionStatus = 'connected';
    this.dispatchEvent(new CustomEvent('connection-changed', {
      detail: { status: 'connected', socketId: this.socket?.id }
    }));
  });

  this.socket?.on('connect_error', (error) => {
    console.error('❌ [SOCKET] Connection error', {
      message: error.message,
      timestamp: new Date().toISOString()
    });
    this.connectionStatus = 'error';
    this.dispatchEvent(new CustomEvent('connection-error', {
      detail: { error: error.message }
    }));
  });

  this.socket?.on('disconnect', (reason) => {
    console.warn('🔌 [SOCKET] Disconnected', {
      reason,
      timestamp: new Date().toISOString()
    });
    this.connectionStatus = 'disconnected';
  });
}
```

**Scenari BDD**:

```gherkin
Scenario: Riconnessione automatica dopo disconnessione
  Given sono connesso al WebSocket
  When il server si disconnette
  Then il client tenta la riconnessione automatica
  And vedo in console: "🔄 [SOCKET] Reconnecting... (attempt 1/5)"
  And dopo 1 secondo ricevo "connected"
  And vedo in console: "✅ [SOCKET] Reconnected"

Scenario: Notifica di disconnessione server
  Given sono connesso al WebSocket
  When ricevo l'evento "SERVER_SHUTDOWN"
  Then vedo in console: "⚠️ [SERVER] Shutdown - Server in manutenzione"
  And l'UI mostra "Server in manutenzione, riconnessione in corso..."
```

---

## Epic 2: Presenza in Modalità Viewer

### 📌 User Story

> **Come** viewer  
> **Voglio** entrare in una risorsa senza permessi di editing  
> **Per** visualizzare il lavoro di altri senza interferire

### ✅ Task 2.1: Join Risorsa come Viewer

**Checklist**:

- [ ] Crea metodo `joinResource(resourceId, mode='viewer')`
- [ ] Emetti evento `resource:join` con payload corretto
- [ ] Ascolta risposta `resource:joined`
- [ ] Gestisci successo (ricevi lista utenti presenti)
- [ ] Gestisci fallimento (mostra errore)

**Codice di riferimento**:

```typescript
joinResource(resourceId: string, mode: 'viewer' | 'editor' = 'viewer'): void {
  console.log('📥 [RESOURCE] Joining...', { 
    resourceId, 
    mode,
    timestamp: new Date().toISOString() 
  });

  this.socket?.emit('resource:join', { resourceId, mode });
}

private setupResourceListeners(): void {
  this.socket?.on('resource:joined', (data) => {
    if (data.success) {
      console.log('✅ [RESOURCE] Joined successfully', {
        resourceId: data.resourceId,
        userId: data.userId,
        mode: this.currentMode,
        joinedAt: data.joinedAt,
        existingUsers: data.users.length
      });

      console.table(data.users.map(u => ({
        Username: u.username,
        Mode: u.mode,
        JoinedAt: new Date(u.joinedAt).toLocaleTimeString()
      })));

      this.currentResourceId = data.resourceId;
      this.activeUsers = data.users;
      this.dispatchEvent(new CustomEvent('resource-joined', {
        detail: { resourceId: data.resourceId, users: data.users }
      }));
    } else {
      console.error('❌ [RESOURCE] Join failed', {
        message: data.message
      });
    }
  });
}
```

**Scenari BDD**:

```gherkin
Scenario: Join come viewer su risorsa vuota
  Given sono connesso al WebSocket
  When emetto "resource:join" con mode="viewer" su "document:123"
  Then ricevo "resource:joined" con success=true
  And users è un array vuoto
  And vedo in console: "✅ [RESOURCE] Joined successfully"
  And vedo in console table con 0 utenti

Scenario: Join come viewer su risorsa con 2 editor
  Given sono connesso al WebSocket
  And 2 editor sono già in "document:123"
  When emetto "resource:join" con mode="viewer"
  Then ricevo "resource:joined" con success=true
  And users contiene 2 elementi con mode="editor"
  And vedo in console table:
    | Username   | Mode   | JoinedAt  |
    | Dr. Rossi  | editor | 20:15:32  |
    | Dr. Verdi  | editor | 20:16:45  |

Scenario: Join duplicato sulla stessa risorsa
  Given sono connesso e ho già fatto join su "document:123"
  When emetto di nuovo "resource:join" su "document:123"
  Then ricevo "resource:joined" con success=false
  And message="You have already joined this resource."
  And vedo in console: "❌ [RESOURCE] Join failed - Already joined"
```

### ✅ Task 2.2: Leave Risorsa

**Checklist**:

- [ ] Crea metodo `leaveResource(resourceId)`
- [ ] Emetti evento `resource:leave`
- [ ] Ascolta risposta `resource:left`
- [ ] Pulisci stato locale (currentResourceId, activeUsers)
- [ ] Log completo dell'operazione

**Codice di riferimento**:

```typescript
leaveResource(resourceId: string): void {
  console.log('📤 [RESOURCE] Leaving...', { 
    resourceId,
    timestamp: new Date().toISOString() 
  });

  this.socket?.emit('resource:leave', { resourceId });
}

private setupResourceListeners(): void {
  this.socket?.on('resource:left', (data) => {
    if (data.success) {
      console.log('✅ [RESOURCE] Left successfully', {
        resourceId: data.resourceId,
        userId: data.userId
      });

      this.currentResourceId = null;
      this.activeUsers = [];
      this.dispatchEvent(new CustomEvent('resource-left', {
        detail: { resourceId: data.resourceId }
      }));
    } else {
      console.warn('⚠️ [RESOURCE] Leave failed', {
        message: data.message
      });
    }
  });
}
```

**Scenari BDD**:

```gherkin
Scenario: Leave risorsa attiva
  Given sono in "document:123" come viewer
  When emetto "resource:leave"
  Then ricevo "resource:left" con success=true
  And currentResourceId diventa null
  And activeUsers diventa array vuoto
  And vedo in console: "✅ [RESOURCE] Left successfully"

Scenario: Leave risorsa non attiva
  Given NON sono in alcuna risorsa
  When emetto "resource:leave" su "document:999"
  Then ricevo "resource:left" con success=false
  And message="You are not in this resource. Cannot leave."
  And vedo in console: "⚠️ [RESOURCE] Leave failed - Not in resource"
```

---

## Epic 3: Gestione Risorse e Sub-Risorse

### 📌 User Story

> **Come** viewer/editor  
> **Voglio** navigare tra tab/sezioni dello stesso documento  
> **Per** seguire il lavoro su diverse parti del referto medico

### ✅ Task 3.1: Join su Sub-Risorsa

**Checklist**:

- [ ] Supporta formato `resourceId` con sub-path: `"document:123/surgical-notes"`
- [ ] Gestisci cambio tra sub-risorse senza leave della risorsa principale
- [ ] Traccia sub-risorsa attiva in proprietà separata
- [ ] Log distingue risorsa da sub-risorsa

**Codice di riferimento**:

```typescript
interface ResourceContext {
  mainResourceId: string;      // "document:123"
  subResourceId?: string;       // "surgical-notes" | "patient-data"
  fullResourceId: string;       // "document:123/surgical-notes"
  mode: 'viewer' | 'editor';
}

joinSubResource(mainResourceId: string, subPath: string, mode: 'viewer'): void {
  const fullResourceId = `${mainResourceId}/${subPath}`;
  
  console.log('📑 [SUB-RESOURCE] Joining...', {
    mainResourceId,
    subResourceId: subPath,
    fullResourceId,
    mode,
    timestamp: new Date().toISOString()
  });

  this.socket?.emit('resource:join', { 
    resourceId: fullResourceId, 
    mode 
  });

  this.currentContext = {
    mainResourceId,
    subResourceId: subPath,
    fullResourceId,
    mode
  };
}
```

**Scenari BDD**:

```gherkin
Scenario: Navigazione tra tab dello stesso documento
  Given sono viewer in "document:123/surgical-notes"
  When faccio join su "document:123/patient-data"
  Then lascio automaticamente "surgical-notes"
  And entro in "patient-data"
  And vedo in console: "📤 [RESOURCE] Leaving surgical-notes"
  And vedo in console: "📑 [SUB-RESOURCE] Joining patient-data"

Scenario: Presenza utenti su sub-risorse diverse
  Given User A è editor in "document:123/surgical-notes"
  And User B è editor in "document:123/patient-data"
  When User C entra come viewer in "document:123/surgical-notes"
  Then User C vede solo User A nella lista utenti
  And User C NON vede User B (è in altra sub-risorsa)
  And vedo in console table:
    | Username  | Mode   | SubResource     |
    | Dr. Rossi | editor | surgical-notes  |
```

### ✅ Task 3.2: Tracking Presenza Multi-Sub-Risorsa

**Checklist**:

- [ ] Mantieni mappa `subResourceUsers: Map<string, User[]>`
- [ ] Aggiorna mappa quando ricevi `user:joined` / `user:left`
- [ ] Mostra badge "Altre sezioni: 2 utenti" se ci sono utenti in altre sub-risorse
- [ ] Log completo delle aggregazioni

**Codice di riferimento**:

```typescript
interface SubResourcePresence {
  subResourceId: string;
  users: UserPresence[];
  editorCount: number;
  viewerCount: number;
}

private aggregatePresenceBySubResource(): SubResourcePresence[] {
  const grouped = new Map<string, UserPresence[]>();
  
  this.allUsersInMainResource.forEach(user => {
    const subId = user.currentSubResource || 'main';
    if (!grouped.has(subId)) {
      grouped.set(subId, []);
    }
    grouped.get(subId)!.push(user);
  });

  const aggregated = Array.from(grouped.entries()).map(([subId, users]) => ({
    subResourceId: subId,
    users,
    editorCount: users.filter(u => u.mode === 'editor').length,
    viewerCount: users.filter(u => u.mode === 'viewer').length
  }));

  console.log('📊 [PRESENCE] Sub-resource aggregation', {
    mainResourceId: this.currentContext?.mainResourceId,
    subResources: aggregated.length,
    totalUsers: this.allUsersInMainResource.length
  });

  console.table(aggregated.map(a => ({
    SubResource: a.subResourceId,
    Editors: a.editorCount,
    Viewers: a.viewerCount,
    Total: a.users.length
  })));

  return aggregated;
}
```

**Scenari BDD**:

```gherkin
Scenario: Aggregazione presenza su documento con 3 sub-risorse
  Given "document:123" ha 3 sub-risorse:
    | SubResource    | Editors | Viewers |
    | surgical-notes | 2       | 1       |
    | patient-data   | 1       | 3       |
    | procedure-steps| 0       | 2       |
  When calcolo l'aggregazione
  Then vedo in console table con i totali
  And nell'UI mostro badge:
    - "Surgical Notes: 3 utenti (2✏️ 1👁️)"
    - "Patient Data: 4 utenti (1✏️ 3👁️)"
    - "Procedure Steps: 2 utenti (2👁️)"
```

---

## Epic 4: Monitoraggio e Logging

### 📌 User Story

> **Come** developer  
> **Voglio** log dettagliati in console di ogni evento  
> **Per** debuggare problemi e capire il flusso real-time

### ✅ Task 4.1: Logger Strutturato

**Checklist**:

- [ ] Crea classe `PresenceLogger` con metodi per ogni categoria
- [ ] Prefissi emoji: 🔌 Socket, 📥 Resource, 👤 User, ⚠️ Error
- [ ] Timestamp ISO in ogni log
- [ ] Usa `console.table()` per liste utenti
- [ ] Usa `console.group()` per eventi complessi

**Codice di riferimento**:

```typescript
export class PresenceLogger {
  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  static connection(event: 'connect' | 'disconnect' | 'error', data: any): void {
    const emoji = event === 'connect' ? '✅' : event === 'disconnect' ? '🔌' : '❌';
    console.log(`${emoji} [SOCKET] ${event.toUpperCase()}`, {
      ...data,
      timestamp: this.formatTimestamp()
    });
  }

  static resourceJoin(resourceId: string, mode: string, success: boolean, users?: any[]): void {
    if (success) {
      console.log('✅ [RESOURCE] Joined successfully', {
        resourceId,
        mode,
        timestamp: this.formatTimestamp()
      });

      if (users && users.length > 0) {
        console.table(users.map(u => ({
          Username: u.username,
          Mode: u.mode === 'editor' ? '✏️ Editor' : '👁️ Viewer',
          JoinedAt: new Date(u.joinedAt).toLocaleTimeString()
        })));
      } else {
        console.log('👤 [PRESENCE] No other users in resource');
      }
    } else {
      console.error('❌ [RESOURCE] Join failed', {
        resourceId,
        timestamp: this.formatTimestamp()
      });
    }
  }

  static userEvent(event: 'joined' | 'left', data: any): void {
    const emoji = event === 'joined' ? '👤➕' : '👤➖';
    console.log(`${emoji} [USER] ${event.toUpperCase()}`, {
      username: data.username,
      userId: data.userId,
      mode: data.mode,
      resourceId: data.resourceId,
      timestamp: this.formatTimestamp()
    });
  }

  static presenceSnapshot(users: any[]): void {
    console.group('📊 [PRESENCE] Current snapshot');
    console.log(`Total users: ${users.length}`);
    console.table(users.map(u => ({
      Username: u.username,
      Mode: u.mode === 'editor' ? '✏️ Editor' : '👁️ Viewer',
      Resource: u.currentResource || 'N/A'
    })));
    console.groupEnd();
  }
}
```

**Scenari BDD**:

```gherkin
Scenario: Log completo di un flusso viewer
  Given avvio il widget come viewer
  When eseguo il flusso completo:
    1. Connect
    2. Join "document:123/surgical-notes" 
    3. User B joins
    4. User B leaves
    5. Leave resource
    6. Disconnect
  Then vedo in console (in ordine):
    """
    🔌 [SOCKET] Connecting... { namespace: '/collaboration', transport: 'websocket' }
    ✅ [SOCKET] CONNECT { socketId: 'abc-123', timestamp: '2025-11-17T20:15:32.123Z' }
    📥 [RESOURCE] Joining... { resourceId: 'document:123/surgical-notes', mode: 'viewer' }
    ✅ [RESOURCE] Joined successfully { resourceId: 'document:123/surgical-notes', mode: 'viewer' }
    👤 [PRESENCE] No other users in resource
    👤➕ [USER] JOINED { username: 'Dr. Bianchi', mode: 'editor', resourceId: 'document:123/surgical-notes' }
    👤➖ [USER] LEFT { username: 'Dr. Bianchi', userId: 'user-456' }
    📤 [RESOURCE] Leaving... { resourceId: 'document:123/surgical-notes' }
    ✅ [RESOURCE] Left successfully
    🔌 [SOCKET] DISCONNECT { reason: 'client disconnect' }
    """
```

### ✅ Task 4.2: Metrics Dashboard (Opzionale)

**Checklist**:

- [ ] Conta eventi per tipo (connect, join, user_joined, etc.)
- [ ] Calcola latenza media eventi (se disponibile)
- [ ] Mostra uptime connessione
- [ ] Mostra numero risorse attive

**Codice di riferimento**:

```typescript
interface MetricsDashboard {
  totalConnections: number;
  totalJoins: number;
  totalUserJoined: number;
  totalUserLeft: number;
  averageLatency: number;
  uptimeSeconds: number;
  activeResources: number;
}

class MetricsCollector {
  private metrics: MetricsDashboard = {
    totalConnections: 0,
    totalJoins: 0,
    totalUserJoined: 0,
    totalUserLeft: 0,
    averageLatency: 0,
    uptimeSeconds: 0,
    activeResources: 0
  };

  private connectedAt: Date | null = null;

  onConnect(): void {
    this.metrics.totalConnections++;
    this.connectedAt = new Date();
    console.log('📊 [METRICS] Connection count:', this.metrics.totalConnections);
  }

  onResourceJoin(): void {
    this.metrics.totalJoins++;
    this.metrics.activeResources++;
  }

  onUserJoined(): void {
    this.metrics.totalUserJoined++;
  }

  onUserLeft(): void {
    this.metrics.totalUserLeft++;
  }

  getSnapshot(): MetricsDashboard {
    if (this.connectedAt) {
      const now = new Date();
      this.metrics.uptimeSeconds = Math.floor((now.getTime() - this.connectedAt.getTime()) / 1000);
    }

    console.table([{
      Connections: this.metrics.totalConnections,
      Joins: this.metrics.totalJoins,
      UserJoined: this.metrics.totalUserJoined,
      UserLeft: this.metrics.totalUserLeft,
      Uptime: `${this.metrics.uptimeSeconds}s`,
      ActiveResources: this.metrics.activeResources
    }]);

    return { ...this.metrics };
  }
}
```

---

## Epic 5: Gestione Multi-Utente

### 📌 User Story

> **Come** viewer  
> **Voglio** vedere in tempo reale chi sta lavorando su cosa  
> **Per** coordinarmi con il team senza conflitti

### ✅ Task 5.1: Notifiche User Joined

**Checklist**:

- [ ] Ascolta evento `user:joined`
- [ ] Aggiungi utente alla lista `activeUsers`
- [ ] Mostra badge nell'UI con username e mode
- [ ] Log completo con emoji 👤➕

**Codice di riferimento**:

```typescript
private setupUserListeners(): void {
  this.socket?.on('user:joined', (data) => {
    PresenceLogger.userEvent('joined', data);

    // Aggiungi alla lista locale
    const newUser: UserPresence = {
      userId: data.userId,
      username: data.username,
      email: data.email,
      socketId: data.socketId,
      mode: data.mode,
      joinedAt: data.joinedAt
    };

    this.activeUsers = [...this.activeUsers, newUser];

    // Dispatch evento per UI
    this.dispatchEvent(new CustomEvent('user-joined', {
      detail: { user: newUser, resourceId: data.resourceId }
    }));

    // Mostra snapshot aggiornato
    PresenceLogger.presenceSnapshot(this.activeUsers);
  });
}
```

**Scenari BDD**:

```gherkin
Scenario: Notifica nuovo editor mentre sono viewer
  Given sono viewer in "document:123/surgical-notes"
  And activeUsers è vuoto
  When User B entra come editor
  Then ricevo evento "user:joined" con mode="editor"
  And activeUsers contiene 1 elemento
  And vedo in console: "👤➕ [USER] JOINED { username: 'Dr. Bianchi', mode: 'editor' }"
  And vedo in console table aggiornata con 1 riga

Scenario: Notifica multipla (3 utenti entrano in sequenza)
  Given sono viewer in "document:123"
  When entrano User B, User C, User D
  Then ricevo 3 eventi "user:joined"
  And activeUsers ha lunghezza 3
  And vedo 3 log "👤➕ [USER] JOINED" in console
  And la table finale mostra 3 righe
```

### ✅ Task 5.2: Notifiche User Left

**Checklist**:

- [ ] Ascolta evento `user:left`
- [ ] Rimuovi utente da `activeUsers`
- [ ] Aggiorna UI rimuovendo badge
- [ ] Log con emoji 👤➖
- [ ] Gestisci `reason: 'disconnect'` vs `reason: 'explicit'`

**Codice di riferimento**:

```typescript
this.socket?.on('user:left', (data) => {
  PresenceLogger.userEvent('left', data);

  // Rimuovi dalla lista locale
  this.activeUsers = this.activeUsers.filter(u => u.userId !== data.userId);

  // Dispatch evento per UI
  this.dispatchEvent(new CustomEvent('user-left', {
    detail: { 
      userId: data.userId, 
      username: data.username,
      reason: data.reason,
      resourceId: data.resourceId 
    }
  }));

  // Log speciale se disconnect improvviso
  if (data.reason === 'disconnect') {
    console.warn('⚠️ [USER] Unexpected disconnect', {
      username: data.username,
      userId: data.userId
    });
  }

  PresenceLogger.presenceSnapshot(this.activeUsers);
});
```

**Scenari BDD**:

```gherkin
Scenario: Utente esce esplicitamente (leave)
  Given sono viewer con User B editor nella stessa risorsa
  When User B emette "resource:leave"
  Then ricevo "user:left" con reason="explicit"
  And activeUsers torna a lunghezza 0
  And vedo in console: "👤➖ [USER] LEFT { username: 'Dr. Bianchi', reason: 'explicit' }"

Scenario: Utente si disconnette improvvisamente
  Given sono viewer con User B editor nella stessa risorsa
  When User B chiude il browser (disconnect)
  Then ricevo "user:left" con reason="disconnect"
  And vedo in console: "⚠️ [USER] Unexpected disconnect { username: 'Dr. Bianchi' }"
  And activeUsers torna a lunghezza 0
```

### ✅ Task 5.3: Conflitto Editing (2+ Editor)

**Checklist**:

- [ ] Rileva quando 2+ editor sono nella stessa risorsa
- [ ] Mostra warning badge nell'UI: "⚠️ 2 editors - possibile conflitto"
- [ ] Log warning in console
- [ ] (Opzionale) Suggerisci passaggio a viewer per uno

**Codice di riferimento**:

```typescript
private detectEditingConflict(): boolean {
  const editors = this.activeUsers.filter(u => u.mode === 'editor');
  
  if (editors.length >= 2) {
    console.warn('⚠️ [CONFLICT] Multiple editors detected', {
      resourceId: this.currentResourceId,
      editorCount: editors.length,
      editors: editors.map(e => e.username)
    });

    this.dispatchEvent(new CustomEvent('editing-conflict', {
      detail: { 
        resourceId: this.currentResourceId,
        editors: editors.map(e => e.username)
      }
    }));

    return true;
  }

  return false;
}
```

**Scenari BDD**:

```gherkin
Scenario: Conflitto 2 editor sulla stessa risorsa
  Given sono editor in "document:123/surgical-notes"
  When User B entra come editor sulla stessa risorsa
  Then detectEditingConflict() ritorna true
  And vedo in console: "⚠️ [CONFLICT] Multiple editors detected { editorCount: 2 }"
  And l'UI mostra badge arancione "⚠️ 2 editors"

Scenario: Risoluzione conflitto (editor diventa viewer)
  Given c'è un conflitto con 2 editor
  When User B fa leave e rejoin come viewer
  Then detectEditingConflict() ritorna false
  And il badge warning scompare
  And vedo in console: "✅ [CONFLICT] Resolved - only 1 editor remaining"
```

---

## Riferimenti Tecnici

### 📚 Documentazione Backend

- **WebSocket API**: `backend/docs/UI_TEAM_WEBSOCKET_API.md`
- **BDD Tests**: `backend/scripts/bdd-tests/`
- **Quickstart**: `backend/docs/QUICKSTART.md`

### 🔌 Endpoint WebSocket

```
URL: http://localhost:3000/collaboration
Path: /ws/socket.io
Auth: JWT in auth.token
```

### 📦 Struttura Eventi

```typescript
// CLIENT → SERVER
socket.emit('resource:join', { resourceId: string, mode: 'viewer' | 'editor' });
socket.emit('resource:leave', { resourceId: string });

// SERVER → CLIENT
socket.on('connected', (data) => { socketId, userId, connectedAt });
socket.on('resource:joined', (data) => { success, resourceId, users: [] });
socket.on('resource:left', (data) => { success, resourceId });
socket.on('user:joined', (data) => { userId, username, mode, resourceId });
socket.on('user:left', (data) => { userId, username, reason });
socket.on('connect_error', (error) => { message });
socket.on('disconnect', (reason) => { string });
socket.on('SERVER_SHUTDOWN', (data) => { message });
```

### 🧪 Testing Locale

1. **Avvia Backend**:

   ```bash
   cd backend
   npm run start:dev
   ```

2. **Genera JWT**:

   ```bash
   cd backend
   node scripts/jwt-generator.js
   ```

3. **Usa Widget**:

   ```html
   <presence-viewer-widget
     jwt="eyJhbGc..."
     resource-id="document:123/surgical-notes"
     mode="viewer">
   </presence-viewer-widget>
   ```

### 🎨 LitElement Setup

```typescript
import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('presence-viewer-widget')
export class PresenceViewerWidget extends LitElement {
  @property({ type: String }) jwt = '';
  @property({ type: String, attribute: 'resource-id' }) resourceId = '';
  @property({ type: String }) mode: 'viewer' | 'editor' = 'viewer';

  @state() private connectionStatus: 'disconnected' | 'connected' | 'error' = 'disconnected';
  @state() private activeUsers: UserPresence[] = [];

  // ... implementazione
}
```

---

## 🎯 Checklist Finale

### Funzionalità Core

- [ ] Connessione WebSocket con JWT
- [ ] Gestione eventi connect/disconnect/error
- [ ] Join risorsa come viewer
- [ ] Join risorsa come editor
- [ ] Leave risorsa
- [ ] Notifiche user:joined
- [ ] Notifiche user:left
- [ ] Tracking activeUsers in tempo reale

### Gestione Risorse

- [ ] Join su sub-risorsa (tab/sezione)
- [ ] Navigazione tra sub-risorse
- [ ] Aggregazione presenza per sub-risorsa
- [ ] Badge "Altre sezioni: N utenti"

### Logging e Monitoring

- [ ] Log strutturato con emoji e timestamp
- [ ] console.table() per liste utenti
- [ ] console.group() per eventi complessi
- [ ] Metrics dashboard (opzionale)
- [ ] Snapshot presenza on-demand

### UI e UX

- [ ] Badge utente con username + mode
- [ ] Status indicator (connesso/disconnesso)
- [ ] Warning badge per conflitti editing
- [ ] Lista utenti aggiornata real-time
- [ ] Toast notifications (opzionale)

### Testing

- [ ] Test connessione con JWT valido
- [ ] Test connessione con JWT scaduto
- [ ] Test join/leave risorsa
- [ ] Test notifiche multi-utente
- [ ] Test conflitto 2+ editor
- [ ] Test navigazione sub-risorse
- [ ] Test riconnessione automatica
- [ ] Test tutti i log in console

---

## 📝 Note Finali

- **Widget Linea Guida**: Questa roadmap assume che avrai accesso al widget di riferimento nel repository UI
- **Backend Locale**: Assicurati di avere il backend in esecuzione su `http://localhost:3000`
- **JWT Valido**: Genera sempre un JWT fresco con `node scripts/jwt-generator.js`
- **Console DevTools**: Tieni sempre aperta la console per vedere i log real-time
- **Multi-Tab Testing**: Apri più tab per simulare multi-utente

**Buon lavoro! 🚀**
