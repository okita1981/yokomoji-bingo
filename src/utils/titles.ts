import { titleRules, DEFAULT_TITLE } from "../data/titles";

export function computeTitle(bingoCount: number, selectedCount: number): string {
  const score = bingoCount * 5 + selectedCount;
  const matched = titleRules.filter((rule) => rule.condition(bingoCount, selectedCount, score));
  if (matched.length === 0) return DEFAULT_TITLE;
  matched.sort((a, b) => b.priority - a.priority);
  return matched[0].label;
}

export function computeScore(bingoCount: number, selectedCount: number): number {
  return bingoCount * 5 + selectedCount;
}
