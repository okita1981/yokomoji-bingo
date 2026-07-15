const TITLE_COLLECTION_KEY = "yokomoji-bingo:titleCollection:v1";

export type UnlockedTitleRecord = {
  titleId: string;
  firstUnlockedAt: string;
  lastUnlockedAt: string;
  unlockCount: number;
  bestScore: number;
  bestBingoCount: number;
  bestSelectedWordCount: number;
};

function isValidRecord(value: unknown): value is UnlockedTitleRecord {
  if (!value || typeof value !== "object") return false;
  const r = value as Record<string, unknown>;
  return (
    typeof r.titleId === "string" &&
    typeof r.firstUnlockedAt === "string" &&
    typeof r.lastUnlockedAt === "string" &&
    typeof r.unlockCount === "number" &&
    typeof r.bestScore === "number" &&
    typeof r.bestBingoCount === "number" &&
    typeof r.bestSelectedWordCount === "number"
  );
}

export function loadTitleCollection(): UnlockedTitleRecord[] {
  try {
    const raw = localStorage.getItem(TITLE_COLLECTION_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidRecord);
  } catch {
    return [];
  }
}

function saveTitleCollection(records: UnlockedTitleRecord[]): void {
  localStorage.setItem(TITLE_COLLECTION_KEY, JSON.stringify(records));
}

export function isTitleUnlocked(titleId: string, records: UnlockedTitleRecord[] = loadTitleCollection()): boolean {
  return records.some((r) => r.titleId === titleId);
}

// 会議終了時に1回だけ呼ぶ。称号コレクションに反映し、初獲得だったかどうかを返す。
export function recordTitleUnlock(
  titleId: string,
  stats: { score: number; bingoCount: number; selectedWordCount: number },
  nowIso: string
): { records: UnlockedTitleRecord[]; isNew: boolean } {
  const records = loadTitleCollection();
  const existingIndex = records.findIndex((r) => r.titleId === titleId);

  if (existingIndex === -1) {
    const newRecord: UnlockedTitleRecord = {
      titleId,
      firstUnlockedAt: nowIso,
      lastUnlockedAt: nowIso,
      unlockCount: 1,
      bestScore: stats.score,
      bestBingoCount: stats.bingoCount,
      bestSelectedWordCount: stats.selectedWordCount,
    };
    const next = [...records, newRecord];
    saveTitleCollection(next);
    return { records: next, isNew: true };
  }

  const existing = records[existingIndex];
  const updated: UnlockedTitleRecord = {
    ...existing,
    lastUnlockedAt: nowIso,
    unlockCount: existing.unlockCount + 1,
    bestScore: Math.max(existing.bestScore, stats.score),
    bestBingoCount: Math.max(existing.bestBingoCount, stats.bingoCount),
    bestSelectedWordCount: Math.max(existing.bestSelectedWordCount, stats.selectedWordCount),
  };
  const next = [...records];
  next[existingIndex] = updated;
  saveTitleCollection(next);
  return { records: next, isNew: false };
}

// 称号コレクションのみを初期化する。会議メモリ・カスタムワード・進行中カード等、
// 他のlocalStorageキーには一切触れない（責務は完全に独立している）。
export function resetTitleCollection(): void {
  saveTitleCollection([]);
}
