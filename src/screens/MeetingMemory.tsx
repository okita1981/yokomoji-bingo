import { useState } from "react";
import { titleDefinitions, NO_TITLE } from "../data/titles";
import type { MeetingMemory as MeetingMemoryData } from "../utils/meetingMemory";
import { TitleImage } from "../components/TitleImage";
import { shareResult } from "../utils/share";

type Props = {
  memories: MeetingMemoryData[];
  onClose: () => void;
  onDeleteOne: (id: string) => void;
  onDeleteAll: () => void;
};

function resolveTitleDef(titleId: string) {
  return titleDefinitions.find((d) => d.id === titleId) ?? NO_TITLE;
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`;
}

export function MeetingMemory({ memories, onClose, onDeleteOne, onDeleteAll }: Props) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirmingDeleteAll, setConfirmingDeleteAll] = useState(false);

  const selected = memories.find((m) => m.id === selectedId) ?? null;

  if (selected) {
    const def = resolveTitleDef(selected.titleId);
    return (
      <div className="screen memory-detail-screen">
        <div className="collection-header">
          <h1>会議メモリ</h1>
          <button type="button" className="glossary-close" onClick={() => setSelectedId(null)} aria-label="一覧へ戻る">
            ×
          </button>
        </div>

        <TitleImage imagePath={def.imagePath} alt={def.name} className="result-title-image" />
        <h2 className="result-title">{def.name}</h2>
        <p className="result-title-description">{def.description}</p>

        <section className="result-section">
          <h2>選択した横文字（{selected.selectedWordLabels.length}語）</h2>
          <div className="result-word-list">
            {selected.selectedWordLabels.map((label, i) => (
              <span key={`${label}-${i}`} className="result-word-chip">
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="result-section">
          <h2>本日の議事録</h2>
          <p className="meeting-minutes-text">{selected.meetingMinutes}</p>
        </section>

        <section className="result-section">
          <h2>翻訳</h2>
          <p className="translation-text">{selected.translation}</p>
        </section>

        <div className="result-actions">
          <button
            type="button"
            className="primary-btn"
            onClick={() => shareResult(def.name, def.shareText, selected.meetingMinutes, selected.translation)}
          >
            シェアする
          </button>
          <button
            type="button"
            className="secondary-btn"
            onClick={() => {
              onDeleteOne(selected.id);
              setSelectedId(null);
            }}
          >
            この会議メモリを削除
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen memory-list-screen">
      <div className="collection-header">
        <h1>会議メモリ</h1>
        <button type="button" className="glossary-close" onClick={onClose} aria-label="閉じる">
          ×
        </button>
      </div>

      {memories.length === 0 ? (
        <p className="empty-hint">まだ会議メモリがありません。会議を終了すると記録されます。</p>
      ) : (
        <>
          <div className="memory-list">
            {memories.map((m) => {
              const def = resolveTitleDef(m.titleId);
              return (
                <button
                  type="button"
                  key={m.id}
                  className="memory-card"
                  onClick={() => setSelectedId(m.id)}
                >
                  <p className="memory-card-date">{formatDateTime(m.createdAt)}</p>
                  <p className="memory-card-title">{def.name}</p>
                  <p className="memory-card-stats">
                    ビンゴ{m.bingoCount}・選択{m.selectedWordCount}・スコア{m.score}
                  </p>
                  <p className="memory-card-translation">{m.translation}</p>
                </button>
              );
            })}
          </div>

          <button type="button" className="memory-delete-all" onClick={() => setConfirmingDeleteAll(true)}>
            全件削除
          </button>
        </>
      )}

      {confirmingDeleteAll && (
        <div className="modal-overlay" onClick={() => setConfirmingDeleteAll(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <p className="modal-title">会議メモリを全件削除しますか？</p>
            <p className="modal-eyebrow">この操作は取り消せません（称号コレクションは削除されません）</p>
            <div className="custom-word-actions">
              <button
                type="button"
                onClick={() => {
                  onDeleteAll();
                  setConfirmingDeleteAll(false);
                }}
              >
                削除する
              </button>
              <button type="button" onClick={() => setConfirmingDeleteAll(false)}>
                キャンセル
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
