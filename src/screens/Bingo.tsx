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
  onToggle: (index: number) => void;
  onAcknowledgeBingo: () => void;
  onNewMeeting: () => void;
  onEndMeeting: () => void;
  onHide: () => void;
  onAddCustomWord: (label: string, translation: string) => void;
};

export function Bingo({
  card,
  marked,
  bingoCount,
  selectedCount,
  justBingo,
  modalTitle,
  onToggle,
  onAcknowledgeBingo,
  onNewMeeting,
  onEndMeeting,
  onHide,
  onAddCustomWord,
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
        <button type="button" className="hide-btn" onClick={onHide} aria-label="隠す">
          隠す
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

      {justBingo && <BingoModal title={modalTitle} onClose={onAcknowledgeBingo} />}
    </div>
  );
}
