// ランダム連結はしない（日本語が壊れるため）。穴あきテンプレートに選択ワードのlabelを流し込む。
export type MeetingMinuteTemplateCategory =
  | "management"
  | "consulting"
  | "startup"
  | "dx"
  | "organization"
  | "marketing"
  | "sales"
  | "nothing_decided"
  | "general";

export type MeetingMinuteTemplate = {
  id: string;
  category: MeetingMinuteTemplateCategory;
  template: string;
  // テンプレート本文に既に固定で埋め込まれている横文字のword id。
  // 同じ語が同一文章内で二重に登場しないよう、スロット候補から除外する。
  excludedWordIds?: string[];
};

export const meetingMinuteTemplates: MeetingMinuteTemplate[] = [
  {
    id: "management_01",
    category: "management",
    template:
      "{0}を起点として、{1}と{2}のアラインメントを強化し、全社横断で{3}を推進する方針を確認しました。",
    excludedWordIds: ["alignment"],
  },
  {
    id: "consulting_01",
    category: "consulting",
    template:
      "現状の{0}には一定のイシューが存在するため、{1}の観点から再度リフレームし、{2}を起点としたロードマップを策定します。",
    excludedWordIds: ["issue", "reframe", "roadmap"],
  },
  {
    id: "startup_01",
    category: "startup",
    template:
      "{0}をノーススターとして、{1}のPMF検証と{2}のGTMを並行して進め、再現性のある{3}を構築します。",
    excludedWordIds: ["northstar", "pmf", "gtm"],
  },
  {
    id: "dx_01",
    category: "dx",
    template:
      "{0}を前提としたオペレーティングモデルへ移行し、{1}と{2}をオーケストレーションすることで、組織全体の{3}を向上させます。",
    excludedWordIds: ["orchestration"],
  },
  {
    id: "organization_01",
    category: "organization",
    template: "メンバーの{0}と{1}をエンパワーメントし、{2}なカルチャーの醸成を通じて、持続的な{3}を実現します。",
    excludedWordIds: ["empowerment", "culture"],
  },
  {
    id: "sales_01",
    category: "sales",
    template: "{0}を起点としたGTMを再設計し、{1}と{2}のシナジーを通じて、継続的な{3}を創出します。",
    excludedWordIds: ["gtm", "synergy"],
  },
  {
    id: "marketing_01",
    category: "marketing",
    template: "顧客インサイトをもとに{0}をリフレームし、{1}なナラティブを通じて、{2}の最大化を目指します。",
    excludedWordIds: ["reframe", "narrative"],
  },
  {
    id: "nothing_decided_01",
    category: "nothing_decided",
    template: "{0}については引き続き検討を継続し、{1}とのアラインを踏まえたうえで、次回までに{2}の解像度を高めます。",
    excludedWordIds: ["align"],
  },
  {
    id: "organization_02",
    category: "organization",
    template:
      "{0}の推進体制については、関係ステークホルダーとのアラインメントを行ったうえで、次回までにオーナーシップの所在を明確化します。",
    excludedWordIds: ["stakeholder", "alignment", "ownership"],
  },
  {
    id: "general_01",
    category: "general",
    template: "{0}と{1}の接続には追加のイシュー整理が必要なため、別途アラインメントセッションを設定します。",
    excludedWordIds: ["issue", "alignment"],
  },
  {
    id: "management_02",
    category: "management",
    template:
      "{0}を軸とした中期方針について、{1}の観点から{2}を再定義し、次年度に向けた{3}の土台を固めました。",
  },
  {
    id: "consulting_02",
    category: "consulting",
    template: "{0}における構造的な課題を{1}のフレームワークで整理し、{2}を通じたクイックウィンの創出を提案します。",
  },
  {
    id: "startup_02",
    category: "startup",
    template: "{0}のグロースループを{1}によって強化し、{2}を軸にプロダクトマーケットフィットの再現性を高めます。",
  },
  {
    id: "dx_02",
    category: "dx",
    template: "{0}システムと{1}を連携させ、{2}によるデータドリブンな意思決定基盤を{3}する方針としました。",
  },
  {
    id: "organization_03",
    category: "organization",
    template: "{0}の1on1を通じて{1}のエンゲージメントを高め、{2}なチーム運営へ移行します。",
  },
  {
    id: "sales_02",
    category: "sales",
    template: "{0}のパイプラインを{1}の観点から見直し、{2}を強化することで受注率の向上を図ります。",
  },
  {
    id: "marketing_02",
    category: "marketing",
    template: "{0}のブランドポジショニングを{1}によって明確化し、{2}を通じた認知獲得を強化します。",
  },
  {
    id: "nothing_decided_02",
    category: "nothing_decided",
    template: "本日の議論では{0}に関する合意形成には至らず、{1}を踏まえて次回改めて協議します。",
  },
  {
    id: "general_02",
    category: "general",
    template: "{0}を前提に{1}との連携を確認し、{2}に向けた共通認識を醸成しました。",
  },
  {
    id: "consulting_03",
    category: "consulting",
    template: "{0}に対する第三者視点での{1}を実施し、{2}を通じた改善余地の特定を行います。",
  },
];

export const translationPunchlines: string[] = [
  "要するに、みんなで頑張ります。",
  "つまり、頑張ります。",
  "まあ、いい感じにやります。",
  "ようは、売上を上げたいです。",
  "結局、次に何するか決めます。",
  "今日は何も決まりませんでした。",
  "関係者ともう一度話します。",
  "計画を作ってから考えます。",
  "AIを使って何とかします。",
  "とりあえず会議を増やします。",
  "問題はありますが、前向きに検討します。",
  "役割分担は次回決めます。",
  "誰がやるかはまだ決まっていません。",
  "具体策はないですが、方向性は合いました。",
  "売れるかどうか試します。",
  "現場に頑張ってもらいます。",
  "資料を作り直します。",
  "もう少し解像度を上げます。",
  "いったん持ち帰ります。",
  "とりあえず認識は合いました。",
];

// カテゴリごとの締め文候補。定義がないカテゴリはtranslationPunchlines全体から選ぶ。
export const categoryPunchlines: Partial<Record<MeetingMinuteTemplateCategory, string[]>> = {
  nothing_decided: ["今日は何も決まりませんでした。", "いったん持ち帰ります。", "もう少し解像度を上げます。"],
  startup: ["売れるかどうか試します。", "ようは、売上を上げたいです。"],
  dx: ["AIを使って何とかします。", "現場に頑張ってもらいます。"],
  organization: ["誰がやるかはまだ決まっていません。", "役割分担は次回決めます。"],
  management: ["具体策はないですが、方向性は合いました。", "とりあえず認識は合いました。"],
};
