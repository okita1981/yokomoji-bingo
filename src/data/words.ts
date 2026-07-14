export type Word = {
  id: string;
  label: string; // カードに表示する横文字
  meaning: string; // 一般的な日本語での短い説明（用語集用）
  translation: string; // おじさん翻訳の断片
  category: "common";
};

export const words: Word[] = [
  { id: "purpose", label: "パーパス", meaning: "企業や組織が社会に存在する理由。", translation: "目的を決めて", category: "common" },
  { id: "aspiration", label: "アスピレーション", meaning: "企業や組織が将来実現したい、意欲的な理想像。", translation: "やりたいことを掲げて", category: "common" },
  { id: "northstar", label: "ノーススター", meaning: "組織が長期的に目指す方向や最重要指標。", translation: "最終目標に向かって", category: "common" },
  { id: "align", label: "アライン", meaning: "複数の人や部署の考え方や方向性を一致させること。", translation: "話を合わせて", category: "common" },
  { id: "alignment", label: "アラインメント", meaning: "関係者の認識や方向性を一致させること。", translation: "認識を合わせて", category: "common" },
  { id: "narrative", label: "ナラティブ", meaning: "物事の背景や意図を伝えるための、一貫したストーリー。", translation: "ストーリーを作って", category: "common" },
  { id: "capability", label: "ケイパビリティ", meaning: "組織や個人が持つ、何かを実行できる能力や体制。", translation: "できることを整理して", category: "common" },
  { id: "empowerment", label: "エンパワーメント", meaning: "権限や裁量を現場に与え、自律的に動けるようにすること。", translation: "現場に任せて", category: "common" },
  { id: "ownership", label: "オーナーシップ", meaning: "自分の担当として責任を持って取り組む姿勢。", translation: "自分ごととして", category: "common" },
  { id: "stakeholder", label: "ステークホルダー", meaning: "その物事に利害関係を持つ人や組織。", translation: "関係者と", category: "common" },
  { id: "cocreation", label: "コクリエーション", meaning: "顧客や関係者と一緒に価値やサービスを作り上げること。", translation: "一緒に作って", category: "common" },
  { id: "transformation", label: "トランスフォーメーション", meaning: "組織のあり方や仕事の進め方を大きく変えること。", translation: "やり方を変えて", category: "common" },
  { id: "impact", label: "インパクト", meaning: "取り組みによって生まれる、目に見える成果や影響。", translation: "成果を出して", category: "common" },
  { id: "ai_native", label: "AIネイティブ", meaning: "最初からAIの活用を前提に設計された仕組みや考え方。", translation: "AI前提で", category: "common" },
  { id: "ai_first", label: "AIファースト", meaning: "何かを検討する際、AIの活用を最初に考える方針。", translation: "AIを優先して", category: "common" },
  { id: "agentic", label: "エージェンティック", meaning: "AIが自律的に判断し、作業を代わりに進めてくれる性質。", translation: "AIに勝手に動いてもらって", category: "common" },
  { id: "orchestration", label: "オーケストレーション", meaning: "複数の仕組みや担当者の動きを、全体として調整すること。", translation: "全体をまとめて", category: "common" },
  { id: "flywheel", label: "フライホイール", meaning: "一度回り始めると自然と勢いが増していく、好循環の仕組み。", translation: "好循環を回して", category: "common" },
  { id: "pmf", label: "PMF", meaning: "商品やサービスが、狙った市場のニーズにしっかり合っている状態。", translation: "売れる形を見つけて", category: "common" },
  { id: "gtm", label: "GTM", meaning: "商品やサービスを市場に届けるための、具体的な進め方や計画。", translation: "売り方を考えて", category: "common" },
  { id: "scalability", label: "スケーラビリティ", meaning: "事業や仕組みが、規模を拡大しても対応できる度合い。", translation: "拡大できるようにして", category: "common" },
  { id: "disruption", label: "ディスラプション", meaning: "新しいやり方が、既存の業界構造を大きく変えてしまうこと。", translation: "業界をぶっ壊して", category: "common" },
  { id: "moonshot", label: "ムーンショット", meaning: "実現が難しくても挑戦する価値がある、野心的な目標。", translation: "無茶な目標を立てて", category: "common" },
  { id: "sustainable", label: "サステナブル", meaning: "無理なく長く続けられる、持続可能な状態。", translation: "続けられる形で", category: "common" },
  { id: "reframe", label: "リフレーム", meaning: "物事の捉え方や見方を変えて、別の角度から考え直すこと。", translation: "見方を変えて", category: "common" },
  { id: "roadmap", label: "ロードマップ", meaning: "目標達成までの進め方や時期をまとめた計画。", translation: "予定を立てて", category: "common" },
  { id: "milestone", label: "マイルストーン", meaning: "計画の途中で目印となる、区切りの節目。", translation: "節目を決めて", category: "common" },
  { id: "must", label: "マスト", meaning: "必ずやらなければならない、必須の事柄。", translation: "絶対にやって", category: "common" },
  { id: "bestpractice", label: "ベストプラクティス", meaning: "これまでの経験から見て、最も効果的とされるやり方。", translation: "うまくいったやり方で", category: "common" },
  { id: "enablement", label: "イネーブルメント", meaning: "必要な知識や環境を整え、人が力を発揮できるようにすること。", translation: "できるようにして", category: "common" },
  { id: "culture", label: "カルチャー", meaning: "組織の中で共有されている、価値観や雰囲気。", translation: "社風に合わせて", category: "common" },
  { id: "principle", label: "プリンシプル", meaning: "判断や行動の土台となる、基本的な考え方や方針。", translation: "方針に沿って", category: "common" },
  { id: "value", label: "バリュー", meaning: "組織や個人が大切にしている価値観。", translation: "大事なことを守って", category: "common" },
  { id: "insight", label: "インサイト", meaning: "データや会話から見えてくる、本質的な気づき。", translation: "気づきをもとに", category: "common" },
  { id: "issue", label: "イシュー", meaning: "解決すべき課題や、話し合うべき論点。", translation: "課題を洗い出して", category: "common" },
  { id: "commit", label: "コミット", meaning: "やると決めたことに対して、責任を持って約束すること。", translation: "やり切ると約束して", category: "common" },
  { id: "agile", label: "アジャイル", meaning: "計画を固めすぎず、状況に応じて柔軟に進めていく進め方。", translation: "走りながら考えて", category: "common" },
  { id: "ecosystem", label: "エコシステム", meaning: "複数の企業やサービスが関わり合いながら成り立つ仕組み。", translation: "仲間を巻き込んで", category: "common" },
  { id: "leverage", label: "レバレッジ", meaning: "限られた資源や強みを、うまく活用して効果を高めること。", translation: "うまく活用して", category: "common" },
  { id: "synergy", label: "シナジー", meaning: "複数の要素が組み合わさることで生まれる、相乗的な効果。", translation: "相乗効果を出して", category: "common" },
];

export const CUSTOM_WORD_DEFAULT_MEANING =
  "あなたの会社でよく使われている横文字です。正確な意味は発言者にご確認ください。";
export const CUSTOM_WORD_DEFAULT_TRANSLATION = "よしなに進めて";
