import { GRID_SIZE } from "../types";

// 12ライン：縦5・横5・斜め2
export const LINES: number[][] = (() => {
  const lines: number[][] = [];
  for (let r = 0; r < GRID_SIZE; r++) {
    lines.push([0, 1, 2, 3, 4].map((c) => r * GRID_SIZE + c));
  }
  for (let c = 0; c < GRID_SIZE; c++) {
    lines.push([0, 1, 2, 3, 4].map((r) => r * GRID_SIZE + c));
  }
  lines.push([0, 1, 2, 3, 4].map((i) => i * GRID_SIZE + i));
  lines.push([0, 1, 2, 3, 4].map((i) => i * GRID_SIZE + (GRID_SIZE - 1 - i)));
  return lines;
})();

export function countCompletedLines(marked: boolean[]): number {
  return LINES.filter((line) => line.every((idx) => marked[idx])).length;
}

export function completedLineIndexes(marked: boolean[]): number[][] {
  return LINES.filter((line) => line.every((idx) => marked[idx]));
}
