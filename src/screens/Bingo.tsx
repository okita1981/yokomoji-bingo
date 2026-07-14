import type { Word } from "../data/words";
import { BingoCard } from "../components/BingoCard";
import { BingoModal } from "../components/BingoModal";
import { CustomWordInput } from "../components/CustomWordInput";

type Props = {
  card: Word[];
  marked: boolean[];
  bingoCount: number;
  selectedCount: number;
  justBingo: boolean;
  modalTitle: string;
  modalTitleImagePath: string | null;
  modalTitleIsNew: boolean;
  onToggle: (index: number) => void;
  onAcknowledgeBingo: () => void;
  onNewMeeting: () => void;
  onEndMeeting: () => void;
  onAddCustomWord: (label: string, translation: string, meaning: string) => void;
  onOpenGlossary: () => void;
};

export function Bingo({
  card,
  marked,
  bingoCount,
  selectedCount,
  justBingo,
  modalTitle,
  modalTitleImagePath,
  modalTitleIsNew,
  onToggle,
  onAcknowledgeBingo,
  onNewMeeting,
  onEndMeeting,
  onAddCustomWord,
  onOpenGlossary,
}: Props) {
  return (
    <div className="screen bingo-screen">
      <div className="bingo-topbar">
        <div className="bingo-stats">
          <span>
            ビンゴ <strong>{bingoCount}</strong>
          </span>
          <span>
            選択 <strong>{selectedCount}</strong>
          </span>
        </div>
        <button
          type="button"
          className="glossary-btn"
          onClick={onOpenGlossary}
          aria-label="横文字用語集"
        >
          📖 横文字用語集
        </button>
      </div>

      <BingoCard card={card} marked={marked} onToggle={onToggle} />

      <CustomWordInput onAdd={onAddCustomWord} />

      <div className="bingo-actions">
        <button type="button" className="secondary-btn" onClick={onNewMeeting}>
          新しい会議を始める
        </button>
        <button type="button" className="primary-btn" onClick={onEndMeeting}>
          会議を終了する
        </button>
      </div>

      {justBingo && (
        <BingoModal
          title={modalTitle}
          imagePath={modalTitleImagePath}
          isNew={modalTitleIsNew}
          onClose={onAcknowledgeBingo}
        />
      )}
    </div>
  );
}
