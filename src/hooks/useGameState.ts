import { useCallback, useEffect, useRef, useState } from "react";
import { generateCard, initialMarks } from "../utils/cardGen";
import { countCompletedLines } from "../utils/bingo";
import { FREE_INDEX } from "../types";
import type { CustomWord } from "../types";
import type { Word } from "../data/words";

const GAME_KEY = "yokomoji-bingo:game:v1";
const CUSTOM_WORDS_KEY = "yokomoji-bingo:customWords:v1";

type StoredGame = {
  card: Word[];
  marked: boolean[];
  bingoCount: number;
};

function loadCustomWords(): CustomWord[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CustomWord[];
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
    return parsed;
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

  const addCustomWord = useCallback((label: string, translation: string) => {
    const trimmedLabel = label.trim();
    if (!trimmedLabel) return;
    const trimmedTranslation = translation.trim() || "よしなに進めて";
    const newWord: CustomWord = {
      id: `custom_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      label: trimmedLabel,
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
