import { describe, expect, it } from "vitest";
import { autoAssign } from "./assignment";
import { getFormationLineup, formationSlots } from "./formations";
import { createMatchDay, markPresent, setTeamFormation } from "./session";

describe("formations", () => {
  it("defines 11 slots for each supported formation", () => {
    expect(formationSlots["433"]).toHaveLength(11);
    expect(formationSlots["4231"]).toHaveLength(11);
    expect(formationSlots["532"]).toHaveLength(11);
    expect(formationSlots["433"][0].role).toBe("GK");
  });

  it("places the recommended goalkeeper in the GK slot and field players into formation slots", () => {
    let session = createMatchDay(Array.from({ length: 22 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session = autoAssign(session);

    const lineup = getFormationLineup(session, "A");

    expect(lineup[0]).toMatchObject({ role: "GK", playerName: session.assignments.goalkeepers.A });
    expect(lineup[1].role).toBe("LB");
    expect(lineup[1].playerName).not.toBe(session.assignments.goalkeepers.A);
  });

  it("uses the selected team formation when building a lineup", () => {
    let session = createMatchDay(Array.from({ length: 22 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session = autoAssign(session);
    session = setTeamFormation(session, "A", "532");

    const lineup = getFormationLineup(session, "A");

    expect(lineup.map((slot) => slot.role)).toContain("LWB");
    expect(lineup.map((slot) => slot.role)).toContain("RST");
  });
});
