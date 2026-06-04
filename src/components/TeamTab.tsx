import { useState } from "react";
import { getFormationLineup, supportedFormations } from "../domain/formations";
import type { Formation, MatchDaySession, TeamSide } from "../domain/types";

interface TeamTabProps {
  session: MatchDaySession;
  side: TeamSide;
  onFinishQuarter: () => void;
  onRecommendNextQuarter: () => void;
  onFormationChange: (side: TeamSide, formation: Formation) => void;
  onSwapPlayers: (side: TeamSide, firstPlayerName: string, secondPlayerName: string) => void;
}

function formatPlayerLabel(name: string, fieldQuarters: number) {
  return fieldQuarters > 0 ? `${name} (${fieldQuarters})` : name;
}

export function TeamTab({
  session,
  side,
  onFinishQuarter,
  onRecommendNextQuarter,
  onFormationChange,
  onSwapPlayers
}: TeamTabProps) {
  const [selectedPlayerName, setSelectedPlayerName] = useState<string | null>(null);
  const team = side === "A" ? session.assignments.teamA : session.assignments.teamB;
  const lineup = getFormationLineup(session, side);
  const formation = session.formations[side];

  const handlePitchPlayerTap = (playerName: string | null) => {
    if (!playerName) return;
    if (!selectedPlayerName) {
      setSelectedPlayerName(playerName);
      return;
    }
    if (selectedPlayerName === playerName) {
      setSelectedPlayerName(null);
      return;
    }

    onSwapPlayers(side, selectedPlayerName, playerName);
    setSelectedPlayerName(null);
  };

  return (
    <section className="tab-panel team-tab" aria-labelledby={`team-${side}-title`}>
      <div className="team-header">
        <div>
          <p className="eyebrow">포지션 보드</p>
          <h2 id={`team-${side}-title`}>{side}팀</h2>
          <span className="team-subtitle">라인업</span>
        </div>
        <span className={`team-badge team-badge-${side}`}>{side === "A" ? "레드" : "블루"}</span>
      </div>

      <div className="team-control-strip">
        <div className="formation-card">
          <span>포메이션</span>
          <div className="formation-switcher" aria-label={`${side}팀 포메이션 선택`}>
            {supportedFormations.map((option) => (
              <button
                className={formation === option ? "is-active" : ""}
                key={option}
                type="button"
                onClick={() => onFormationChange(side, option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
        <div className="team-count-card" aria-label="팀 배정 현황">
          <span>필드</span>
          <strong>{Math.max(team.length - 1, 0)}명</strong>
        </div>
        <button className="quarter-end-action" type="button" onClick={onFinishQuarter}>
          쿼터 종료
        </button>
      </div>

      <div className={`pitch-board pitch-board-${side}`} aria-label={`${side}팀 포메이션 보드`}>
        <div className="pitch-half-line" />
        <div className="pitch-center-circle" />
        {lineup.map((slot) => {
          const player = slot.playerName ? session.players[slot.playerName] : null;
          const playerLabel = player ? formatPlayerLabel(player.name, player.fieldQuarters) : "빈 자리";
          const isSelected = slot.playerName === selectedPlayerName;

          return (
            <button
              aria-label={`${slot.role} ${playerLabel}`}
              className={`pitch-player ${slot.playerName ? "" : "is-empty"} ${isSelected ? "is-selected" : ""}`}
              key={slot.role}
              type="button"
              style={{ left: `${slot.x}%`, top: `${slot.y}%` }}
              onClick={() => handlePitchPlayerTap(slot.playerName)}
            >
              <span className="pitch-role">{slot.role}</span>
              <strong>{playerLabel}</strong>
              {slot.isKeeper && slot.playerName && <small>GK 추천</small>}
            </button>
          );
        })}
      </div>

      <div className="team-stats" aria-label="팀 배정 현황">
        <span>현재 {session.currentQuarter}쿼터</span>
        <span>A팀 {session.assignments.teamA.length}명</span>
        <span>B팀 {session.assignments.teamB.length}명</span>
        <span>대기 {session.assignments.bench.length}명</span>
      </div>

      <button className="next-quarter-action" type="button" onClick={onRecommendNextQuarter}>
        다음 쿼터 추천
      </button>

      <div className="team-list compact-list">
        {team.length === 0 ? (
          <p className="empty-state">참여인원 탭에서 출석자를 선택한 뒤 자동 배정을 눌러주세요.</p>
        ) : (
          team.map((name, index) => (
            <article className="team-player" key={name}>
              <span className="team-player__number">{index + 1}</span>
              <span>
                <strong>{formatPlayerLabel(name, session.players[name].fieldQuarters)}</strong>
              </span>
            </article>
          ))
        )}
      </div>

      {session.assignments.bench.length > 0 && (
        <section className="bench-section" aria-label="대기자">
          <h3>대기</h3>
          <div className="bench-list">
            {session.assignments.bench.map((name) => (
              <span key={name}>{name}</span>
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
