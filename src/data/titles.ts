// スコア = ビンゴ数×5 + 選択ワード数。優先度が高いもの（配列の後ろ）ほど上位。
// 条件を複数満たした場合は最も優先度が高い（配列内で最後にマッチする）称号を採用する。
export type TitleRule = {
  label: string;
  priority: number;
  condition: (bingoCount: number, selectedCount: number, score: number) => boolean;
};

export const titleRules: TitleRule[] = [
  { label: "横文字ネイティブ", priority: 1, condition: (bingo) => bingo >= 1 },
  { label: "意識高い会議マスター", priority: 2, condition: (_b, _s, score) => score >= 10 },
  { label: "アスピレーション管理職", priority: 3, condition: (_b, _s, score) => score >= 15 },
  { label: "ノーススター到達者", priority: 4, condition: (_b, _s, score) => score >= 20 },
  { label: "経営企画の申し子", priority: 5, condition: (_b, _s, score) => score >= 25 },
  { label: "コンサル適性あり", priority: 6, condition: (_b, _s, score) => score >= 30 },
  { label: "Chief Buzzword Officer", priority: 7, condition: (bingo) => bingo >= 3 },
  { label: "シリーズA調達済みCEO", priority: 8, condition: (_b, selected) => selected >= 20 },
];

export const DEFAULT_TITLE = "会議未経験者";
