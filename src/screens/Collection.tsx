import { titleDefinitions } from "../data/titles";
import type { UnlockedTitleRecord } from "../utils/titleCollection";
import { TitleImage } from "../components/TitleImage";

type Props = {
  records: UnlockedTitleRecord[];
  onClose: () => void;
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

export function Collection({ records, onClose }: Props) {
  const sorted = [...titleDefinitions].sort((a, b) => a.rank - b.rank);
  const recordById = new Map(records.map((r) => [r.titleId, r]));

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
              <div key={def.id} className="collection-card unlocked">
                <TitleImage imagePath={def.imagePath} alt={def.name} className="collection-card-image" />
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
              </div>
            );
          }
          return (
            <div key={def.id} className="collection-card locked">
              <h2>{def.name}</h2>
              <p className="collection-card-condition">{def.conditionLabel}</p>
              <p className="collection-card-locked-label">未獲得</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
