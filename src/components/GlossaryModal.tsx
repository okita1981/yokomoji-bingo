import { useMemo, useState } from "react";
import { words } from "../data/words";
import type { CustomWord } from "../types";
import { filterWords } from "../utils/glossary";

type Props = {
  customWords: CustomWord[];
  onClose: () => void;
};

export function GlossaryModal({ customWords, onClose }: Props) {
  const [query, setQuery] = useState("");

  const allWords = useMemo(() => [...words, ...customWords], [customWords]);
  const filtered = useMemo(() => filterWords(allWords, query), [allWords, query]);

  return (
    <div className="glossary-overlay" role="dialog" aria-modal="true" aria-label="横文字用語集">
      <div className="glossary-header">
        <div>
          <h1>横文字用語集</h1>
          <p className="glossary-subcopy">分かったふりをする前に、一応確認しておこう。</p>
        </div>
        <button type="button" className="glossary-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>

      <input
        type="text"
        className="glossary-search"
        placeholder="横文字や意味で検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="glossary-list">
        {filtered.length === 0 ? (
          <p className="glossary-empty">該当する横文字が見つかりませんでした。</p>
        ) : (
          filtered.map((w) => (
            <div key={w.id} className="glossary-card">
              <h2>{w.label}</h2>
              <p className="glossary-meaning">{w.meaning}</p>
              <p className="glossary-translation-label">翻訳</p>
              <p className="glossary-translation">{w.translation}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
