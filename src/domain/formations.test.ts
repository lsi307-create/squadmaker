import { describe, expect, it } from "vitest";
import { autoAssign } from "./assignment";
import { getFormationLineup, getRoleGroup, formationSlots } from "./formations";
import { createMatchDay, markPresent, setPreferredPosition, setTeamFormation } from "./session";

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

  it("places preferred attackers into attacking slots when possible", () => {
    let session = createMatchDay(Array.from({ length: 22 }, (_, index) => `선수${index + 1}`));
    for (const name of session.roster) session = markPresent(session, name);
    session = setPreferredPosition(session, "선수1", "attack");
    session = autoAssign(session);

    const lineup = getFormationLineup(session, "A");
    const playerSlot = lineup.find((slot) => slot.playerName === "선수1");

    expect(["LW", "ST", "RW"]).toContain(playerSlot?.role);
  });

  it("classifies formation roles into keeper, defense, midfield, and attack groups", () => {
    expect(getRoleGroup("GK")).toBe("keeper");
    expect(getRoleGroup("LB")).toBe("defense");
    expect(getRoleGroup("CM")).toBe("midfield");
    expect(getRoleGroup("ST")).toBe("attack");
  });
});
