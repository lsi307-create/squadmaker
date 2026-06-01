import { useState } from "react";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { ParticipantsTab } from "./components/ParticipantsTab";
import { PlayerActionSheet } from "./components/PlayerActionSheet";
import { autoAssign } from "./domain/assignment";
import { defaultRoster } from "./domain/defaultRoster";
import { createMatchDay, finishQuarter, markPresent, setPlayerStatus } from "./domain/session";
import type { PlayerStatus } from "./domain/types";

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
