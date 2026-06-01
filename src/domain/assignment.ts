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
