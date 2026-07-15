import { TitleImage } from "./TitleImage";
import { NewBadge } from "./NewBadge";
import { RarityBadge } from "./RarityBadge";
import type { TitleRarity } from "../data/titles";

type Props = {
  title: string;
  rarity: TitleRarity;
  imagePath: string | null;
  isNew: boolean;
  onClose: () => void;
};

export function BingoModal({ title, rarity, imagePath, isNew, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-eyebrow">BINGO</p>
        <TitleImage imagePath={imagePath} alt={`${title}の称号キャラクターカード`} className="modal-title-image" />
        <RarityBadge rarity={rarity} />
        <p className="modal-title">
          {title}
          {isNew && <NewBadge />}
        </p>
        <button type="button" className="modal-btn" onClick={onClose}>
          続ける
        </button>
      </div>
    </div>
  );
}
