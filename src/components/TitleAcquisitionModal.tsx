import { useEffect, useRef } from "react";
import type { TitleDefinition } from "../data/titles";
import { TitleImage } from "./TitleImage";
import { RarityBadge } from "./RarityBadge";

type Props = {
  titleDef: TitleDefinition;
  onContinue: () => void;
};

// 称号を初めて獲得した瞬間だけ表示する演出モーダル。音は使わず、数秒での自動クローズもしない。
export function TitleAcquisitionModal({ titleDef, onContinue }: Props) {
  const continueButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    continueButtonRef.current?.focus();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onContinue();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onContinue]);

  return (
    <div
      className={`acquisition-overlay rarity-glow-${titleDef.rarity.toLowerCase()}`}
      role="dialog"
      aria-modal="true"
      aria-label="称号獲得"
    >
      <div className="acquisition-card">
        <p className="acquisition-eyebrow">NEW TITLE</p>
        <p className="acquisition-subcopy">称号を獲得しました</p>

        <TitleImage imagePath={titleDef.imagePath} alt={`${titleDef.name}の称号キャラクターカード`} className="acquisition-image" />

        <div className="acquisition-rarity">
          <RarityBadge rarity={titleDef.rarity} />
        </div>

        <h1 className="acquisition-title">{titleDef.name}</h1>
        <p className="acquisition-description">{titleDef.description}</p>

        <button type="button" className="primary-btn" onClick={onContinue} ref={continueButtonRef}>
          結果を見る
        </button>
      </div>
    </div>
  );
}
