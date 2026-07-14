import type { Word } from "../data/words";

// label・meaningの両方を対象に、大文字小文字を無視した部分一致で絞り込む。
export function filterWords(words: Word[], query: string): Word[] {
  const trimmed = query.trim().toLowerCase();
  if (!trimmed) return words;
  return words.filter(
    (w) => w.label.toLowerCase().includes(trimmed) || w.meaning.toLowerCase().includes(trimmed)
  );
}
