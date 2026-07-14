// 称号の構造化データ。判定ロジックは utils/titles.ts に分離する（本ファイルは純粋なデータのみ）。
// rank が高いほど上位。複数条件が同時に成立した場合は rank が最も高いものを採用する。
export type TitleDefinition = {
  id: string;
  name: string;
  description: string;
  rank: number;
  imagePath: string | null; // 将来のキャラクターイラスト用。未配置時はnull。
  shareText: string;
  conditionLabel: string;
};

export const titleDefinitions: TitleDefinition[] = [
  {
    id: "yokomoji_native",
    name: "横文字ネイティブ",
    description: "会議の言葉を聞き逃さない、若手有望株。",
    rank: 1,
    imagePath: null,
    shareText: "会議の横文字を、ひとつも聞き逃さなかった。",
    conditionLabel: "ビンゴを1ライン達成",
  },
  {
    id: "high_awareness_master",
    name: "意識高い会議マスター",
    description: "会議の空気を読みながら、横文字も的確に選べるようになった。",
    rank: 2,
    imagePath: null,
    shareText: "気づいたら意識が高くなっていた。",
    conditionLabel: "スコア10以上",
  },
  {
    id: "aspiration_manager",
    name: "アスピレーション管理職",
    description: "部下の目標を横文字に変換する能力を獲得した。",
    rank: 3,
    imagePath: null,
    shareText: "部下の目標を、横文字に変換できるようになった。",
    conditionLabel: "スコア15以上",
  },
  {
    id: "northstar_reacher",
    name: "ノーススター到達者",
    description: "北極星には到達できないという事実は、まだ知らない。",
    rank: 4,
    imagePath: null,
    shareText: "北極星の方角だけは、分かるようになった。",
    conditionLabel: "スコア20以上",
  },
  {
    id: "corporate_planning_prodigy",
    name: "経営企画の申し子",
    description: "具体策がなくても、資料の方向性は整えられる。",
    rank: 5,
    imagePath: null,
    shareText: "具体策は無いが、資料の方向性は完璧。",
    conditionLabel: "スコア25以上",
  },
  {
    id: "consulting_fit",
    name: "コンサル適性あり",
    description: "一言で済む話を、三枚のスライドに展開できる。",
    rank: 6,
    imagePath: null,
    shareText: "一言で済む話を、三枚のスライドにした。",
    conditionLabel: "スコア30以上",
  },
  {
    id: "chief_buzzword_officer",
    name: "Chief Buzzword Officer",
    description: "組織の横文字を統括する最高責任者。",
    rank: 7,
    imagePath: null,
    shareText: "組織の横文字を、一手に引き受けた。",
    conditionLabel: "ビンゴを3ライン以上達成",
  },
  {
    id: "series_a_ceo",
    name: "シリーズA調達済みCEO",
    description: "売上より先に、世界観と採用資料が完成している。",
    rank: 8,
    imagePath: null,
    shareText: "売上より先に、世界観が完成した。",
    conditionLabel: "横文字を20語以上選択",
  },
];

// 称号条件を1つも満たさなかった場合のフォールバック。称号コレクション上の正式称号には含めない。
export const NO_TITLE: TitleDefinition = {
  id: "still_speaks_japanese",
  name: "まだ日本語で会話できる人",
  description: "今日は横文字の少ない、健全な会議でした。",
  rank: 0,
  imagePath: null,
  shareText: "横文字ゼロの、平和な会議でした。",
  conditionLabel: "称号条件未達成",
};
