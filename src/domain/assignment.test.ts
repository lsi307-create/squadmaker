import { describe, expect, it } from "vitest";
import { autoAssign } from "./assignment";
import { createMatchDay, finishQuarter, markPresent } from "./session";

describe("autoAssign", () => {
  it("assigns only active players into A, B, and bench", () => {
    let session = createMatchDay(Array.from({ length: 25 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session.players["선수25"].status = "temporarilyOut";

    const assigned = autoAssign(session);

    expect(assigned.assignments.teamA).toHaveLength(11);
    expect(assigned.assignments.teamB).toHaveLength(11);
    expect(assigned.assignments.bench).toHaveLength(2);
    expect([...assigned.assignments.teamA, ...assigned.assignments.teamB, ...assigned.assignments.bench]).not.toContain("선수25");
  });

  it("prioritizes previous goalkeepers for field placement", () => {
    let session = createMatchDay(Array.from({ length: 24 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session.players["선수24"].nextFieldPriority = true;

    const assigned = autoAssign(session);

    expect([...assigned.assignments.teamA, ...assigned.assignments.teamB]).toContain("선수24");
    expect(assigned.assignments.bench).not.toContain("선수24");
  });

  it("fills field players before selecting goalkeepers", () => {
    let session = createMatchDay(Array.from({ length: 22 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);

    const assigned = autoAssign(session);

    expect(assigned.assignments.goalkeepers).toEqual({ A: "선수21", B: "선수22" });
    expect(assigned.assignments.teamA.slice(0, 10)).toContain("선수1");
    expect(assigned.assignments.teamA.slice(0, 10)).not.toContain("선수21");
    expect(assigned.assignments.teamB.slice(0, 10)).not.toContain("선수22");
  });

  it("does not reuse a field player as a goalkeeper when keeper candidates are unavailable", () => {
    let session = createMatchDay(Array.from({ length: 20 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);

    const assigned = autoAssign(session);

    expect(assigned.assignments.teamA).toHaveLength(10);
    expect(assigned.assignments.teamB).toHaveLength(10);
    expect(assigned.assignments.goalkeepers).toEqual({});
  });

  it("recommends lower field-quarter players for the next assignment", () => {
    let session = createMatchDay(Array.from({ length: 24 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);

    session = finishQuarter(autoAssign(session));
    session = autoAssign(session);

    expect([...session.assignments.teamA, ...session.assignments.teamB]).toContain("선수23");
    expect([...session.assignments.teamA, ...session.assignments.teamB]).toContain("선수24");
    expect(session.assignments.bench).not.toContain("선수23");
    expect(session.assignments.bench).not.toContain("선수24");
  });

  it("moves previous goalkeepers behind other goalkeeper candidates", () => {
    let session = createMatchDay(Array.from({ length: 24 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);

    session = finishQuarter(autoAssign(session));
    session = autoAssign(session);

    expect(Object.values(session.assignments.goalkeepers)).not.toContain("선수21");
    expect(Object.values(session.assignments.goalkeepers)).not.toContain("선수22");
  });
});
