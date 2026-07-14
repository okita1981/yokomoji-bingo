export type Word = {
  id: string;
  label: string; // カードに表示する横文字
  translation: string; // おじさん翻訳の断片
  category: "common";
};

export const words: Word[] = [
  { id: "purpose", label: "パーパス", translation: "目的を決めて", category: "common" },
  { id: "aspiration", label: "アスピレーション", translation: "やりたいことを掲げて", category: "common" },
  { id: "northstar", label: "ノーススター", translation: "最終目標に向かって", category: "common" },
  { id: "align", label: "アライン", translation: "話を合わせて", category: "common" },
  { id: "alignment", label: "アラインメント", translation: "認識を合わせて", category: "common" },
  { id: "narrative", label: "ナラティブ", translation: "ストーリーを作って", category: "common" },
  { id: "capability", label: "ケイパビリティ", translation: "できることを整理して", category: "common" },
  { id: "empowerment", label: "エンパワーメント", translation: "現場に任せて", category: "common" },
  { id: "ownership", label: "オーナーシップ", translation: "自分ごととして", category: "common" },
  { id: "stakeholder", label: "ステークホルダー", translation: "関係者と", category: "common" },
  { id: "cocreation", label: "コクリエーション", translation: "一緒に作って", category: "common" },
  { id: "transformation", label: "トランスフォーメーション", translation: "やり方を変えて", category: "common" },
  { id: "impact", label: "インパクト", translation: "成果を出して", category: "common" },
  { id: "ai_native", label: "AIネイティブ", translation: "AI前提で", category: "common" },
  { id: "ai_first", label: "AIファースト", translation: "AIを優先して", category: "common" },
  { id: "agentic", label: "エージェンティック", translation: "AIに勝手に動いてもらって", category: "common" },
  { id: "orchestration", label: "オーケストレーション", translation: "全体をまとめて", category: "common" },
  { id: "flywheel", label: "フライホイール", translation: "好循環を回して", category: "common" },
  { id: "pmf", label: "PMF", translation: "売れる形を見つけて", category: "common" },
  { id: "gtm", label: "GTM", translation: "売り方を考えて", category: "common" },
  { id: "scalability", label: "スケーラビリティ", translation: "拡大できるようにして", category: "common" },
  { id: "disruption", label: "ディスラプション", translation: "業界をぶっ壊して", category: "common" },
  { id: "moonshot", label: "ムーンショット", translation: "無茶な目標を立てて", category: "common" },
  { id: "sustainable", label: "サステナブル", translation: "続けられる形で", category: "common" },
  { id: "reframe", label: "リフレーム", translation: "見方を変えて", category: "common" },
  { id: "roadmap", label: "ロードマップ", translation: "予定を立てて", category: "common" },
  { id: "milestone", label: "マイルストーン", translation: "節目を決めて", category: "common" },
  { id: "must", label: "マスト", translation: "絶対にやって", category: "common" },
  { id: "bestpractice", label: "ベストプラクティス", translation: "うまくいったやり方で", category: "common" },
  { id: "enablement", label: "イネーブルメント", translation: "できるようにして", category: "common" },
  { id: "culture", label: "カルチャー", translation: "社風に合わせて", category: "common" },
  { id: "principle", label: "プリンシプル", translation: "方針に沿って", category: "common" },
  { id: "value", label: "バリュー", translation: "大事なことを守って", category: "common" },
  { id: "insight", label: "インサイト", translation: "気づきをもとに", category: "common" },
  { id: "issue", label: "イシュー", translation: "課題を洗い出して", category: "common" },
  { id: "commit", label: "コミット", translation: "やり切ると約束して", category: "common" },
  { id: "agile", label: "アジャイル", translation: "走りながら考えて", category: "common" },
  { id: "ecosystem", label: "エコシステム", translation: "仲間を巻き込んで", category: "common" },
  { id: "leverage", label: "レバレッジ", translation: "うまく活用して", category: "common" },
  { id: "synergy", label: "シナジー", translation: "相乗効果を出して", category: "common" },
];
