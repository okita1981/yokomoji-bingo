import { useEffect, useRef } from "react";
import type { TitleDefinition } from "../data/titles";
import type { UnlockedTitleRecord } from "../utils/titleCollection";
import { TitleImage } from "./TitleImage";
import { RarityBadge } from "./RarityBadge";

type Props = {
  titleDef: TitleDefinition;
  record: UnlockedTitleRecord;
  onClose: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function CardZoomModal({ titleDef, record, onClose }: Props) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="card-zoom-overlay" role="dialog" aria-modal="true" aria-label={`${titleDef.name}のカード拡大表示`}>
      <div className="card-zoom-content">
        <button type="button" className="glossary-close card-zoom-close" onClick={onClose} aria-label="閉じる" ref={closeButtonRef}>
          ×
        </button>

        <TitleImage imagePath={titleDef.imagePath} alt={`${titleDef.name}の称号キャラクターカード`} className="card-zoom-image" />

        <RarityBadge rarity={titleDef.rarity} />
        <h1 className="result-title">{titleDef.name}</h1>
        <p className="result-title-description">{titleDef.description}</p>

        <dl className="collection-card-stats card-zoom-stats">
          <div>
            <dt>初回獲得日</dt>
            <dd>{formatDate(record.firstUnlockedAt)}</dd>
          </div>
          <div>
            <dt>獲得回数</dt>
            <dd>{record.unlockCount}回</dd>
          </div>
          <div>
            <dt>最高スコア</dt>
            <dd>{record.bestScore}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
