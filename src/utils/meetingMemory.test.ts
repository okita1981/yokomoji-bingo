import { afterEach, beforeEach, describe, expect, it } from "vitest";
import {
  loadMeetingMemories,
  addMeetingMemory,
  deleteMeetingMemory,
  deleteAllMeetingMemories,
  MAX_MEMORIES,
} from "./meetingMemory";

const KEY = "yokomoji-bingo:meetingMemories:v1";

function sampleData(overrides: Partial<Parameters<typeof addMeetingMemory>[0]> = {}) {
  return {
    titleId: "yokomoji_native",
    bingoCount: 1,
    selectedWordCount: 4,
    score: 9,
    selectedWordIds: ["purpose"],
    selectedWordLabels: ["パーパス"],
    bossSentence: "テストのラスボス文章",
    translation: "テストの翻訳。",
    ...overrides,
  };
}

describe("meetingMemory", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("starts empty", () => {
    expect(loadMeetingMemories()).toEqual([]);
  });

  it("adds one memory with a generated id and the given createdAt", () => {
    const memories = addMeetingMemory(sampleData(), "2026-01-01T00:00:00.000Z");
    expect(memories).toHaveLength(1);
    expect(memories[0].createdAt).toBe("2026-01-01T00:00:00.000Z");
    expect(memories[0].id).toMatch(/^meeting_/);
  });

  it("adds new memories to the front (newest first)", () => {
    addMeetingMemory(sampleData({ titleId: "a" }), "2026-01-01T00:00:00.000Z");
    const memories = addMeetingMemory(sampleData({ titleId: "b" }), "2026-01-02T00:00:00.000Z");
    expect(memories[0].titleId).toBe("b");
    expect(memories[1].titleId).toBe("a");
  });

  it("caps stored memories at 100, dropping the oldest", () => {
    let memories = loadMeetingMemories();
    for (let i = 0; i < MAX_MEMORIES + 5; i++) {
      memories = addMeetingMemory(sampleData({ titleId: `t${i}` }), `2026-01-01T00:00:${String(i % 60).padStart(2, "0")}.000Z`);
    }
    expect(memories).toHaveLength(MAX_MEMORIES);
    // the newest one (last added) should still be present at the front
    expect(memories[0].titleId).toBe(`t${MAX_MEMORIES + 4}`);
    // the oldest 5 should have been dropped
    expect(memories.some((m) => m.titleId === "t0")).toBe(false);
  });

  it("deletes a single memory by id", () => {
    addMeetingMemory(sampleData({ titleId: "a" }), "2026-01-01T00:00:00.000Z");
    const after1 = addMeetingMemory(sampleData({ titleId: "b" }), "2026-01-02T00:00:00.000Z");
    const targetId = after1.find((m) => m.titleId === "a")!.id;
    const remaining = deleteMeetingMemory(targetId);
    expect(remaining).toHaveLength(1);
    expect(remaining[0].titleId).toBe("b");
  });

  it("deletes all memories", () => {
    addMeetingMemory(sampleData(), "2026-01-01T00:00:00.000Z");
    addMeetingMemory(sampleData(), "2026-01-02T00:00:00.000Z");
    const remaining = deleteAllMeetingMemories();
    expect(remaining).toEqual([]);
    expect(loadMeetingMemories()).toEqual([]);
  });

  it("does not crash and falls back to an empty list when localStorage holds corrupted JSON", () => {
    localStorage.setItem(KEY, "{not valid json");
    expect(loadMeetingMemories()).toEqual([]);
  });

  it("filters out malformed entries instead of crashing", () => {
    localStorage.setItem(KEY, JSON.stringify([{ id: "x" }, "garbage", 42]));
    expect(loadMeetingMemories()).toEqual([]);
  });
});
