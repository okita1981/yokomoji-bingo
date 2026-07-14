import type { Word } from "./data/words";

export type CustomWord = Word & { isCustom: true };

export type GameState = {
  card: Word[]; // length 25, index 12 is FREE
  marked: boolean[]; // length 25
  bingoCount: number;
  customWords: CustomWord[];
  version: 1;
};

export const FREE_INDEX = 12;
export const GRID_SIZE = 5;
export const CARD_LENGTH = GRID_SIZE * GRID_SIZE;

export const FREE_WORD: Word = {
  id: "__free__",
  label: "FREE",
  translation: "",
  category: "common",
};
