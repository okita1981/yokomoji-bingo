# コンテンツ生成仕様（content-generation-spec）

正本ファイル: [`src/data/meetingMinuteTemplates.ts`](../src/data/meetingMinuteTemplates.ts)（テンプレート・締め文データ）／[`src/utils/textGen.ts`](../src/utils/textGen.ts)（生成ロジック）

「本日の議事録」（旧称「ラスボス文章」）と「翻訳」の生成方式をまとめたドキュメント。

## 議事録テンプレート構造

```ts
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
  excludedWordIds?: string[];
};
```

- **総数: 20件**（最低ラインの15件を超えて実装）
- 9カテゴリすべてに最低1件を配置

| category | 件数 |
|---|---:|
| management | 2 |
| consulting | 3 |
| startup | 2 |
| dx | 2 |
| organization | 3 |
| sales | 2 |
| marketing | 2 |
| nothing_decided | 2 |
| general | 2 |

## ワード挿入ルール

1. `template`内の`{n}`へ、選択済みワード（`selectedWords`）を優先して挿入する
2. 選択済みワードだけでスロットが埋まらない場合のみ、未選択ワードのプールから補充する
3. 同一文章内で同じワードが重複して選ばれることはない（使用済みIDをSetで管理）
4. **`excludedWordIds`**: テンプレート本文に既に固定の横文字が埋め込まれている場合（例: `startup_01`は文中に「ノーススター」「PMF」「GTM」を直接含む）、それらのword idをスロット候補から除外する。これにより「ノーススターをノーススターとして」のような不自然な二重表現を避ける
5. 完全にランダムな連結は行わない。あくまで穴あきテンプレートへの語の流し込みに限定し、文法として破綻しない範囲でのみ横文字過多の面白さを優先する

## 翻訳生成ルール

### 断片の収集

議事録生成で実際に使われたワード（`usedWords`）から、`translation`フィールドを出現順・重複除去のうえ最大3件まで取得する（`generateTranslation`内の処理、既存ロジックを維持）。

### 構文パターン（5種類）

3断片が揃った場合、以下5パターンからランダムに1つを選んで結合する（`BODY_PATTERNS`、`buildTranslationBody`）。

1. `{0}、{1}、{2}。`
2. `{0}、そのうえで{1}、最終的に{2}。`
3. `まず{0}、次に{1}、あとは{2}。`
4. `{0}ながら{1}、うまく{2}。`
5. `{0}を経て{1}、結果として{2}。`

断片が3未満の場合は、パターンが不自然になるため単純連結（`、`区切り + `。`）にフォールバックする。

### 締め文（punchline）一覧（20件）

```ts
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
```

既存5件（`要するに、みんなで頑張ります。`〜`結局、次に何するか決めます。`）はそのまま維持し、新規15件を追加した。「ようは」の表記は既存データとの整合を優先しそのまま残した（「要は」への統一は行っていない）。

### カテゴリ連動（`categoryPunchlines`）

議事録テンプレートの`category`に応じて、締め文の候補を絞り込む。

| category | 候補 |
|---|---|
| `nothing_decided` | 今日は何も決まりませんでした。／いったん持ち帰ります。／もう少し解像度を上げます。 |
| `startup` | 売れるかどうか試します。／ようは、売上を上げたいです。 |
| `dx` | AIを使って何とかします。／現場に頑張ってもらいます。 |
| `organization` | 誰がやるかはまだ決まっていません。／役割分担は次回決めます。 |
| `management` | 具体策はないですが、方向性は合いました。／とりあえず認識は合いました。 |

上記に候補が定義されていないカテゴリ（`consulting`／`marketing`／`sales`／`general`）は、`translationPunchlines`全体からランダムに選ぶ。

## 旧データとの互換性

- 議事録テンプレートは`bossTemplates.ts`から`meetingMinuteTemplates.ts`へ全面的に置き換えた（データそのものに後方互換の必要はない。生成物であって保存データではないため）
- 生成された議事録本文・翻訳文は**保存データ**（会議メモリ）としてlocalStorageに残るため、こちらは[会議メモリ仕様](meeting-memory-spec.md)の`meetingMinutes`/`bossSentence`互換ルールに従う

## 将来の追加方法

- 議事録テンプレートを追加する場合は `src/data/meetingMinuteTemplates.ts` の `meetingMinuteTemplates` 配列に `{id, category, template}` を追加する。本文に既存の横文字ラベルを直接埋め込む場合は `excludedWordIds` を必ず設定する
- 締め文を追加する場合は `translationPunchlines` に追記し、特定カテゴリ専用にしたい場合は `categoryPunchlines` にも追加する
- 構文パターンを追加する場合は `BODY_PATTERNS`（`src/utils/textGen.ts`）に関数を追加する。3断片の並び (`f[0]`,`f[1]`,`f[2]`) を使う形を維持すること
