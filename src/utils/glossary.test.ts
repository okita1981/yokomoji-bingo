import { describe, expect, it } from "vitest";
import { words } from "../data/words";
import { filterWords } from "./glossary";
import type { CustomWord } from "../types";

describe("glossary data", () => {
  it("has 40 words, each with a meaning", () => {
    expect(words).toHaveLength(40);
    words.forEach((w) => {
      expect(w.meaning).toBeTruthy();
    });
  });
});

describe("filterWords", () => {
  it("returns all words when the query is empty", () => {
    expect(filterWords(words, "")).toHaveLength(40);
  });

  it("matches by label", () => {
    const result = filterWords(words, "パーパス");
    expect(result.some((w) => w.id === "purpose")).toBe(true);
  });

  it("matches by meaning", () => {
    const result = filterWords(words, "組織が長期的に目指す");
    expect(result.some((w) => w.id === "northstar")).toBe(true);
  });

  it("returns an empty array when nothing matches", () => {
    expect(filterWords(words, "存在しない単語 xyz123")).toHaveLength(0);
  });

  it("includes custom words in the searchable set", () => {
    const custom: CustomWord = {
      id: "custom_1",
      label: "バリューアップ",
      meaning: "独自の意味",
      translation: "よしなに進めて",
      category: "common",
      isCustom: true,
    };
    const all = [...words, custom];
    expect(filterWords(all, "バリューアップ")).toHaveLength(1);
  });
});
