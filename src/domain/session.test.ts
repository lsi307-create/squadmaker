import { describe, expect, it } from "vitest";
import { createMatchDay, finishQuarter, markPresent, setPlayerStatus } from "./session";

describe("match-day session", () => {
  it("assigns arrival order when players are marked present", () => {
    let session = createMatchDay(["김은규", "김재윤", "김진우"]);

    session = markPresent(session, "김재윤");
    session = markPresent(session, "김은규");

    expect(session.players["김재윤"].arrivalOrder).toBe(1);
    expect(session.players["김은규"].arrivalOrder).toBe(2);
  });

  it("keeps arrival order when a player is temporarily excluded", () => {
    let session = createMatchDay(["김은규"]);
    session = markPresent(session, "김은규");

    session = setPlayerStatus(session, "김은규", "temporarilyOut");

    expect(session.players["김은규"].status).toBe("temporarilyOut");
    expect(session.players["김은규"].arrivalOrder).toBe(1);
  });

  it("counts goalkeeper quarters separately from field quarters", () => {
    let session = createMatchDay(["김은규", "김재윤", "김진우"]);
    session = markPresent(markPresent(markPresent(session, "김은규"), "김재윤"), "김진우");
    session.assignments = {
      teamA: ["김은규", "김재윤"],
      teamB: ["김진우"],
      bench: [],
      goalkeepers: { A: "김은규", B: "김진우" }
    };

    session = finishQuarter(session);

    expect(session.players["김은규"].fieldQuarters).toBe(0);
    expect(session.players["김은규"].keeperQuarters).toBe(1);
    expect(session.players["김재윤"].fieldQuarters).toBe(1);
    expect(session.players["김재윤"].keeperQuarters).toBe(0);
    expect(session.players["김진우"].nextFieldPriority).toBe(true);
  });
});
