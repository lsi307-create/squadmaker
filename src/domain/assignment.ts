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

  const fieldPlayers = activePlayers.slice(0, 20).map((player) => player.name);
  const teamAFields = fieldPlayers.filter((_, index) => index % 2 === 0).slice(0, 10);
  const teamBFields = fieldPlayers.filter((_, index) => index % 2 === 1).slice(0, 10);
  const assignedFieldNames = new Set([...teamAFields, ...teamBFields]);
  const keeperCandidates = activePlayers.filter((player) => !assignedFieldNames.has(player.name));
  const keeperA = keeperCandidates[0]?.name;
  const keeperB = keeperCandidates[1]?.name;
  const teamA = keeperA ? [...teamAFields, keeperA] : teamAFields;
  const teamB = keeperB ? [...teamBFields, keeperB] : teamBFields;
  const goalkeepers = {
    ...(keeperA ? { A: keeperA } : {}),
    ...(keeperB ? { B: keeperB } : {})
  };
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
      goalkeepers
    }
  };
}
