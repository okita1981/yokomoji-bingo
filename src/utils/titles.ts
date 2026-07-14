import { titleDefinitions, NO_TITLE, SPECIAL_PRIORITY_IDS } from "../data/titles";
import type { TitleDefinition } from "../data/titles";

export type TitleEvaluationInput = {
  bingoCount: number;
  selectedWordCount: number;
  selectedWordIds: string[];
};

type ConditionFn = (input: TitleEvaluationInput, score: number) => boolean;

// 称号IDごとの判定条件（score/bingo/selected/special用）。データ(titles.ts)とロジックを分離して保持する。
const conditionsById: Record<string, ConditionFn> = {
  yokomoji_apprentice: (input) => input.selectedWordCount >= 1,
  yokomoji_native: (input) => input.bingoCount >= 1,
  agenda_checker: (input) => input.selectedWordCount >= 5,
  alignment_staff: (_input, score) => score >= 8,
  high_awareness_master: (_input, score) => score >= 10,
  resolution_supervisor: (_input, score) => score >= 13,
  issue_manager: (_input, score) => score >= 16,
  aspiration_manager: (_input, score) => score >= 20,
  northstar_reacher: (_input, score) => score >= 25,
  corporate_planning_prodigy: (_input, score) => score >= 30,
  capability_head: (_input, score) => score >= 35,
  consulting_fit: (_input, score) => score >= 38,
  chief_buzzword_officer: (input) => input.bingoCount >= 5,
  series_a_ceo: (input) => input.selectedWordCount >= 20,
};

export function computeScore(bingoCount: number, selectedCount: number): number {
  return bingoCount * 5 + selectedCount;
}

function comboMatches(def: TitleDefinition, selectedWordIds: string[]): boolean {
  if (!def.requiredWordIds) return false;
  return def.requiredWordIds.every((id) => selectedWordIds.includes(id));
}

// 称号解決は3段階の階層で行う: ① special（最上位2件） → ② combo（特定ワード組み合わせ） → ③ score/bingo/selected（通常成長）。
// 上位階層が1件でも成立すればその時点で確定し、下位階層は評価しない。同一階層内で複数成立した場合はrank降順で最上位を採る。
export function computeTitleDefinition(input: TitleEvaluationInput): TitleDefinition {
  const score = computeScore(input.bingoCount, input.selectedWordCount);

  const specialDefs = titleDefinitions.filter((d) => d.category === "special");
  for (const specialId of SPECIAL_PRIORITY_IDS) {
    const def = specialDefs.find((d) => d.id === specialId);
    if (def && conditionsById[def.id]?.(input, score)) return def;
  }

  const comboDefs = titleDefinitions.filter((d) => d.category === "combo" && comboMatches(d, input.selectedWordIds));
  if (comboDefs.length > 0) {
    comboDefs.sort((a, b) => b.rank - a.rank);
    return comboDefs[0];
  }

  const normalDefs = titleDefinitions.filter(
    (d) => d.category !== "special" && d.category !== "combo" && conditionsById[d.id]?.(input, score)
  );
  if (normalDefs.length > 0) {
    normalDefs.sort((a, b) => b.rank - a.rank);
    return normalDefs[0];
  }

  return NO_TITLE;
}
