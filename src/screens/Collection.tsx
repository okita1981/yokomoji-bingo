import { useState } from "react";
import { titleDefinitions } from "../data/titles";
import type { TitleDefinition } from "../data/titles";
import type { UnlockedTitleRecord } from "../utils/titleCollection";
import { TitleImage } from "../components/TitleImage";
import { RarityBadge } from "../components/RarityBadge";
import { CardZoomModal } from "../components/CardZoomModal";

type Props = {
  records: UnlockedTitleRecord[];
  onClose: () => void;
  onReset: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function Collection({ records, onClose, onReset }: Props) {
  const [confirmingReset, setConfirmingReset] = useState(false);
  const [resetStatus, setResetStatus] = useState<string | null>(null);
  const [zoomedTitle, setZoomedTitle] = useState<TitleDefinition | null>(null);

  const sorted = [...titleDefinitions].sort((a, b) => a.rank - b.rank);
  const recordById = new Map(records.map((r) => [r.titleId, r]));

  const handleConfirmReset = () => {
    onReset();
    setConfirmingReset(false);
    setResetStatus("意識を初期化しました。日本語から再出発します。");
    window.setTimeout(() => setResetStatus(null), 2500);
  };

  const zoomedRecord = zoomedTitle ? recordById.get(zoomedTitle.id) : undefined;

  return (
    <div className="screen collection-screen">
      <div className="collection-header">
        <h1>称号コレクション</h1>
        <button type="button" className="glossary-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>

      <p className="collection-progress">
        {records.length} / {titleDefinitions.length} 獲得
      </p>

      <div className="collection-list">
        {sorted.map((def) => {
          const record = recordById.get(def.id);
          if (record) {
            return (
              <button
                key={def.id}
                type="button"
                className="collection-card unlocked"
                onClick={() => setZoomedTitle(def)}
              >
                <TitleImage
                  imagePath={def.imagePath}
                  alt={`${def.name}の称号キャラクターカード`}
                  className="collection-card-image"
                />
                <RarityBadge rarity={def.rarity} />
                <h2>{def.name}</h2>
                <p className="collection-card-description">{def.description}</p>
                <dl className="collection-card-stats">
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
                <p className="collection-card-condition">{def.conditionLabel}</p>
              </button>
            );
          }
          return (
            <div key={def.id} className="collection-card locked">
              <RarityBadge rarity={def.rarity} />
              <h2>{def.name}</h2>
              <p className="collection-card-condition">{def.conditionLabel}</p>
              <p className="collection-card-locked-label">未獲得</p>
            </div>
          );
        })}
      </div>

      <button type="button" className="collection-reset-btn" onClick={() => setConfirmingReset(true)}>
        意識を初期化する
      </button>

      {resetStatus && <p className="share-status">{resetStatus}</p>}

      {confirmingReset && (
        <div className="modal-overlay" onClick={() => setConfirmingReset(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">
              これまで獲得した称号、獲得回数、最高スコアをすべて削除します。
              <br />
              あなたは再び「まだ日本語で会話できる人」に戻ります。
              <br />
              本当に意識を初期化しますか？
            </p>
            <div className="custom-word-actions">
              <button type="button" onClick={handleConfirmReset}>
                初期化する
              </button>
              <button type="button" onClick={() => setConfirmingReset(false)}>
                アスピレーションを維持する
              </button>
            </div>
          </div>
        </div>
      )}

      {zoomedTitle && zoomedRecord && (
        <CardZoomModal titleDef={zoomedTitle} record={zoomedRecord} onClose={() => setZoomedTitle(null)} />
      )}
    </div>
  );
}
