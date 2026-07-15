import { describe, expect, it } from "vitest";
import {
  generateMeetingMinutes,
  generateTranslation,
  buildTranslationBody,
  pickPunchline,
  BODY_PATTERNS,
} from "./textGen";
import {
  meetingMinuteTemplates,
  translationPunchlines,
  categoryPunchlines,
} from "../data/meetingMinuteTemplates";
import { words } from "../data/words";

describe("meetingMinuteTemplates data", () => {
  it("has at least 15 templates (target 20)", () => {
    expect(meetingMinuteTemplates.length).toBeGreaterThanOrEqual(15);
  });

  it("covers all 9 required categories", () => {
    const categories = new Set(meetingMinuteTemplates.map((t) => t.category));
    expect(categories).toEqual(
      new Set([
        "management",
        "consulting",
        "startup",
        "dx",
        "organization",
        "marketing",
        "sales",
        "nothing_decided",
        "general",
      ])
    );
  });

  it("includes a nothing_decided (何も決まらなかった会議型) template", () => {
    expect(meetingMinuteTemplates.some((t) => t.category === "nothing_decided")).toBe(true);
  });
});

describe("generateMeetingMinutes", () => {
  it("fills every slot in the chosen template (no leftover {n} placeholders)", () => {
    const selected = words.slice(0, 4);
    for (let i = 0; i < 30; i++) {
      const { text } = generateMeetingMinutes(selected);
      expect(text).not.toMatch(/\{\d+\}/);
      expect(text.length).toBeGreaterThan(0);
    }
  });

  it("backfills from the full word pool when too few words are selected", () => {
    const { text, usedWords } = generateMeetingMinutes([]);
    expect(text).not.toMatch(/\{\d+\}/);
    expect(usedWords.length).toBeGreaterThan(0);
  });

  it("never uses the same word twice in one generated sentence", () => {
    for (let i = 0; i < 30; i++) {
      const { usedWords } = generateMeetingMinutes(words.slice(0, 6));
      const ids = usedWords.map((w) => w.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it("returns a category matching one of the known template categories", () => {
    const { category } = generateMeetingMinutes(words.slice(0, 4));
    expect(meetingMinuteTemplates.map((t) => t.category)).toContain(category);
  });
});

describe("generateMeetingMinutes - excludedWordIds are respected", () => {
  it("does not pick an excluded word for the startup template's slots", () => {
    const startupTemplate = meetingMinuteTemplates.find((t) => t.id === "startup_01")!;
    const excluded = new Set(startupTemplate.excludedWordIds);
    // Force selection to be exactly the excluded words plus one more, and run many times;
    // since we can't force template choice directly, we instead validate the pure exclusion
    // logic indirectly: none of the excluded ids should ever appear in usedWords when that
    // template happens to be chosen (checked by re-deriving from the template pool directly).
    const northstar = words.find((w) => w.id === "northstar")!;
    const pmf = words.find((w) => w.id === "pmf")!;
    const gtm = words.find((w) => w.id === "gtm")!;
    const selected = [northstar, pmf, gtm, ...words.filter((w) => !excluded.has(w.id)).slice(0, 5)];

    let sawStartupTemplate = false;
    for (let i = 0; i < 200 && !sawStartupTemplate; i++) {
      const { text, usedWords } = generateMeetingMinutes(selected);
      if (text.includes("をノーススターとして")) {
        sawStartupTemplate = true;
        const usedIds = usedWords.map((w) => w.id);
        expect(usedIds).not.toContain("northstar");
        expect(usedIds).not.toContain("pmf");
        expect(usedIds).not.toContain("gtm");
      }
    }
    expect(sawStartupTemplate).toBe(true);
  });
});

describe("buildTranslationBody", () => {
  it("uses one of the 5 defined patterns when given 3 fragments", () => {
    expect(BODY_PATTERNS.length).toBeGreaterThanOrEqual(5);
    const fragments = ["A", "B", "C"];
    const outputs = new Set(BODY_PATTERNS.map((_, idx) => buildTranslationBody(fragments, idx)));
    expect(outputs.size).toBe(BODY_PATTERNS.length);
    outputs.forEach((out) => {
      expect(out).toContain("A");
      expect(out).toContain("B");
      expect(out).toContain("C");
    });
  });

  it("falls back to simple concatenation when fewer than 3 fragments are given", () => {
    expect(buildTranslationBody(["A", "B"])).toBe("A、B。");
    expect(buildTranslationBody(["A"])).toBe("A。");
    expect(buildTranslationBody([])).toBe("");
  });
});

describe("translationPunchlines", () => {
  it("has at least 20 punchlines", () => {
    expect(translationPunchlines.length).toBeGreaterThanOrEqual(20);
  });

  it("still includes the original 5 punchlines", () => {
    expect(translationPunchlines).toContain("要するに、みんなで頑張ります。");
    expect(translationPunchlines).toContain("つまり、頑張ります。");
    expect(translationPunchlines).toContain("まあ、いい感じにやります。");
    expect(translationPunchlines).toContain("ようは、売上を上げたいです。");
    expect(translationPunchlines).toContain("結局、次に何するか決めます。");
  });
});

describe("pickPunchline - category-linked selection", () => {
  it("only returns candidates from the category list when one is defined", () => {
    for (let i = 0; i < 30; i++) {
      const result = pickPunchline("nothing_decided");
      expect(categoryPunchlines.nothing_decided).toContain(result);
    }
  });

  it("falls back to the full punchline list for categories with no dedicated candidates", () => {
    for (let i = 0; i < 10; i++) {
      const result = pickPunchline("consulting");
      expect(translationPunchlines).toContain(result);
    }
  });

  it("returns a valid punchline when no category is given", () => {
    expect(translationPunchlines).toContain(pickPunchline());
  });
});

describe("generateTranslation", () => {
  it("never returns an empty string", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateTranslation(words.slice(0, 4)).length).toBeGreaterThan(0);
      expect(generateTranslation([]).length).toBeGreaterThan(0);
    }
  });

  it("does not repeat the same translation fragment within one result", () => {
    const duplicateWord = words.find((w) => w.id === "purpose")!;
    const result = generateTranslation([duplicateWord, duplicateWord, duplicateWord]);
    const occurrences = result.split(duplicateWord.translation).length - 1;
    expect(occurrences).toBeLessThanOrEqual(1);
  });
});
