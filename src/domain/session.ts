import type { Formation, MatchDaySession, PlayerRecord, PlayerStatus, TeamSide } from "./types";

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

export function setTeamFormation(session: MatchDaySession, side: TeamSide, formation: Formation): MatchDaySession {
  return {
    ...session,
    formations: {
      ...session.formations,
      [side]: formation
    }
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
