import { describe, expect, it } from "vitest";
import { computeTitleDefinition, computeScore } from "./titles";
import { NO_TITLE } from "../data/titles";

describe("computeScore", () => {
  it("computes bingoCount * 5 + selectedCount", () => {
    expect(computeScore(2, 6)).toBe(16);
    expect(computeScore(0, 0)).toBe(0);
  });
});

describe("computeTitleDefinition", () => {
  it("returns NO_TITLE when no condition is met", () => {
    expect(computeTitleDefinition(0, 0)).toBe(NO_TITLE);
  });

  it("returns 横文字ネイティブ for 1 bingo with a low score", () => {
    // bingo=1, selected=0 -> score=5, only yokomoji_native's condition (bingo>=1) matches
    expect(computeTitleDefinition(1, 0).id).toBe("yokomoji_native");
  });

  it("returns 意識高い会議マスター at score 10", () => {
    // bingo=0, selected=10 -> score=10; bingo condition not met, only score>=10 matches
    expect(computeTitleDefinition(0, 10).id).toBe("high_awareness_master");
  });

  it("returns アスピレーション管理職 at score 15", () => {
    expect(computeTitleDefinition(0, 15).id).toBe("aspiration_manager");
  });

  it("returns ノーススター到達者 at score 20 (via bingo, staying under the series_a_ceo/chief thresholds)", () => {
    // bingo=2, selected=10 -> score=20, bingo<3 and selected<20 so no higher-rank title interferes
    expect(computeTitleDefinition(2, 10).id).toBe("northstar_reacher");
  });

  it("returns 経営企画の申し子 at score 25 (via bingo, staying under the series_a_ceo/chief thresholds)", () => {
    // bingo=2, selected=15 -> score=25, bingo<3 and selected<20
    expect(computeTitleDefinition(2, 15).id).toBe("corporate_planning_prodigy");
  });

  it("documents that コンサル適性あり (score>=30) can never be the top result", () => {
    // Reaching score>=30 while staying under bingo<3 requires selectedCount>=20,
    // which always also satisfies series_a_ceo (rank8) — a higher rank than consulting_fit (rank6).
    // And bingo>=3 always satisfies chief_buzzword_officer (rank7), also higher than consulting_fit.
    // So consulting_fit's own condition can be true, but it can never win the rank comparison.
    expect(computeTitleDefinition(2, 20).id).toBe("series_a_ceo");
    expect(computeTitleDefinition(3, 15).id).toBe("chief_buzzword_officer");
  });

  it("returns Chief Buzzword Officer when bingoCount >= 3, even with a low score", () => {
    // bingo=3, selected=0 -> score=15 (would also match aspiration_manager, but rank must win)
    expect(computeTitleDefinition(3, 0).id).toBe("chief_buzzword_officer");
  });

  it("returns シリーズA調達済みCEO when selectedCount >= 20", () => {
    // bingo=0, selected=24 -> score=24 (would also match northstar_reacher/aspiration_manager, but rank must win)
    expect(computeTitleDefinition(0, 24).id).toBe("series_a_ceo");
  });

  it("resolves conflicts by rank, independent of declaration order", () => {
    // bingo=3 AND selected=24 -> both chief_buzzword_officer(rank7) and series_a_ceo(rank8) match; highest rank wins
    expect(computeTitleDefinition(3, 24).id).toBe("series_a_ceo");
  });

  it("never throws and always returns a valid TitleDefinition shape", () => {
    const def = computeTitleDefinition(0, 0);
    expect(def).toHaveProperty("id");
    expect(def).toHaveProperty("name");
    expect(def).toHaveProperty("rank");
    expect(def).toHaveProperty("imagePath");
  });

  it("NO_TITLE has imagePath null so Result screen can safely skip the image", () => {
    expect(NO_TITLE.imagePath).toBeNull();
  });
});
