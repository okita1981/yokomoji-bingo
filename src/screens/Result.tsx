import { useState } from "react";
import type { Word } from "../data/words";
import type { TitleDefinition } from "../data/titles";
import { shareResult } from "../utils/share";
import { computeScore } from "../utils/titles";

type Props = {
  titleDef: TitleDefinition;
  bingoCount: number;
  selectedWords: Word[];
  bossText: string;
  translation: string;
  onReplay: () => void;
};

export function Result({ titleDef, bingoCount, selectedWords, bossText, translation, onReplay }: Props) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [imageFailed, setImageFailed] = useState(false);

  const score = computeScore(bingoCount, selectedWords.length);
  const showImage = Boolean(titleDef.imagePath) && !imageFailed;

  const handleShare = async () => {
    const result = await shareResult(titleDef.name, titleDef.shareText, translation);
    if (result === "shared") setShareStatus("シェアしました");
    else if (result === "copied") setShareStatus("クリップボードにコピーしました");
    else setShareStatus("シェアに失敗しました");
    window.setTimeout(() => setShareStatus(null), 2500);
  };

  return (
    <div className="screen result-screen">
      <p className="result-eyebrow">今日のあなたの称号</p>

      {showImage && (
        <div className="result-title-image">
          <img src={titleDef.imagePath!} alt={titleDef.name} onError={() => setImageFailed(true)} />
        </div>
      )}

      <h1 className="result-title">{titleDef.name}</h1>
      <p className="result-title-description">{titleDef.description}</p>

      <div className="result-stats">
        <span>
          ビンゴ <strong>{bingoCount}</strong>
        </span>
        <span>
          選択 <strong>{selectedWords.length}</strong>
        </span>
        <span>
          スコア <strong>{score}</strong>
        </span>
      </div>

      <section className="result-section">
        <h2>選択した横文字（{selectedWords.length}語）</h2>
        <div className="result-word-list">
          {selectedWords.length === 0 ? (
            <p className="empty-hint">何も選ばずに会議が終わりました。それはそれで才能です。</p>
          ) : (
            selectedWords.map((w) => (
              <span key={w.id} className="result-word-chip">
                {w.label}
              </span>
            ))
          )}
        </div>
      </section>

      <section className="result-section">
        <h2>ラスボス文章</h2>
        <p className="boss-text">{bossText}</p>
      </section>

      <section className="result-section">
        <h2>現場のおじさん翻訳</h2>
        <p className="translation-text">{translation}</p>
      </section>

      <div className="result-actions">
        <button type="button" className="primary-btn" onClick={handleShare}>
          シェアする
        </button>
        <button type="button" className="secondary-btn" onClick={onReplay}>
          もう一度遊ぶ
        </button>
      </div>

      {shareStatus && <p className="share-status">{shareStatus}</p>}
    </div>
  );
}
