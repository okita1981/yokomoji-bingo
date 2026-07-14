import { TitleImage } from "./TitleImage";
import { NewBadge } from "./NewBadge";

type Props = {
  title: string;
  imagePath: string | null;
  isNew: boolean;
  onClose: () => void;
};

export function BingoModal({ title, imagePath, isNew, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-eyebrow">BINGO</p>
        <TitleImage imagePath={imagePath} alt={title} className="modal-title-image" />
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
