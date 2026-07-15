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
    meetingMinutes: "テストの議事録",
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
    expect(memories[0].meetingMinutes).toBe("テストの議事録");
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

describe("meetingMemory - bossSentence backward compatibility", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("reads legacy records that only have bossSentence as meetingMinutes", () => {
    const legacyRecord = {
      id: "meeting_legacy_1",
      createdAt: "2026-01-01T00:00:00.000Z",
      titleId: "yokomoji_native",
      bingoCount: 1,
      selectedWordCount: 4,
      score: 9,
      selectedWordIds: ["purpose"],
      selectedWordLabels: ["パーパス"],
      bossSentence: "旧フィールドのラスボス文章",
      translation: "テストの翻訳。",
    };
    localStorage.setItem(KEY, JSON.stringify([legacyRecord]));

    const memories = loadMeetingMemories();
    expect(memories).toHaveLength(1);
    expect(memories[0].meetingMinutes).toBe("旧フィールドのラスボス文章");
  });

  it("prefers meetingMinutes over bossSentence when both are present", () => {
    const mixedRecord = {
      id: "meeting_legacy_2",
      createdAt: "2026-01-01T00:00:00.000Z",
      titleId: "yokomoji_native",
      bingoCount: 1,
      selectedWordCount: 4,
      score: 9,
      selectedWordIds: ["purpose"],
      selectedWordLabels: ["パーパス"],
      bossSentence: "古い方",
      meetingMinutes: "新しい方",
      translation: "テストの翻訳。",
    };
    localStorage.setItem(KEY, JSON.stringify([mixedRecord]));

    expect(loadMeetingMemories()[0].meetingMinutes).toBe("新しい方");
  });

  it("does not write bossSentence when adding a new memory", () => {
    addMeetingMemory(sampleData(), "2026-01-01T00:00:00.000Z");
    const raw = JSON.parse(localStorage.getItem(KEY)!);
    expect(raw[0].bossSentence).toBeUndefined();
    expect(raw[0].meetingMinutes).toBe("テストの議事録");
  });

  it("does not clear existing memories when loading a mix of legacy and new records", () => {
    const legacyRecord = {
      id: "meeting_legacy_3",
      createdAt: "2026-01-01T00:00:00.000Z",
      titleId: "yokomoji_native",
      bingoCount: 1,
      selectedWordCount: 4,
      score: 9,
      selectedWordIds: ["purpose"],
      selectedWordLabels: ["パーパス"],
      bossSentence: "旧データ",
      translation: "テストの翻訳。",
    };
    localStorage.setItem(KEY, JSON.stringify([legacyRecord]));
    const memories = addMeetingMemory(sampleData({ titleId: "new-one" }), "2026-01-02T00:00:00.000Z");
    expect(memories).toHaveLength(2);
    expect(memories.some((m) => m.meetingMinutes === "旧データ")).toBe(true);
  });
});
