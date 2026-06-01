import type { MatchDaySession, TeamSide } from "../domain/types";

interface TeamTabProps {
  session: MatchDaySession;
  side: TeamSide;
}

export function TeamTab({ session, side }: TeamTabProps) {
  const team = side === "A" ? session.assignments.teamA : session.assignments.teamB;
  const keeper = session.assignments.goalkeepers[side];

  return (
    <section className="tab-panel team-tab" aria-labelledby={`team-${side}-title`}>
      <div className="team-header">
        <div>
          <p className="eyebrow">자동 배정 결과</p>
          <h2 id={`team-${side}-title`}>{side}팀</h2>
        </div>
        <span className={`team-badge team-badge-${side}`}>{side === "A" ? "레드" : "블루"}</span>
      </div>

      <div className="team-stats" aria-label="팀 배정 현황">
        <span>A팀 {session.assignments.teamA.length}명</span>
        <span>B팀 {session.assignments.teamB.length}명</span>
        <span>대기 {session.assignments.bench.length}명</span>
      </div>

      <div className="team-list">
        {team.length === 0 ? (
          <p className="empty-state">참여인원 탭에서 출석자를 선택한 뒤 자동 배정을 눌러주세요.</p>
        ) : (
          team.map((name, index) => (
            <article className="team-player" key={name}>
              <span className="team-player__number">{index + 1}</span>
              <span>
                <strong>{name}</strong>
                {keeper === name && <small>GK 추천</small>}
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
