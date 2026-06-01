# Squadmaker V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first mobile-first Squadmaker V2 web app foundation with git connected, deploy-ready project structure, tested match-day state logic, and a working 3-tab shell.

**Architecture:** Use a small Vite + React + TypeScript app with behavior isolated in pure domain modules and UI kept thin. The first slice creates the project, connects git to the existing GitHub repository on a new `v2-rebuild` branch, implements roster/session primitives with tests, and renders the mobile bottom-tab layout.

**Tech Stack:** Vite, React, TypeScript, Vitest, Testing Library, CSS modules or plain CSS, localStorage, static build output for GitHub Pages / Cloudflare Pages.

---

## File Structure

- `package.json`: scripts and dependencies.
- `vite.config.ts`: Vite config with GitHub Pages-compatible base path.
- `tsconfig.json`, `tsconfig.node.json`: TypeScript configuration.
- `index.html`: app mount point.
- `src/main.tsx`: React entry.
- `src/App.tsx`: top-level app shell and tab routing.
- `src/styles.css`: mobile-first global styling.
- `src/domain/types.ts`: roster, session, player state, team, formation, and quarter types.
- `src/domain/defaultRoster.ts`: built-in player names from the provided image.
- `src/domain/session.ts`: pure functions for attendance, player state, roster editing, and quarter accounting.
- `src/domain/assignment.ts`: pure functions for automatic A/B/bench assignment and goalkeeper priority.
- `src/domain/formations.ts`: formation definitions and mobile pitch positions.
- `src/storage/localStore.ts`: localStorage load/save/reset helpers.
- `src/components/BottomNav.tsx`: bottom tab navigation.
- `src/components/ParticipantsTab.tsx`: roster, attendance, and state actions.
- `src/components/TeamTab.tsx`: team formation board.
- `src/components/PlayerActionSheet.tsx`: mobile bottom sheet for player state changes.
- `src/domain/*.test.ts`: Vitest tests for domain behavior.

---

### Task 1: Git and Project Scaffold

**Files:**
- Create: `package.json`
- Create: `index.html`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tsconfig.node.json`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`

- [ ] **Step 1: Initialize git and connect remote**

Run:

```powershell
git init
git branch -M v2-rebuild
git remote add origin https://github.com/lsi307-create/squadmaker.git
git fetch origin
git status --short
```

Expected: local repo exists, remote fetch succeeds, current branch is `v2-rebuild`.

- [ ] **Step 2: Create Vite React TypeScript package**

Create `package.json`:

```json
{
  "name": "squadmaker-v2",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite --host 127.0.0.1",
    "build": "tsc -b && vite build",
    "preview": "vite preview --host 127.0.0.1",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "@vitejs/plugin-react": "^5.0.0",
    "vite": "^7.0.0",
    "typescript": "^5.8.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "lucide-react": "^0.468.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jsdom": "^25.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 3: Create TypeScript and Vite config**

Create `vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/squadmaker/",
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.ts"
  }
});
```

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["DOM", "DOM.Iterable", "ES2020"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx"
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "composite": true,
    "module": "ESNext",
    "moduleResolution": "Node",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 4: Create app mount and placeholder shell**

Create `index.html`:

```html
<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
    <title>Squadmaker V2</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

Create `src/App.tsx`:

```tsx
export default function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Squadmaker V2</p>
        <h1>경기 당일 스쿼드 관리</h1>
      </header>
      <section className="screen-panel">구현 준비 중</section>
    </main>
  );
}
```

Create `src/styles.css`:

```css
:root {
  color: #eef4ff;
  background: #07111f;
  font-family: Pretendard, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-width: 320px;
  min-height: 100vh;
  background: #07111f;
}

button,
input,
textarea {
  font: inherit;
}

.app-shell {
  min-height: 100vh;
  padding: 18px 16px 96px;
}

.app-header h1 {
  margin: 4px 0 0;
  font-size: 24px;
  line-height: 1.15;
}

.eyebrow {
  margin: 0;
  color: #26e6bf;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0;
}

.screen-panel {
  margin-top: 18px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
  background: #0d1a2b;
}
```

- [ ] **Step 5: Install dependencies**

Run:

```powershell
npm install
```

Expected: `node_modules` and `package-lock.json` are created.

- [ ] **Step 6: Build**

Run:

```powershell
npm run build
```

