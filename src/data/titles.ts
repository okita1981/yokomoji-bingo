// 称号の構造化データ。判定ロジックは utils/titles.ts に分離する（本ファイルは純粋なデータのみ）。
// rank はカタログ内の表示順・同カテゴリ内でのタイブレークに使う値であり、
// カテゴリ間の優先順位（special > combo > score/bingo/selected）は utils/titles.ts の階層判定が別途決める。
export type TitleCategory = "score" | "bingo" | "selected" | "combo" | "special";

export type TitleDefinition = {
  id: string;
  name: string;
  description: string;
  rank: number;
  category: TitleCategory;
  imagePath: string | null; // 将来のキャラクターイラスト用。未配置時はnull。
  shareText: string;
  conditionLabel: string;
  requiredWordIds?: string[]; // category:"combo" のみ使用。すべて選択されていれば成立。
};

export const titleDefinitions: TitleDefinition[] = [
  {
    id: "yokomoji_apprentice",
    name: "横文字見習い",
    description: "まだ意味は分からないが、反応だけはできる。",
    rank: 1,
    category: "selected",
    imagePath: null,
    shareText: "まだ意味は分からないが、反応だけはできるようになった。",
    conditionLabel: "横文字を1語以上選択",
  },
  {
    id: "yokomoji_native",
    name: "横文字ネイティブ",
    description: "会議の言葉を聞き逃さない、若手有望株。",
    rank: 2,
    category: "bingo",
    imagePath: null,
    shareText: "会議の横文字を、ひとつも聞き逃さなかった。",
    conditionLabel: "ビンゴを1ライン達成",
  },
  {
    id: "agenda_checker",
    name: "アジェンダ確認係",
    description: "会議の目的より、まずアジェンダを確認する。",
    rank: 3,
    category: "selected",
    imagePath: null,
    shareText: "会議の目的より先に、アジェンダを確認した。",
    conditionLabel: "横文字を5語以上選択",
  },
  {
    id: "alignment_staff",
    name: "アライン担当",
    description: "とりあえず全員の認識を合わせたがる。",
    rank: 4,
    category: "score",
    imagePath: null,
    shareText: "とりあえず全員の認識を合わせにいった。",
    conditionLabel: "スコア8以上",
  },
  {
    id: "high_awareness_master",
    name: "意識高い会議マスター",
    description: "普通の話を少しだけ難しくできるようになった。",
    rank: 5,
    category: "score",
    imagePath: null,
    shareText: "気づいたら意識が高くなっていた。",
    conditionLabel: "スコア10以上",
  },
  {
    id: "resolution_supervisor",
    name: "解像度向上主任",
    description: "何でも解像度を上げれば解決すると思っている。",
    rank: 6,
    category: "score",
    imagePath: null,
    shareText: "何でも解像度を上げれば解決すると思っている。",
    conditionLabel: "スコア13以上",
  },
  {
    id: "issue_manager",
    name: "イシュー特定課長",
    description: "課題を見つけること自体が仕事になっている。",
    rank: 7,
    category: "score",
    imagePath: null,
    shareText: "課題を見つけること自体が、仕事になった。",
    conditionLabel: "スコア16以上",
  },
  {
    id: "aspiration_manager",
    name: "アスピレーション管理職",
    description: "部下の目標を横文字に変換する能力を獲得した。",
    rank: 8,
    category: "score",
    imagePath: null,
    shareText: "部下の目標を、横文字に変換できるようになった。",
    conditionLabel: "スコア20以上",
  },
  {
    id: "milestone_director",
    name: "マイルストーン部長",
    description: "何をするかより、いつ区切るかを重視する。",
    rank: 9,
    category: "combo",
    imagePath: null,
    shareText: "何をするかより、いつ区切るかを決めた。",
    conditionLabel: "「マスト」「マイルストーン」「ロードマップ」を選択",
    requiredWordIds: ["must", "milestone", "roadmap"],
  },
  {
    id: "northstar_reacher",
    name: "ノーススター到達者",
    description: "北極星には到達できないという事実は、まだ知らない。",
    rank: 10,
    category: "score",
    imagePath: null,
    shareText: "北極星の方角だけは、分かるようになった。",
    conditionLabel: "スコア25以上",
  },
  {
    id: "narrative_officer",
    name: "ナラティブ統括責任者",
    description: "実績がなくても、物語としては整えられる。",
    rank: 11,
    category: "combo",
    imagePath: null,
    shareText: "実績はないが、物語だけは整えた。",
    conditionLabel: "「ナラティブ」「インサイト」「リフレーム」を選択",
    requiredWordIds: ["narrative", "insight", "reframe"],
  },
  {
    id: "corporate_planning_prodigy",
    name: "経営企画の申し子",
    description: "具体策がなくても、資料の方向性は整えられる。",
    rank: 12,
    category: "score",
    imagePath: null,
    shareText: "具体策は無いが、資料の方向性は完璧。",
    conditionLabel: "スコア30以上",
  },
  {
    id: "capability_head",
    name: "ケイパビリティ開発本部長",
    description: "社員に何かできるようになってほしいと思っている。",
    rank: 13,
    category: "score",
    imagePath: null,
    shareText: "社員に何かできるようになってほしいと思っている。",
    conditionLabel: "スコア35以上",
  },
  {
    id: "synergy_executive",
    name: "シナジー創出執行役員",
    description: "何と何を掛け合わせるかは、これから考える。",
    rank: 14,
    category: "combo",
    imagePath: null,
    shareText: "何と何を掛け合わせるかは、まだ決めていない。",
    conditionLabel: "「シナジー」「エコシステム」「コクリエーション」を選択",
    requiredWordIds: ["synergy", "ecosystem", "cocreation"],
  },
  {
    id: "consulting_fit",
    name: "コンサル適性あり",
    description: "一言で済む話を、三枚のスライドに展開できる。",
    rank: 15,
    category: "score",
    imagePath: null,
    shareText: "一言で済む話を、三枚のスライドにした。",
    // 指示書の原案はスコア40以上だが、bingo<5かつselected<20の範囲で到達しうる最大スコアは
    // 4*5+19=39のため、40のままでは表示称号として到達不能になる。到達可能性を優先し38へ調整（詳細はdocs/title-catalog.md参照）。
    conditionLabel: "スコア38以上",
  },
  {
    id: "purpose_evangelist",
    name: "パーパス経営伝道師",
    description: "会社の存在意義を、全社員に唱えさせる。",
    rank: 16,
    category: "combo",
    imagePath: null,
    shareText: "会社の存在意義を、全社員に唱えさせた。",
    conditionLabel: "「パーパス」「アスピレーション」「ノーススター」を選択",
    requiredWordIds: ["purpose", "aspiration", "northstar"],
  },
  {
    id: "chief_alignment_officer",
    name: "Chief Alignment Officer",
    description: "全社の認識を合わせるため、会議を増やした。",
    rank: 17,
    category: "combo",
    imagePath: null,
    shareText: "全社の認識を合わせるため、会議を増やした。",
    conditionLabel: "「アライン」「アラインメント」を選択",
    requiredWordIds: ["align", "alignment"],
  },
  {
    id: "chief_buzzword_officer",
    name: "Chief Buzzword Officer",
    description: "組織の横文字を統括する最高責任者。",
    rank: 18,
    category: "special",
    imagePath: null,
    shareText: "組織の横文字を、一手に引き受けた。",
    conditionLabel: "ビンゴを5ライン以上達成",
  },
  {
    id: "pre_unicorn_ceo",
    name: "ユニコーン予備軍CEO",
    description: "売上より先に、採用資料と世界観が完成している。",
    rank: 19,
    category: "combo",
    imagePath: null,
    shareText: "売上より先に、採用資料と世界観が完成した。",
    conditionLabel: "「PMF」「GTM」「スケーラビリティ」を選択",
    requiredWordIds: ["pmf", "gtm", "scalability"],
  },
  {
    id: "series_a_ceo",
    name: "シリーズA調達済みCEO",
    description: "まだ利益はないが、アスピレーションは世界級。",
    rank: 20,
    category: "special",
    imagePath: null,
    shareText: "まだ利益はないが、アスピレーションは世界級。",
    conditionLabel: "横文字を20語以上選択",
  },
];

// 称号条件を1つも満たさなかった場合のフォールバック。称号コレクション上の正式称号には含めない。
export const NO_TITLE: TitleDefinition = {
  id: "still_speaks_japanese",
  name: "まだ日本語で会話できる人",
  description: "今日は横文字の少ない、健全な会議でした。",
  rank: 0,
  category: "selected",
  imagePath: null,
  shareText: "横文字ゼロの、平和な会議でした。",
  conditionLabel: "称号条件未達成",
};

// special category内の優先順位（先に成立した方が勝つ）。series_a_ceoが最上位。
export const SPECIAL_PRIORITY_IDS = ["series_a_ceo", "chief_buzzword_officer"];
