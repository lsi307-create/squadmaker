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

const positionLabels = {
  random: "랜덤",
  defense: "수비",
  midfield: "미드",
  attack: "공격",
  keeper: "GK"
};

function formatPlayerLabel(name: string, fieldQuarters: number) {
  return fieldQuarters > 0 ? `${name} (${fieldQuarters})` : name;
}

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
        <button type="button" onClick={onAutoAssign}>
          자동 배정
        </button>
        <button type="button" onClick={onFinishQuarter}>
          쿼터 종료
        </button>
      </div>
      <div className="player-list">
        {session.roster.map((name) => {
          const player = session.players[name];

          return (
            <button
              className={`player-card status-${player.status}`}
              key={name}
              type="button"
              onClick={() => onPlayerTap(name)}
            >
              <span className="player-card__main">
                <strong>{formatPlayerLabel(name, player.fieldQuarters)}</strong>
                <small>{statusLabels[player.status]}</small>
              </span>
              <span className="player-card__meta">
                <span>#{player.arrivalOrder ?? "-"}</span>
                <span>{positionLabels[player.preferredPosition]}</span>
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
