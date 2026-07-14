import { useState } from "react";
import type { Word } from "../data/words";
import type { CustomWord } from "../types";
import { BingoCard } from "../components/BingoCard";
import { BingoModal } from "../components/BingoModal";
import { CustomWordInput } from "../components/CustomWordInput";
import { GlossaryModal } from "../components/GlossaryModal";

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
  onAddCustomWord: (label: string, translation: string, meaning: string) => void;
  customWords: CustomWord[];
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
  onAddCustomWord,
  customWords,
}: Props) {
  const [glossaryOpen, setGlossaryOpen] = useState(false);

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
          onClick={() => setGlossaryOpen(true)}
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

      {justBingo && <BingoModal title={modalTitle} onClose={onAcknowledgeBingo} />}

      {glossaryOpen && (
        <GlossaryModal customWords={customWords} onClose={() => setGlossaryOpen(false)} />
      )}
    </div>
  );
}
