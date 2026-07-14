import { useState } from "react";
import type { Word } from "../data/words";
import { shareResult } from "../utils/share";

type Props = {
  title: string;
  selectedWords: Word[];
  bossText: string;
  translation: string;
  onReplay: () => void;
};

export function Result({ title, selectedWords, bossText, translation, onReplay }: Props) {
  const [shareStatus, setShareStatus] = useState<string | null>(null);

  const handleShare = async () => {
    const result = await shareResult(title, translation);
    if (result === "shared") setShareStatus("シェアしました");
    else if (result === "copied") setShareStatus("クリップボードにコピーしました");
    else setShareStatus("シェアに失敗しました");
    window.setTimeout(() => setShareStatus(null), 2500);
  };

  return (
    <div className="screen result-screen">
      <p className="result-eyebrow">今日のあなたの称号</p>
      <h1 className="result-title">{title}</h1>

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
