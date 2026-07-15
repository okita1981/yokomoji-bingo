import type { Word } from "../data/words";
import {
  meetingMinuteTemplates,
  translationPunchlines,
  categoryPunchlines,
} from "../data/meetingMinuteTemplates";
import type { MeetingMinuteTemplateCategory } from "../data/meetingMinuteTemplates";
import { words as baseWords } from "../data/words";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function countSlots(template: string): number {
  const matches = template.match(/\{\d+\}/g) ?? [];
  const nums = matches.map((m) => parseInt(m.slice(1, -1), 10));
  return nums.length === 0 ? 0 : Math.max(...nums) + 1;
}

export type MeetingMinutesResult = {
  text: string;
  usedWords: Word[];
  category: MeetingMinuteTemplateCategory;
};

// 選択済みワードをシャッフルしテンプレートのスロット数だけ使う。
// 足りない場合は未選択ワードから補充する。テンプレート本文に既に固定で
// 埋め込まれている語（excludedWordIds）は、二重に登場しないようスロット候補から除く。
export function generateMeetingMinutes(
  selectedWords: Word[],
  allAvailableWords: Word[] = baseWords
): MeetingMinutesResult {
  const template = meetingMinuteTemplates[Math.floor(Math.random() * meetingMinuteTemplates.length)];
  const slotCount = countSlots(template.template);
  const excluded = new Set(template.excludedWordIds ?? []);

  const eligibleSelected = shuffle(selectedWords.filter((w) => !excluded.has(w.id)));
  const usedWords: Word[] = eligibleSelected.slice(0, slotCount);

  if (usedWords.length < slotCount) {
    const usedIds = new Set(usedWords.map((w) => w.id));
    const remainingPool = shuffle(
      allAvailableWords.filter((w) => !usedIds.has(w.id) && !excluded.has(w.id))
    );
    let poolIdx = 0;
    while (usedWords.length < slotCount && remainingPool.length > 0) {
      const candidate = remainingPool[poolIdx % remainingPool.length];
      usedWords.push(candidate);
      poolIdx++;
      if (poolIdx > remainingPool.length * 2) break; // safety
    }
  }

  let text = template.template;
  usedWords.forEach((word, i) => {
    text = text.replace(`{${i}}`, word.label);
  });

  return { text, usedWords, category: template.category };
}

// 3つの断片を組み合わせる構文パターン。単純な「、」区切り以外に4種類のバリエーションを持たせる。
const BODY_PATTERNS: Array<(f: string[]) => string> = [
  (f) => `${f[0]}、${f[1]}、${f[2]}。`,
  (f) => `${f[0]}、そのうえで${f[1]}、最終的に${f[2]}。`,
  (f) => `まず${f[0]}、次に${f[1]}、あとは${f[2]}。`,
  (f) => `${f[0]}ながら${f[1]}、うまく${f[2]}。`,
  (f) => `${f[0]}を経て${f[1]}、結果として${f[2]}。`,
];

export function buildTranslationBody(fragments: string[], patternIndex?: number): string {
  if (fragments.length === 0) return "";
  if (fragments.length < 3) {
    // 断片が3未満だと構文パターンが不自然になるため、単純連結にフォールバックする。
    return `${fragments.join("、")}。`;
  }
  const idx = patternIndex ?? Math.floor(Math.random() * BODY_PATTERNS.length);
  return BODY_PATTERNS[idx](fragments);
}

export function pickPunchline(category?: MeetingMinuteTemplateCategory): string {
  const candidates = (category && categoryPunchlines[category]) || translationPunchlines;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// 議事録で実際に使ったワードのtranslationを使って生成する。
// カテゴリを渡すと、会議の性格に応じた締め文（punchline）を優先的に選ぶ。
export function generateTranslation(usedWords: Word[], category?: MeetingMinuteTemplateCategory): string {
  const seen = new Set<string>();
  const fragments: string[] = [];
  for (const w of usedWords) {
    if (!w.translation) continue;
    if (seen.has(w.translation)) continue;
    seen.add(w.translation);
    fragments.push(w.translation);
    if (fragments.length >= 3) break;
  }

  const punchline = pickPunchline(category);
  const body = buildTranslationBody(fragments);
  return body ? `${body}${punchline}` : punchline;
}

export { BODY_PATTERNS };
