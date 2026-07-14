const MEETING_MEMORIES_KEY = "yokomoji-bingo:meetingMemories:v1";
const MAX_MEMORIES = 100;

export type MeetingMemory = {
  id: string;
  createdAt: string;
  titleId: string;
  bingoCount: number;
  selectedWordCount: number;
  score: number;
  selectedWordIds: string[];
  selectedWordLabels: string[];
  bossSentence: string;
  translation: string;
};

function isValidMemory(value: unknown): value is MeetingMemory {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  return (
    typeof m.id === "string" &&
    typeof m.createdAt === "string" &&
    typeof m.titleId === "string" &&
    typeof m.bingoCount === "number" &&
    typeof m.selectedWordCount === "number" &&
    typeof m.score === "number" &&
    Array.isArray(m.selectedWordIds) &&
    Array.isArray(m.selectedWordLabels) &&
    typeof m.bossSentence === "string" &&
    typeof m.translation === "string"
  );
}

export function loadMeetingMemories(): MeetingMemory[] {
  try {
    const raw = localStorage.getItem(MEETING_MEMORIES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isValidMemory);
  } catch {
    return [];
  }
}

function saveMeetingMemories(memories: MeetingMemory[]): void {
  localStorage.setItem(MEETING_MEMORIES_KEY, JSON.stringify(memories));
}

function generateMemoryId(): string {
  return `meeting_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// 新しい順（先頭）に追加し、最大100件を超えた分は古いものから削除する。
export function addMeetingMemory(
  data: Omit<MeetingMemory, "id" | "createdAt">,
  nowIso: string
): MeetingMemory[] {
  const memories = loadMeetingMemories();
  const newMemory: MeetingMemory = {
    id: generateMemoryId(),
    createdAt: nowIso,
    ...data,
  };
  const next = [newMemory, ...memories].slice(0, MAX_MEMORIES);
  saveMeetingMemories(next);
  return next;
}

export function deleteMeetingMemory(id: string): MeetingMemory[] {
  const next = loadMeetingMemories().filter((m) => m.id !== id);
  saveMeetingMemories(next);
  return next;
}

export function deleteAllMeetingMemories(): MeetingMemory[] {
  saveMeetingMemories([]);
  return [];
}

export { MAX_MEMORIES };