Expected: TypeScript and Vite build pass.

- [ ] **Step 7: Commit scaffold**

Run:

```powershell
git add .
git commit -m "chore: scaffold squadmaker v2"
```

Expected: first local commit on `v2-rebuild`.

---

### Task 2: Tested Match-Day Domain Model

**Files:**
- Create: `src/test/setup.ts`
- Create: `src/domain/types.ts`
- Create: `src/domain/defaultRoster.ts`
- Create: `src/domain/session.ts`
- Create: `src/domain/session.test.ts`

- [ ] **Step 1: Add test setup**

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 2: Write failing session tests**

Create `src/domain/session.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  createMatchDay,
  markPresent,
  setPlayerStatus,
  finishQuarter
} from "./session";

describe("match-day session", () => {
  it("assigns arrival order when players are marked present", () => {
    let session = createMatchDay(["김은규", "김재윤", "김진우"]);

    session = markPresent(session, "김재윤");
    session = markPresent(session, "김은규");

    expect(session.players["김재윤"].arrivalOrder).toBe(1);
    expect(session.players["김은규"].arrivalOrder).toBe(2);
  });

  it("keeps arrival order when a player is temporarily excluded", () => {
    let session = createMatchDay(["김은규"]);
    session = markPresent(session, "김은규");

    session = setPlayerStatus(session, "김은규", "temporarilyOut");

    expect(session.players["김은규"].status).toBe("temporarilyOut");
    expect(session.players["김은규"].arrivalOrder).toBe(1);
  });

  it("counts goalkeeper quarters separately from field quarters", () => {
    let session = createMatchDay(["김은규", "김재윤", "김진우"]);
    session = markPresent(markPresent(markPresent(session, "김은규"), "김재윤"), "김진우");
    session.assignments = {
      teamA: ["김은규", "김재윤"],
      teamB: ["김진우"],
      bench: [],
      goalkeepers: { A: "김은규", B: "김진우" }
    };

    session = finishQuarter(session);

    expect(session.players["김은규"].fieldQuarters).toBe(0);
    expect(session.players["김은규"].keeperQuarters).toBe(1);
    expect(session.players["김재윤"].fieldQuarters).toBe(1);
    expect(session.players["김재윤"].keeperQuarters).toBe(0);
    expect(session.players["김진우"].nextFieldPriority).toBe(true);
  });
});
```

- [ ] **Step 3: Run tests to verify RED**

Run:

```powershell
npm test -- src/domain/session.test.ts
```

Expected: FAIL because `./session` does not exist.

- [ ] **Step 4: Implement domain types**

Create `src/domain/types.ts`:

```ts
export type PlayerStatus = "roster" | "active" | "temporarilyOut" | "departed";
export type TeamSide = "A" | "B";
export type Formation = "433" | "4231" | "532";

export interface PlayerRecord {
  name: string;
  status: PlayerStatus;
  arrivalOrder: number | null;
  fieldQuarters: number;
  keeperQuarters: number;
  wasKeeperLastQuarter: boolean;
  nextFieldPriority: boolean;
}

export interface TeamAssignments {
  teamA: string[];
  teamB: string[];
  bench: string[];
  goalkeepers: Partial<Record<TeamSide, string>>;
}

export interface MatchDaySession {
  roster: string[];
  players: Record<string, PlayerRecord>;
  currentQuarter: number;
  nextArrivalOrder: number;
  formations: Record<TeamSide, Formation>;
  assignments: TeamAssignments;
}
```

- [ ] **Step 5: Add default roster**

Create `src/domain/defaultRoster.ts`:

```ts
export const defaultRoster = [
  "김은규", "김재윤", "김진우", "최정호", "김성현", "송민철", "김용삼1", "신예찬", "정일욱", "이상철",
  "한승훈", "전현웅", "임영택", "이종민", "성세용", "손은영", "박종호", "방수환", "백기훈", "손다빈",
  "임상엽", "나현준", "김안종", "김명구", "배휘종", "임두환", "이홍범", "조태원", "김향수", "주도영",
  "이상인", "이한국", "이상현", "원지산", "박상균", "김기수", "김종수", "권창진", "최명윤", "최의성",
  "한윤석", "정주현", "심규연", "김병철", "이충신", "한정철", "이찬교", "김상욱", "장경태", "원정훈",
  "김무성", "박경욱", "이승환", "전형진", "장재석", "김용삼2", "최균호", "이한묵", "황지호"
];
```

