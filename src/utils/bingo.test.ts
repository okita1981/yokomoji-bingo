import { describe, expect, it } from "vitest";
import { countCompletedLines, LINES } from "./bingo";
import { CARD_LENGTH } from "../types";

function marksFromIndexes(indexes: number[]): boolean[] {
  const marks = new Array(CARD_LENGTH).fill(false);
  indexes.forEach((i) => (marks[i] = true));
  return marks;
}

describe("bingo line detection", () => {
  it("defines exactly 12 lines (5 rows + 5 cols + 2 diagonals)", () => {
    expect(LINES).toHaveLength(12);
  });

  it("detects no lines on an empty card", () => {
    expect(countCompletedLines(new Array(CARD_LENGTH).fill(false))).toBe(0);
  });

  it("detects each row correctly", () => {
    for (let r = 0; r < 5; r++) {
      const row = [0, 1, 2, 3, 4].map((c) => r * 5 + c);
      expect(countCompletedLines(marksFromIndexes(row))).toBe(1);
    }
  });

  it("detects each column correctly", () => {
    for (let c = 0; c < 5; c++) {
      const col = [0, 1, 2, 3, 4].map((r) => r * 5 + c);
      expect(countCompletedLines(marksFromIndexes(col))).toBe(1);
    }
  });

  it("detects the main diagonal", () => {
    const diag = [0, 6, 12, 18, 24];
    expect(countCompletedLines(marksFromIndexes(diag))).toBe(1);
  });

  it("detects the anti-diagonal", () => {
    const diag = [4, 8, 12, 16, 20];
    expect(countCompletedLines(marksFromIndexes(diag))).toBe(1);
  });

  it("counts multiple simultaneous lines (full card = 12 lines)", () => {
    expect(countCompletedLines(new Array(CARD_LENGTH).fill(true))).toBe(12);
  });

  it("counts a row and a column sharing one cell as 2 lines", () => {
    const row0 = [0, 1, 2, 3, 4];
    const col0 = [0, 5, 10, 15, 20];
    expect(countCompletedLines(marksFromIndexes([...row0, ...col0]))).toBe(2);
  });
});
