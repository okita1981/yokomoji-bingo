import type { Word } from "../data/words";
import { bossTemplates, punchlines } from "../data/bossTemplates";
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

export type BossResult = {
  text: string;
  usedWords: Word[];
};

// 選択済みワードをシャッフルしテンプレートのスロット数だけ使う。
// 足りない場合は未選択ワードから補充する。
export function generateBossText(selectedWords: Word[], allAvailableWords: Word[] = baseWords): BossResult {
  const template = bossTemplates[Math.floor(Math.random() * bossTemplates.length)];
  const slotCount = countSlots(template);

  const shuffledSelected = shuffle(selectedWords);
  const usedWords: Word[] = shuffledSelected.slice(0, slotCount);

  if (usedWords.length < slotCount) {
    const usedIds = new Set(usedWords.map((w) => w.id));
    const remainingPool = shuffle(allAvailableWords.filter((w) => !usedIds.has(w.id)));
    let poolIdx = 0;
    while (usedWords.length < slotCount) {
      const candidate = remainingPool[poolIdx % remainingPool.length];
      usedWords.push(candidate);
      poolIdx++;
      if (poolIdx > remainingPool.length * 2) break; // safety
    }
  }

  let text = template;
  usedWords.forEach((word, i) => {
    text = text.replace(`{${i}}`, word.label);
  });

  return { text, usedWords };
}

// ラスボス文章で実際に使ったワードのtranslationを使って生成する。
export function generateOjisanTranslation(usedWords: Word[]): string {
  const seen = new Set<string>();
  const fragments: string[] = [];
  for (const w of usedWords) {
    if (!w.translation) continue;
    if (seen.has(w.translation)) continue;
    seen.add(w.translation);
    fragments.push(w.translation);
    if (fragments.length >= 3) break;
  }

  const punchline = punchlines[Math.floor(Math.random() * punchlines.length)];
  const body = fragments.join("、");
  return body ? `${body}。${punchline}` : punchline;
}