- [ ] **Step 6: Implement session behavior**

Create `src/domain/session.ts`:

```ts
import type { MatchDaySession, PlayerRecord, PlayerStatus } from "./types";

function createPlayer(name: string): PlayerRecord {
  return {
    name,
    status: "roster",
    arrivalOrder: null,
    fieldQuarters: 0,
    keeperQuarters: 0,
    wasKeeperLastQuarter: false,
    nextFieldPriority: false
  };
}

export function createMatchDay(roster: string[]): MatchDaySession {
  const uniqueRoster = Array.from(new Set(roster.map((name) => name.trim()).filter(Boolean)));

  return {
    roster: uniqueRoster,
    players: Object.fromEntries(uniqueRoster.map((name) => [name, createPlayer(name)])),
    currentQuarter: 1,
    nextArrivalOrder: 1,
    formations: { A: "433", B: "433" },
    assignments: { teamA: [], teamB: [], bench: [], goalkeepers: {} }
  };
}

export function markPresent(session: MatchDaySession, name: string): MatchDaySession {
  const player = session.players[name];
  if (!player || player.status === "active") return session;

  const arrivalOrder = player.arrivalOrder ?? session.nextArrivalOrder;

  return {
    ...session,
    nextArrivalOrder: player.arrivalOrder ? session.nextArrivalOrder : session.nextArrivalOrder + 1,
    players: {
      ...session.players,
      [name]: {
        ...player,
        status: "active",
        arrivalOrder
      }
    }
  };
}

export function setPlayerStatus(
  session: MatchDaySession,
  name: string,
  status: Exclude<PlayerStatus, "roster">
): MatchDaySession {
  const player = session.players[name];
  if (!player) return session;

  return {
    ...session,
    players: {
      ...session.players,
      [name]: {
        ...player,
        status,
        arrivalOrder: player.arrivalOrder ?? session.nextArrivalOrder
      }
    },
    nextArrivalOrder: player.arrivalOrder ? session.nextArrivalOrder : session.nextArrivalOrder + 1
  };
}

export function finishQuarter(session: MatchDaySession): MatchDaySession {
  const keeperNames = new Set(Object.values(session.assignments.goalkeepers).filter(Boolean));
  const fieldNames = [...session.assignments.teamA, ...session.assignments.teamB].filter(
    (name) => !keeperNames.has(name)
  );

  const players = Object.fromEntries(
    Object.entries(session.players).map(([name, player]) => {
      const playedKeeper = keeperNames.has(name);
      const playedField = fieldNames.includes(name);

      return [
        name,
        {
          ...player,
          fieldQuarters: player.fieldQuarters + (playedField ? 1 : 0),
          keeperQuarters: player.keeperQuarters + (playedKeeper ? 1 : 0),
          wasKeeperLastQuarter: playedKeeper,
          nextFieldPriority: playedKeeper
        }
      ];
    })
  );

  return {
    ...session,
    currentQuarter: session.currentQuarter + 1,
    players
  };
}
```

- [ ] **Step 7: Run tests to verify GREEN**

Run:

```powershell
npm test -- src/domain/session.test.ts
```

Expected: PASS.

- [ ] **Step 8: Commit domain model**

Run:

```powershell
git add src/domain src/test package.json package-lock.json vite.config.ts tsconfig.json tsconfig.node.json
git commit -m "feat: add match-day session model"
```

Expected: local commit created.

---

### Task 3: Assignment Logic

**Files:**
- Create: `src/domain/assignment.ts`
- Create: `src/domain/assignment.test.ts`

- [ ] **Step 1: Write failing assignment tests**

Create `src/domain/assignment.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { createMatchDay, markPresent } from "./session";
import { autoAssign } from "./assignment";

describe("autoAssign", () => {
  it("assigns only active players into A, B, and bench", () => {
    let session = createMatchDay(Array.from({ length: 25 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session.players["선수25"].status = "temporarilyOut";

    const assigned = autoAssign(session);

    expect(assigned.assignments.teamA).toHaveLength(11);
    expect(assigned.assignments.teamB).toHaveLength(11);
    expect(assigned.assignments.bench).toHaveLength(2);
    expect([...assigned.assignments.teamA, ...assigned.assignments.teamB, ...assigned.assignments.bench]).not.toContain("선수25");
  });

  it("prioritizes previous goalkeepers for field placement", () => {
    let session = createMatchDay(Array.from({ length: 24 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session.players["선수24"].nextFieldPriority = true;

    const assigned = autoAssign(session);

    expect([...assigned.assignments.teamA, ...assigned.assignments.teamB]).toContain("선수24");
    expect(assigned.assignments.bench).not.toContain("선수24");
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:

```powershell
npm test -- src/domain/assignment.test.ts
```

Expected: FAIL because `./assignment` does not exist.

- [ ] **Step 3: Implement assignment logic**

Create `src/domain/assignment.ts`:

```ts
import type { MatchDaySession, PlayerRecord } from "./types";

