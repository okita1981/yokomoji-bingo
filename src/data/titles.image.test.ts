import { existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { titleDefinitions, NO_TITLE } from "./titles";

const PUBLIC_DIR = path.resolve(process.cwd(), "public");

describe("title card images", () => {
  it("all 20 titles have a non-null imagePath", () => {
    expect(titleDefinitions).toHaveLength(20);
    titleDefinitions.forEach((def) => {
      expect(def.imagePath).not.toBeNull();
      expect(def.imagePath).toMatch(/^\/images\/titles\/.+\.webp$/);
    });
  });

  it("all 20 titles have a rarity assigned", () => {
    const validRarities = new Set(["N", "R", "SR", "SSR", "UR"]);
    titleDefinitions.forEach((def) => {
      expect(validRarities.has(def.rarity)).toBe(true);
    });
  });

  it("has no duplicate image paths", () => {
    const paths = titleDefinitions.map((d) => d.imagePath);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("matches the rarity tiers: N=1-3, R=4-7, SR=8-12, SSR=13-18, UR=19-20", () => {
    const byRank = [...titleDefinitions].sort((a, b) => a.rank - b.rank);
    const expected = [
      "N", "N", "N", // 1-3
      "R", "R", "R", "R", // 4-7
      "SR", "SR", "SR", "SR", "SR", // 8-12
      "SSR", "SSR", "SSR", "SSR", "SSR", "SSR", // 13-18
      "UR", "UR", // 19-20
    ];
    expect(byRank.map((d) => d.rarity)).toEqual(expected);
  });

  it("NO_TITLE has no image (not part of the collectible set)", () => {
    expect(NO_TITLE.imagePath).toBeNull();
  });

  it("every referenced image file actually exists under public/", () => {
    titleDefinitions.forEach((def) => {
      const relativePath = def.imagePath!.replace(/^\//, "");
      const absolutePath = path.join(PUBLIC_DIR, relativePath);
      expect(existsSync(absolutePath), `${absolutePath} should exist`).toBe(true);
    });
  });

  it("maps specific No. to the expected titleId (spot check per the source mapping table)", () => {
    const byId = new Map(titleDefinitions.map((d) => [d.id, d]));
    expect(byId.get("yokomoji_apprentice")?.imagePath).toBe("/images/titles/01-yokomoji-apprentice.webp");
    expect(byId.get("alignment_staff")?.imagePath).toBe("/images/titles/04-alignment-staff.webp");
    expect(byId.get("aspiration_manager")?.imagePath).toBe("/images/titles/08-aspiration-manager.webp");
    expect(byId.get("capability_head")?.imagePath).toBe("/images/titles/13-capability-head.webp");
    expect(byId.get("chief_alignment_officer")?.imagePath).toBe(
      "/images/titles/17-chief-alignment-officer.webp"
    );
    expect(byId.get("chief_buzzword_officer")?.imagePath).toBe("/images/titles/18-chief-buzzword-officer.webp");
    expect(byId.get("pre_unicorn_ceo")?.imagePath).toBe("/images/titles/19-pre-unicorn-ceo.webp");
    expect(byId.get("series_a_ceo")?.imagePath).toBe("/images/titles/20-series-a-ceo.webp");
  });
});
