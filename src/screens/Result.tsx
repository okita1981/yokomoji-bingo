import { useState } from "react";
import type { Word } from "../data/words";
import type { TitleDefinition } from "../data/titles";
import { shareResult } from "../utils/share";
import { computeScore } from "../utils/titles";
import { TitleImage } from "../components/TitleImage";
import { NewBadge } from "../components/NewBadge";
import { RarityBadge } from "../components/RarityBadge";

type Props = {
  titleDef: TitleDefinition;
  isNewTitle: boolean;
  unlockCount: number;
  bingoCount: number;
  selectedWords: Word[];
  meetingMinutes: string;
  translation: string;
  onReplay: () => void;
  onViewCollection: () => void;
};

export function Result({
  titleDef,
  isNewTitle,
  unlockCount,
  bingoCount,
  selectedWords,
  meetingMinutes,
  translation,
  onReplay,
  onViewCollection,
}: Props) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const score = computeScore(bingoCount, selectedWords.length);

  const handleShare = async () => {
    const result = await shareResult(titleDef.name, titleDef.shareText, meetingMinutes, translation);
    if (result === "shared") setShareStatus("シェアしました");
    else if (result === "copied") setShareStatus("クリップボードにコピーしました");
    else setShareStatus("シェアに失敗しました");
    window.setTimeout(() => setShareStatus(null), 2500);
  };

  return (
    <div className="screen result-screen">
      <p className="result-eyebrow">今日のあなたの称号</p>

      {isNewTitle ? (
        <div className="result-new-badge">
          <NewBadge />
        </div>
      ) : (
        unlockCount > 1 && <p className="result-reacquired">この称号を再獲得しました（獲得回数：{unlockCount}回）</p>
      )}

      <TitleImage
        imagePath={titleDef.imagePath}
        alt={`${titleDef.name}の称号キャラクターカード`}
        className="result-title-image"
      />

      <RarityBadge rarity={titleDef.rarity} />

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
        <h2>本日の議事録</h2>
        <p className="meeting-minutes-text">{meetingMinutes}</p>
      </section>

      <section className="result-section">
        <h2>翻訳</h2>
        <p className="translation-text">{translation}</p>
      </section>

      <div className="result-actions">
        <button type="button" className="primary-btn" onClick={handleShare}>
          シェアする
        </button>
        <button type="button" className="secondary-btn" onClick={onViewCollection}>
          コレクションを見る
        </button>
        <button type="button" className="secondary-btn" onClick={onReplay}>
          もう一度遊ぶ
        </button>
      </div>

      {shareStatus && <p className="share-status">{shareStatus}</p>}
    </div>
  );
}