function assignmentScore(player: PlayerRecord): number {
  const priorityBoost = player.nextFieldPriority ? -1000 : 0;
  const arrival = player.arrivalOrder ?? 9999;
  return priorityBoost + player.fieldQuarters * 100 + arrival;
}

export function autoAssign(session: MatchDaySession): MatchDaySession {
  const activePlayers = Object.values(session.players)
    .filter((player) => player.status === "active")
    .sort((a, b) => assignmentScore(a) - assignmentScore(b));

  const fieldPlayers = activePlayers.slice(0, 22).map((player) => player.name);
  const teamA = fieldPlayers.filter((_, index) => index % 2 === 0).slice(0, 11);
  const teamB = fieldPlayers.filter((_, index) => index % 2 === 1).slice(0, 11);
  const bench = activePlayers
    .filter((player) => !teamA.includes(player.name) && !teamB.includes(player.name))
    .map((player) => player.name);

  return {
    ...session,
    assignments: {
      ...session.assignments,
      teamA,
      teamB,
      bench,
      goalkeepers: {
        A: teamA[0],
        B: teamB[0]
      }
    }
  };
}
```

- [ ] **Step 4: Run tests to verify GREEN**

Run:

```powershell
npm test -- src/domain/assignment.test.ts src/domain/session.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit assignment logic**

Run:

```powershell
git add src/domain
git commit -m "feat: add automatic team assignment"
```

Expected: local commit created.

---

### Task 4: Mobile App Shell and Participants Tab

**Files:**
- Create: `src/components/BottomNav.tsx`
- Create: `src/components/ParticipantsTab.tsx`
- Create: `src/components/PlayerActionSheet.tsx`
- Modify: `src/App.tsx`
- Modify: `src/styles.css`

- [ ] **Step 1: Create bottom navigation**

Create `src/components/BottomNav.tsx`:

```tsx
import { ClipboardList, Shield, Swords } from "lucide-react";

export type TabKey = "participants" | "teamA" | "teamB";

interface BottomNavProps {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

const tabs = [
  { key: "participants" as const, label: "참여인원", icon: ClipboardList },
  { key: "teamA" as const, label: "A팀", icon: Shield },
  { key: "teamB" as const, label: "B팀", icon: Swords }
];

export function BottomNav({ activeTab, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav" aria-label="주요 화면">
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          className={`bottom-nav__button ${activeTab === key ? "is-active" : ""}`}
          key={key}
          type="button"
          onClick={() => onChange(key)}
        >
          <Icon size={22} aria-hidden="true" />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
```

- [ ] **Step 2: Create player action sheet**

Create `src/components/PlayerActionSheet.tsx`:

```tsx
import type { PlayerStatus } from "../domain/types";

interface PlayerActionSheetProps {
  playerName: string | null;
  onClose: () => void;
  onStatus: (status: Exclude<PlayerStatus, "roster">) => void;
}

export function PlayerActionSheet({ playerName, onClose, onStatus }: PlayerActionSheetProps) {
  if (!playerName) return null;

  return (
    <div className="sheet-backdrop" role="presentation" onClick={onClose}>
      <section className="action-sheet" role="dialog" aria-modal="true" aria-label={`${playerName} 상태 변경`} onClick={(event) => event.stopPropagation()}>
        <div>
          <p className="sheet-label">선수 상태</p>
          <h2>{playerName}</h2>
        </div>
        <button type="button" onClick={() => onStatus("temporarilyOut")}>잠시 제외</button>
        <button type="button" onClick={() => onStatus("active")}>복귀</button>
        <button type="button" onClick={() => onStatus("departed")}>오늘 이탈</button>
        <button className="ghost-button" type="button" onClick={onClose}>닫기</button>
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Create participants tab**

Create `src/components/ParticipantsTab.tsx`:

```tsx
import type { MatchDaySession } from "../domain/types";

