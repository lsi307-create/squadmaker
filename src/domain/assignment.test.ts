import { describe, expect, it } from "vitest";
import { autoAssign } from "./assignment";
import { createMatchDay, markPresent } from "./session";

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
});
