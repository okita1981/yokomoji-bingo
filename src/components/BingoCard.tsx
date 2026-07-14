import type { Word } from "../data/words";
import { FREE_INDEX } from "../types";

type Props = {
  card: Word[];
  marked: boolean[];
  onToggle: (index: number) => void;
};

export function BingoCard({ card, marked, onToggle }: Props) {
  return (
    <div className="bingo-grid" role="grid" aria-label="ビンゴカード">
      {card.map((word, i) => {
        const isFree = i === FREE_INDEX;
        const isMarked = marked[i];
        return (
          <button
            key={`${word.id}-${i}`}
            type="button"
            className={`bingo-cell${isMarked ? " marked" : ""}${isFree ? " free" : ""}`}
            onClick={() => onToggle(i)}
            disabled={isFree}
            aria-pressed={isMarked}
          >
            <span>{word.label}</span>
          </button>
        );
      })}
    </div>
  );
}
