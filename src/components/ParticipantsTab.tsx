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
    <section className="tab-panel participants-tab">
      <div className="match-control-strip">
        <div className="match-stat">
          <span>현재 쿼터</span>
          <strong>{session.currentQuarter}</strong>
        </div>
        <div className="match-stat">
          <span>출석</span>
          <strong>{activeCount}</strong>
        </div>
        <button className="recommend-action" type="button" aria-label="자동 배정" onClick={onAutoAssign}>
          <span>추천</span>
          <strong>배정</strong>
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
                <span>#{player.arrivalOrder ?? "-"} · {positionLabels[player.preferredPosition]}</span>
                <span>F {player.fieldQuarters}</span>
              </span>
            </button>
          );
        })}
      </div>
      <button className="floating-quarter-button" type="button" onClick={onFinishQuarter}>
        쿼터 종료
      </button>
    </section>
  );
}
