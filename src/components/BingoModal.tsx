type Props = {
  title: string;
  onClose: () => void;
};

export function BingoModal({ title, onClose }: Props) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <p className="modal-eyebrow">BINGO</p>
        <p className="modal-title">{title}</p>
        <button type="button" className="modal-btn" onClick={onClose}>
          続ける
        </button>
      </div>
    </div>
  );
}
