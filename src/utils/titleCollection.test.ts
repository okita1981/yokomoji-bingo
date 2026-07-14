import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { loadTitleCollection, recordTitleUnlock, isTitleUnlocked } from "./titleCollection";

const KEY = "yokomoji-bingo:titleCollection:v1";

describe("titleCollection", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("starts empty", () => {
    expect(loadTitleCollection()).toEqual([]);
  });

  it("creates a new record on first unlock and reports isNew=true", () => {
    const { records, isNew } = recordTitleUnlock(
      "yokomoji_native",
      { score: 5, bingoCount: 1, selectedWordCount: 0 },
      "2026-01-01T00:00:00.000Z"
    );
    expect(isNew).toBe(true);
    expect(records).toHaveLength(1);
    expect(records[0]).toMatchObject({
      titleId: "yokomoji_native",
      firstUnlockedAt: "2026-01-01T00:00:00.000Z",
      lastUnlockedAt: "2026-01-01T00:00:00.000Z",
      unlockCount: 1,
      bestScore: 5,
      bestBingoCount: 1,
      bestSelectedWordCount: 0,
    });
  });

  it("increments unlockCount and reports isNew=false on re-unlock, keeping firstUnlockedAt", () => {
    recordTitleUnlock("yokomoji_native", { score: 5, bingoCount: 1, selectedWordCount: 0 }, "2026-01-01T00:00:00.000Z");
    const { records, isNew } = recordTitleUnlock(
      "yokomoji_native",
      { score: 12, bingoCount: 2, selectedWordCount: 2 },
      "2026-01-05T00:00:00.000Z"
    );
    expect(isNew).toBe(false);
    expect(records[0].unlockCount).toBe(2);
    expect(records[0].firstUnlockedAt).toBe("2026-01-01T00:00:00.000Z");
    expect(records[0].lastUnlockedAt).toBe("2026-01-05T00:00:00.000Z");
  });

  it("keeps the best (max) stats across unlocks, not the latest", () => {
    recordTitleUnlock("yokomoji_native", { score: 20, bingoCount: 3, selectedWordCount: 10 }, "2026-01-01T00:00:00.000Z");
    const { records } = recordTitleUnlock(
      "yokomoji_native",
      { score: 8, bingoCount: 1, selectedWordCount: 2 },
      "2026-01-02T00:00:00.000Z"
    );
    expect(records[0].bestScore).toBe(20);
    expect(records[0].bestBingoCount).toBe(3);
    expect(records[0].bestSelectedWordCount).toBe(10);
  });

  it("isTitleUnlocked reflects the current collection", () => {
    expect(isTitleUnlocked("yokomoji_native")).toBe(false);
    recordTitleUnlock("yokomoji_native", { score: 5, bingoCount: 1, selectedWordCount: 0 }, "2026-01-01T00:00:00.000Z");
    expect(isTitleUnlocked("yokomoji_native")).toBe(true);
    expect(isTitleUnlocked("series_a_ceo")).toBe(false);
  });

  it("does not crash and falls back to an empty list when localStorage holds corrupted JSON", () => {
    localStorage.setItem(KEY, "{not valid json");
    expect(loadTitleCollection()).toEqual([]);
  });

  it("filters out malformed entries instead of crashing", () => {
    localStorage.setItem(KEY, JSON.stringify([{ titleId: "x" }, "garbage", 42]));
    expect(loadTitleCollection()).toEqual([]);
  });
});
