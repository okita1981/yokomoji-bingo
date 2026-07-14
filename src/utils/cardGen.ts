import type { Word } from "../data/words";
import { words as baseWords } from "../data/words";
import { CARD_LENGTH, FREE_INDEX, FREE_WORD } from "../types";
import type { CustomWord } from "../types";

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function generateCard(customWords: CustomWord[] = []): Word[] {
  const pool = [...baseWords, ...customWords];
  const needed = CARD_LENGTH - 1; // FREE takes one slot
  const shuffled = shuffle(pool);
  const picked = shuffled.slice(0, Math.min(needed, shuffled.length));

  // If pool is smaller than needed (shouldn't happen with 40 base words), pad with repeats.
  while (picked.length < needed) {
    picked.push(shuffled[picked.length % shuffled.length]);
  }

  const card: Word[] = [];
  let pickIdx = 0;
  for (let i = 0; i < CARD_LENGTH; i++) {
    if (i === FREE_INDEX) {
      card.push(FREE_WORD);
    } else {
      card.push(picked[pickIdx]);
      pickIdx++;
    }
  }
  return card;
}

export function initialMarks(): boolean[] {
  const marks = new Array(CARD_LENGTH).fill(false);
  marks[FREE_INDEX] = true;
  return marks;
}
