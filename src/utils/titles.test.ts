import { describe, expect, it } from "vitest";
import { computeTitleDefinition, computeScore } from "./titles";
import { titleDefinitions, NO_TITLE } from "../data/titles";
import type { TitleEvaluationInput } from "./titles";

function fillers(n: number): string[] {
  return Array.from({ length: n }, (_, i) => `filler${i}`);
}

function input(bingoCount: number, selectedWordCount: number, selectedWordIds?: string[]): TitleEvaluationInput {
  return { bingoCount, selectedWordCount, selectedWordIds: selectedWordIds ?? fillers(selectedWordCount) };
}

describe("computeScore", () => {
  it("computes bingoCount * 5 + selectedCount", () => {
    expect(computeScore(2, 6)).toBe(16);
    expect(computeScore(0, 0)).toBe(0);
  });
});

describe("title catalog", () => {
  it("has exactly 20 titles", () => {
    expect(titleDefinitions).toHaveLength(20);
  });

  it("has exactly 2 special-tier titles: series_a_ceo and chief_buzzword_officer", () => {
    const specials = titleDefinitions.filter((d) => d.category === "special").map((d) => d.id);
    expect(specials.sort()).toEqual(["chief_buzzword_officer", "series_a_ceo"].sort());
  });

  it("has exactly 6 combo titles, each with requiredWordIds", () => {
    const combos = titleDefinitions.filter((d) => d.category === "combo");
    expect(combos).toHaveLength(6);
    combos.forEach((c) => expect(c.requiredWordIds && c.requiredWordIds.length).toBeGreaterThan(0));
  });
});

describe("computeTitleDefinition - fallback", () => {
  it("returns NO_TITLE when nothing is selected", () => {
    expect(computeTitleDefinition(input(0, 0, []))).toBe(NO_TITLE);
  });
});

describe("computeTitleDefinition - all 20 titles are reachable as the top result", () => {
  it("yokomoji_apprentice: selected>=1", () => {
    expect(computeTitleDefinition(input(0, 1)).id).toBe("yokomoji_apprentice");
  });

  it("yokomoji_native: bingo>=1", () => {
    expect(computeTitleDefinition(input(1, 0)).id).toBe("yokomoji_native");
  });

  it("agenda_checker: selected>=5", () => {
    expect(computeTitleDefinition(input(0, 5)).id).toBe("agenda_checker");
  });

  it("alignment_staff: score>=8", () => {
    expect(computeTitleDefinition(input(0, 8)).id).toBe("alignment_staff");
  });

  it("high_awareness_master: score>=10", () => {
    expect(computeTitleDefinition(input(0, 10)).id).toBe("high_awareness_master");
  });

  it("resolution_supervisor: score>=13", () => {
    expect(computeTitleDefinition(input(0, 13)).id).toBe("resolution_supervisor");
  });

  it("issue_manager: score>=16", () => {
    expect(computeTitleDefinition(input(0, 16)).id).toBe("issue_manager");
  });

  it("aspiration_manager: score>=20 (via bingo, staying under both special thresholds)", () => {
    expect(computeTitleDefinition(input(4, 0)).id).toBe("aspiration_manager");
  });

  it("milestone_director: combo [must, milestone, roadmap]", () => {
    expect(computeTitleDefinition(input(0, 3, ["must", "milestone", "roadmap"])).id).toBe("milestone_director");
  });

  it("northstar_reacher: score>=25 (via bingo, staying under both special thresholds)", () => {
    expect(computeTitleDefinition(input(4, 5)).id).toBe("northstar_reacher");
  });

  it("narrative_officer: combo [narrative, insight, reframe]", () => {
    expect(computeTitleDefinition(input(0, 3, ["narrative", "insight", "reframe"])).id).toBe("narrative_officer");
  });

  it("corporate_planning_prodigy: score>=30 (via bingo, staying under both special thresholds)", () => {
    expect(computeTitleDefinition(input(4, 10)).id).toBe("corporate_planning_prodigy");
  });

  it("capability_head: score>=35 (via bingo, staying under both special thresholds)", () => {
    expect(computeTitleDefinition(input(4, 15)).id).toBe("capability_head");
  });

  it("synergy_executive: combo [synergy, ecosystem, cocreation]", () => {
    expect(computeTitleDefinition(input(0, 3, ["synergy", "ecosystem", "cocreation"])).id).toBe("synergy_executive");
  });

  it("consulting_fit: score>=38, reachable at the safe ceiling (bingo=4, selected=19 -> score=39)", () => {
    expect(computeTitleDefinition(input(4, 19)).id).toBe("consulting_fit");
  });

  it("purpose_evangelist: combo [purpose, aspiration, northstar]", () => {
    expect(computeTitleDefinition(input(0, 3, ["purpose", "aspiration", "northstar"])).id).toBe("purpose_evangelist");
  });

  it("chief_alignment_officer: combo [align, alignment]", () => {
    expect(computeTitleDefinition(input(0, 2, ["align", "alignment"])).id).toBe("chief_alignment_officer");
  });

  it("chief_buzzword_officer: bingo>=5 (special), staying under the series_a_ceo threshold", () => {
    expect(computeTitleDefinition(input(5, 17)).id).toBe("chief_buzzword_officer");
  });

  it("pre_unicorn_ceo: combo [pmf, gtm, scalability]", () => {
    expect(computeTitleDefinition(input(0, 3, ["pmf", "gtm", "scalability"])).id).toBe("pre_unicorn_ceo");
  });

  it("series_a_ceo: selected>=20 (special)", () => {
    expect(computeTitleDefinition(input(0, 20)).id).toBe("series_a_ceo");
  });
});

describe("computeTitleDefinition - tiered conflict resolution", () => {
  it("prefers series_a_ceo over chief_buzzword_officer when both special conditions are met", () => {
    expect(computeTitleDefinition(input(5, 20)).id).toBe("series_a_ceo");
  });

  it("prefers a combo title over a normal score/selected title that also matches", () => {
    // selected=2 with align+alignment also satisfies yokomoji_apprentice (selected>=1),
    // but the combo tier is evaluated first and always wins.
    const result = computeTitleDefinition(input(0, 2, ["align", "alignment"]));
    expect(result.id).toBe("chief_alignment_officer");
  });

  it("prefers a special title over a combo title that also matches", () => {
    // selected=20 satisfies series_a_ceo (special) and, incidentally, could contain combo words too;
    // special is always checked first regardless of combo matches.
    const ids = ["align", "alignment", ...fillers(18)];
    const result = computeTitleDefinition(input(0, 20, ids));
    expect(result.id).toBe("series_a_ceo");
  });

  it("resolves same-tier conflicts by rank, independent of declaration order", () => {
    // bingo=4, selected=10 -> score=30. Matches several normal-tier titles; highest rank wins.
    expect(computeTitleDefinition(input(4, 10)).id).toBe("corporate_planning_prodigy");
  });

  it("never throws and always returns a valid TitleDefinition shape", () => {
    const def = computeTitleDefinition(input(0, 0, []));
    expect(def).toHaveProperty("id");
    expect(def).toHaveProperty("name");
    expect(def).toHaveProperty("rank");
    expect(def).toHaveProperty("category");
    expect(def).toHaveProperty("imagePath");
  });

  it("NO_TITLE has imagePath null so Result screen can safely skip the image", () => {
    expect(NO_TITLE.imagePath).toBeNull();
  });
});
