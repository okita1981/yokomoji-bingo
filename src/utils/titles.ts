import { titleDefinitions, NO_TITLE } from "../data/titles";
import type { TitleDefinition } from "../data/titles";

type ConditionFn = (bingoCount: number, selectedCount: number, score: number) => boolean;

// 称号IDごとの判定条件。データ(titles.ts)とロジックを分離して保持する。
const conditionsById: Record<string, ConditionFn> = {
  yokomoji_native: (bingoCount) => bingoCount >= 1,
  high_awareness_master: (_b, _s, score) => score >= 10,
  aspiration_manager: (_b, _s, score) => score >= 15,
  northstar_reacher: (_b, _s, score) => score >= 20,
  corporate_planning_prodigy: (_b, _s, score) => score >= 25,
  consulting_fit: (_b, _s, score) => score >= 30,
  chief_buzzword_officer: (bingoCount) => bingoCount >= 3,
  series_a_ceo: (_b, selectedCount) => selectedCount >= 20,
};

export function computeScore(bingoCount: number, selectedCount: number): number {
  return bingoCount * 5 + selectedCount;
}

// rank降順で最上位の称号を返す。条件を1つも満たさない場合はNO_TITLEを返す。
export function computeTitleDefinition(bingoCount: number, selectedCount: number): TitleDefinition {
  const score = computeScore(bingoCount, selectedCount);
  const matched = titleDefinitions.filter((def) => conditionsById[def.id]?.(bingoCount, selectedCount, score));
  if (matched.length === 0) return NO_TITLE;
  matched.sort((a, b) => b.rank - a.rank);
  return matched[0];
}
