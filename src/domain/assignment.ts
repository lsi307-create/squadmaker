import { orderFieldPlayersForFormation } from "./formations";
import type { MatchDaySession, PlayerRecord } from "./types";

function assignmentScore(player: PlayerRecord): number {
  const priorityBoost = player.nextFieldPriority ? -1000 : 0;
  const arrival = player.arrivalOrder ?? 9999;

  return priorityBoost + player.fieldQuarters * 100 + arrival;
}

function goalkeeperScore(player: PlayerRecord): number {
  const lastKeeperPenalty = player.wasKeeperLastQuarter ? 10000 : 0;
  const preferenceBoost = player.preferredPosition === "keeper" ? -300 : 0;
  const arrival = player.arrivalOrder ?? 9999;

  return lastKeeperPenalty + preferenceBoost + player.keeperQuarters * 100 + player.fieldQuarters * 10 + arrival;
}

export function autoAssign(session: MatchDaySession): MatchDaySession {
  const activePlayers = Object.values(session.players)
    .filter((player) => player.status === "active")
    .sort((a, b) => assignmentScore(a) - assignmentScore(b));

  const fieldPlayers = activePlayers.slice(0, 20).map((player) => player.name);
  const teamAFields = orderFieldPlayersForFormation(
    session,
    fieldPlayers.filter((_, index) => index % 2 === 0).slice(0, 10),
    session.formations.A
  );
  const teamBFields = orderFieldPlayersForFormation(
    session,
    fieldPlayers.filter((_, index) => index % 2 === 1).slice(0, 10),
    session.formations.B
  );
  const assignedFieldNames = new Set([...teamAFields, ...teamBFields]);
  const keeperCandidates = activePlayers
    .filter((player) => !assignedFieldNames.has(player.name))
    .sort((a, b) => goalkeeperScore(a) - goalkeeperScore(b));
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