interface ParticipantsTabProps {
  session: MatchDaySession;
  onPlayerTap: (name: string) => void;
  onAutoAssign: () => void;
  onFinishQuarter: () => void;
}

const statusLabels = {
  roster: "미출석",
  active: "출석",
  temporarilyOut: "잠시 제외",
  departed: "이탈"
};

export function ParticipantsTab({ session, onPlayerTap, onAutoAssign, onFinishQuarter }: ParticipantsTabProps) {
  const activeCount = Object.values(session.players).filter((player) => player.status === "active").length;

  return (
    <section className="tab-panel">
      <div className="summary-strip">
        <div>
          <span>현재 쿼터</span>
          <strong>{session.currentQuarter}</strong>
        </div>
        <div>
          <span>출석</span>
          <strong>{activeCount}</strong>
        </div>
      </div>
      <div className="quick-actions">
        <button type="button" onClick={onAutoAssign}>자동 배정</button>
        <button type="button" onClick={onFinishQuarter}>쿼터 종료</button>
      </div>
      <div className="player-list">
        {session.roster.map((name) => {
          const player = session.players[name];
          return (
            <button className={`player-card status-${player.status}`} key={name} type="button" onClick={() => onPlayerTap(name)}>
              <span className="player-card__main">
                <strong>{name}</strong>
                <small>{statusLabels[player.status]}</small>
              </span>
              <span className="player-card__meta">
                <span>#{player.arrivalOrder ?? "-"}</span>
                <span>F {player.fieldQuarters}</span>
                <span>GK {player.keeperQuarters}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Wire app shell**

Modify `src/App.tsx`:

```tsx
import { useState } from "react";
import { autoAssign } from "./domain/assignment";
import { defaultRoster } from "./domain/defaultRoster";
import { createMatchDay, finishQuarter, markPresent, setPlayerStatus } from "./domain/session";
import type { PlayerStatus } from "./domain/types";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { ParticipantsTab } from "./components/ParticipantsTab";
import { PlayerActionSheet } from "./components/PlayerActionSheet";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabKey>("participants");
  const [session, setSession] = useState(() => createMatchDay(defaultRoster));
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);

  const handlePlayerTap = (name: string) => {
    const player = session.players[name];
    if (player.status === "roster") {
      setSession((current) => markPresent(current, name));
      return;
    }
    setSelectedPlayer(name);
  };

  const handleStatus = (status: Exclude<PlayerStatus, "roster">) => {
    if (!selectedPlayer) return;
    setSession((current) => setPlayerStatus(current, selectedPlayer, status));
    setSelectedPlayer(null);
  };

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Squadmaker V2</p>
        <h1>경기 당일 스쿼드 관리</h1>
      </header>

      {activeTab === "participants" && (
        <ParticipantsTab
          session={session}
          onPlayerTap={handlePlayerTap}
          onAutoAssign={() => setSession((current) => autoAssign(current))}
          onFinishQuarter={() => setSession((current) => finishQuarter(current))}
        />
      )}
      {activeTab === "teamA" && <section className="tab-panel">A팀 전술판 준비 중</section>}
      {activeTab === "teamB" && <section className="tab-panel">B팀 전술판 준비 중</section>}

      <PlayerActionSheet playerName={selectedPlayer} onClose={() => setSelectedPlayer(null)} onStatus={handleStatus} />
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
```

- [ ] **Step 5: Add mobile styling**

Modify `src/styles.css` with mobile-first styles for `.bottom-nav`, `.player-card`, `.summary-strip`, `.quick-actions`, and `.action-sheet`.

- [ ] **Step 6: Run tests and build**

Run:

```powershell
npm test
npm run build
```

Expected: tests and build pass.

- [ ] **Step 7: Commit mobile shell**

Run:

```powershell
git add src
git commit -m "feat: add mobile participant workflow"
```

Expected: local commit created.

---

### Task 5: Next Implementation Plan Expansion

This first plan intentionally stops after a usable tested foundation. The next plan should cover:

- roster paste/edit UI
- localStorage persistence
- A/B team formation board
- goalkeeper override UI
- manual swap flow
- deploy workflow for GitHub Pages and Cloudflare Pages

