import { useCallback, useEffect, useRef, useState } from "react";
import { generateCard, initialMarks } from "../utils/cardGen";
import { countCompletedLines } from "../utils/bingo";
import { FREE_INDEX } from "../types";
import type { CustomWord } from "../types";
import type { Word } from "../data/words";
import { CUSTOM_WORD_DEFAULT_MEANING, CUSTOM_WORD_DEFAULT_TRANSLATION } from "../data/words";

const GAME_KEY = "yokomoji-bingo:game:v1";
const CUSTOM_WORDS_KEY = "yokomoji-bingo:customWords:v1";

type StoredGame = {
  card: Word[];
  marked: boolean[];
  bingoCount: number;
};

// 旧データ（meaning未設定・カモフラージュ機能時代の保存分）との互換性を保つための補完。
function withWordDefaults(word: Word): Word {
  return {
    ...word,
    meaning: word.meaning ?? CUSTOM_WORD_DEFAULT_MEANING,
    translation: word.translation ?? CUSTOM_WORD_DEFAULT_TRANSLATION,
  };
}

function loadCustomWords(): CustomWord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as CustomWord[];
    return parsed.map((w) => withWordDefaults(w) as CustomWord);
  } catch {
    return [];
  }
}

function loadGame(): StoredGame | null {
  try {
    const raw = localStorage.getItem(GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredGame;
    if (!parsed.card || !parsed.marked) return null;
    return { ...parsed, card: parsed.card.map(withWordDefaults) };
  } catch {
    return null;
  }
}

export function useGameState() {
  const [customWords, setCustomWords] = useState<CustomWord[]>(() => loadCustomWords());

  const [card, setCard] = useState<Word[]>(() => {
    const saved = loadGame();
    return saved?.card ?? generateCard(loadCustomWords());
  });
  const [marked, setMarked] = useState<boolean[]>(() => {
    const saved = loadGame();
    return saved?.marked ?? initialMarks();
  });
  const [bingoCount, setBingoCount] = useState<number>(() => {
    const saved = loadGame();
    return saved?.bingoCount ?? 0;
  });

  const prevLineCount = useRef(countCompletedLines(marked));
  const [justBingo, setJustBingo] = useState(false);

  useEffect(() => {
    localStorage.setItem(GAME_KEY, JSON.stringify({ card, marked, bingoCount }));
  }, [card, marked, bingoCount]);

  useEffect(() => {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(customWords));
  }, [customWords]);

  const toggleCell = useCallback(
    (index: number) => {
      if (index === FREE_INDEX) return;
      setMarked((prev) => {
        const next = [...prev];
        next[index] = !next[index];
        const newLineCount = countCompletedLines(next);
        if (newLineCount > prevLineCount.current) {
          setBingoCount(newLineCount);
          setJustBingo(true);
        } else {
          setBingoCount(newLineCount);
        }
        prevLineCount.current = newLineCount;
        return next;
      });
    },
    []
  );

  const acknowledgeBingo = useCallback(() => setJustBingo(false), []);

  const newMeeting = useCallback(() => {
    const newCard = generateCard(customWords);
    const newMarks = initialMarks();
    setCard(newCard);
    setMarked(newMarks);
    setBingoCount(0);
    prevLineCount.current = 0;
    setJustBingo(false);
  }, [customWords]);

  const addCustomWord = useCallback((label: string, translation: string, meaning: string = "") => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;
    const trimmedTranslation = translation.trim() || CUSTOM_WORD_DEFAULT_TRANSLATION;
    const trimmedMeaning = meaning.trim() || CUSTOM_WORD_DEFAULT_MEANING;
    const newWord: CustomWord = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: trimmedLabel,
      meaning: trimmedMeaning,
      translation: trimmedTranslation,
      category: "common",
      isCustom: true,
    };
    setCustomWords((prev) => [...prev, newWord]);
  }, []);

  const selectedWords = card.filter((_w, i) => marked[i] && i !== FREE_INDEX);

  return {
    card,
    marked,
    bingoCount,
    customWords,
    selectedWords,
    justBingo,
    toggleCell,
    acknowledgeBingo,
    newMeeting,
    addCustomWord,
  };
}
