import { useState } from "react";
import { BottomNav, type TabKey } from "./components/BottomNav";
import { ParticipantsTab } from "./components/ParticipantsTab";
import { PlayerActionSheet } from "./components/PlayerActionSheet";
import { TeamTab } from "./components/TeamTab";
import { autoAssign } from "./domain/assignment";
import { defaultRoster } from "./domain/defaultRoster";
import {
  createMatchDay,
  finishQuarter,
  markPresent,
  setPreferredPosition,
  setPlayerStatus,
  setTeamFormation,
  swapAssignedPlayers
} from "./domain/session";
import type { Formation, PlayerStatus, PreferredPosition, TeamSide } from "./domain/types";

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

  const handlePreferredPosition = (position: PreferredPosition) => {
    if (!selectedPlayer) return;

    setSession((current) => setPreferredPosition(current, selectedPlayer, position));
  };

  const handleAutoAssign = () => {
    setSession((current) => autoAssign(current));
    setActiveTab("teamA");
  };

  const handleRecommendNextQuarter = () => {
    setSession((current) => autoAssign(current));
  };

  const handleFormationChange = (side: TeamSide, formation: Formation) => {
    setSession((current) => setTeamFormation(current, side, formation));
  };

  const handleSwapPlayers = (side: TeamSide, firstPlayerName: string, secondPlayerName: string) => {
    setSession((current) => swapAssignedPlayers(current, side, firstPlayerName, secondPlayerName));
  };

  const handleFinishQuarter = () => {
    setSession((current) => finishQuarter(current));
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
          onAutoAssign={handleAutoAssign}
          onFinishQuarter={handleFinishQuarter}
        />
      )}
      {activeTab === "teamA" && (
        <TeamTab
          session={session}
          side="A"
          onFinishQuarter={handleFinishQuarter}
          onRecommendNextQuarter={handleRecommendNextQuarter}
          onFormationChange={handleFormationChange}
          onSwapPlayers={handleSwapPlayers}
        />
      )}
      {activeTab === "teamB" && (
        <TeamTab
          session={session}
          side="B"
          onFinishQuarter={handleFinishQuarter}
          onRecommendNextQuarter={handleRecommendNextQuarter}
          onFormationChange={handleFormationChange}
          onSwapPlayers={handleSwapPlayers}
        />
      )}

      <PlayerActionSheet
        playerName={selectedPlayer}
        preferredPosition={selectedPlayer ? session.players[selectedPlayer]?.preferredPosition ?? "random" : "random"}
        onClose={() => setSelectedPlayer(null)}
        onStatus={handleStatus}
        onPreferredPosition={handlePreferredPosition}
      />
      <BottomNav activeTab={activeTab} onChange={setActiveTab} />
    </main>
  );
}
