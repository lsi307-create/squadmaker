export type PlayerStatus = "roster" | "active" | "temporarilyOut" | "departed";
export type TeamSide = "A" | "B";
export type Formation = "433" | "4231" | "532";
export type PreferredPosition = "random" | "defense" | "midfield" | "attack" | "keeper";

export interface PlayerRecord {
  name: string;
  status: PlayerStatus;
  arrivalOrder: number | null;
  fieldQuarters: number;
  keeperQuarters: number;
  wasKeeperLastQuarter: boolean;
  nextFieldPriority: boolean;
  preferredPosition: PreferredPosition;
}

export interface TeamAssignments {
  teamA: string[];
  teamB: string[];
  bench: string[];
  goalkeepers: Partial<Record<TeamSide, string>>;
}

export interface MatchDaySession {
  roster: string[];
  players: Record<string, PlayerRecord>;
  currentQuarter: number;
  nextArrivalOrder: number;
  formations: Record<TeamSide, Formation>;
  assignments: TeamAssignments;
}
