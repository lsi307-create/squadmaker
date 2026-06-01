import type { Formation, MatchDaySession, TeamSide } from "./types";

export interface FormationSlot {
  role: string;
  x: number;
  y: number;
}

export interface FormationLineupSlot extends FormationSlot {
  playerName: string | null;
  isKeeper: boolean;
}

export const formationSlots: Record<Formation, FormationSlot[]> = {
  "433": [
    { role: "GK", x: 50, y: 91 },
    { role: "LB", x: 16, y: 73 },
    { role: "LCB", x: 39, y: 77 },
    { role: "RCB", x: 61, y: 77 },
    { role: "RB", x: 84, y: 73 },
    { role: "LCM", x: 28, y: 50 },
    { role: "CM", x: 50, y: 54 },
    { role: "RCM", x: 72, y: 50 },
    { role: "LW", x: 18, y: 23 },
    { role: "ST", x: 50, y: 17 },
    { role: "RW", x: 82, y: 23 }
  ],
  "4231": [
    { role: "GK", x: 50, y: 91 },
    { role: "LB", x: 16, y: 73 },
    { role: "LCB", x: 39, y: 77 },
    { role: "RCB", x: 61, y: 77 },
    { role: "RB", x: 84, y: 73 },
    { role: "LDM", x: 38, y: 58 },
    { role: "RDM", x: 62, y: 58 },
    { role: "LAM", x: 22, y: 35 },
    { role: "CAM", x: 50, y: 31 },
    { role: "RAM", x: 78, y: 35 },
    { role: "ST", x: 50, y: 15 }
  ],
  "532": [
    { role: "GK", x: 50, y: 91 },
    { role: "LWB", x: 11, y: 62 },
    { role: "LCB", x: 31, y: 75 },
    { role: "CB", x: 50, y: 79 },
    { role: "RCB", x: 69, y: 75 },
    { role: "RWB", x: 89, y: 62 },
    { role: "LCM", x: 31, y: 45 },
    { role: "CM", x: 50, y: 49 },
    { role: "RCM", x: 69, y: 45 },
    { role: "LST", x: 39, y: 18 },
    { role: "RST", x: 61, y: 18 }
  ]
};

export const supportedFormations: Formation[] = ["433", "4231", "532"];

export function getFormationLineup(session: MatchDaySession, side: TeamSide): FormationLineupSlot[] {
  const team = side === "A" ? session.assignments.teamA : session.assignments.teamB;
  const keeper = session.assignments.goalkeepers[side] ?? team[0] ?? null;
  const fieldPlayers = team.filter((name) => name !== keeper);
  let fieldIndex = 0;

  return formationSlots[session.formations[side]].map((slot) => {
    const playerName = slot.role === "GK" ? keeper : fieldPlayers[fieldIndex++] ?? null;

    return {
      ...slot,
      playerName,
      isKeeper: slot.role === "GK"
    };
  });
}
