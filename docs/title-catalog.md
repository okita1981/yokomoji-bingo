# 称号カタログ（title-catalog）

正本ファイル: [`src/data/titles.ts`](../src/data/titles.ts)（データ）／[`src/utils/titles.ts`](../src/utils/titles.ts)（判定ロジック）

このドキュメントは、称号キャラクターイラストの制作を進める際の正本として使用する。
称号を追加・変更した場合は、必ず `src/data/titles.ts` と本ファイルを同時に更新すること。

## 称号総数

**8種類**（+ 未達成時フォールバック1種類 = 実質9パターン）

## 称号一覧（rank降順・優先順位順）

| rank | id | 称号名 | 説明 | 獲得条件（conditionLabel） | imagePath | 到達可能性 |
|---|---|---|---|---|---|---|
| 8 | `series_a_ceo` | シリーズA調達済みCEO | 売上より先に、世界観と採用資料が完成している。 | 横文字を20語以上選択 | `null` | ○（カード24語中20語選択で到達） |
| 7 | `chief_buzzword_officer` | Chief Buzzword Officer | 組織の横文字を統括する最高責任者。 | ビンゴを3ライン以上達成 | `null` | ○（12ライン中3ライン） |
| 6 | `consulting_fit` | コンサル適性あり | 一言で済む話を、三枚のスライドに展開できる。 | スコア30以上 | `null` | △ 条件自体は成立するが、**表示される称号としては事実上到達不能**（下記注記参照） |
| 5 | `corporate_planning_prodigy` | 経営企画の申し子 | 具体策がなくても、資料の方向性は整えられる。 | スコア25以上 | `null` | ○ |
| 4 | `northstar_reacher` | ノーススター到達者 | 北極星には到達できないという事実は、まだ知らない。 | スコア20以上 | `null` | ○ |
| 3 | `aspiration_manager` | アスピレーション管理職 | 部下の目標を横文字に変換する能力を獲得した。 | スコア15以上 | `null` | ○ |
| 2 | `high_awareness_master` | 意識高い会議マスター | 会議の空気を読みながら、横文字も的確に選べるようになった。 | スコア10以上 | `null` | ○ |
| 1 | `yokomoji_native` | 横文字ネイティブ | 会議の言葉を聞き逃さない、若手有望株。 | ビンゴを1ライン達成 | `null` | ○ |
| 0 | `still_speaks_japanese` | まだ日本語で会話できる人 | 今日は横文字の少ない、健全な会議でした。 | 称号条件未達成 | `null` | ○（正式称号コレクションには含めない） |

スコア計算式: `score = bingoCount * 5 + selectedWordCount`

## 条件競合時の扱い

複数の称号条件が同時に成立した場合、`rank`が最も高い称号を採用する（`src/utils/titles.ts` の `computeTitleDefinition`）。
条件分岐の記述順に依存せず、常に `titleDefinitions` 配列を `rank` 降順でソートしてから先頭を採用する構造のため、配列の順序を変えても判定結果は変わらない。

例：ビンゴ3回達成かつ選択語数22語の場合 → `chief_buzzword_officer`(rank7) と `series_a_ceo`(rank8) の両方が成立するが、rankが高い `series_a_ceo` が採用される。

### 既知の到達性の注記（`consulting_fit`）

`consulting_fit`（コンサル適性あり、スコア30以上）は、条件式自体は正しく成立するが、**表示結果として選ばれることが数学的にほぼ無い**。
理由：スコア30以上に到達するには `bingoCount*5 + selectedCount >= 30` が必要。`chief_buzzword_officer`（rank7）の条件（bingo≥3）を避けるには bingoCount は0〜2に限られ、その場合 `selectedCount` は最低20以上必要になる。しかし `selectedCount >= 20` は同時に `series_a_ceo`（rank8）の条件も満たしてしまうため、rank比較で必ず `series_a_ceo` に負ける。bingoCount≥3のケースも同様に `chief_buzzword_officer` に負ける。
この特性は本改修で新たに発生したものではなく、指示書が定義した優先順位（1位シリーズA調達済みCEO〜8位横文字ネイティブ）と閾値（スコア30以上）をそのまま実装した場合に元々内在する性質である。テスト（`src/utils/titles.test.ts`）にこの事実を明記した。称号追加・閾値変更を検討する際は、この重なりに留意すること。

## 未達成時（NO_TITLE）

条件を1つも満たさない場合は `still_speaks_japanese` を返す。称号コレクション上の正式称号一覧には含めないが、Result画面には通常の称号と同じ構造（`TitleDefinition`）で表示される。

## 将来の画像ファイル名（想定・未確定）

イラスト制作時は以下のファイル名を目安とし、`imagePath` に反映する。

| id | 想定ファイル名 | 画像制作状況 |
|---|---|---|
| `yokomoji_native` | `/images/titles/yokomoji-native.webp` | Not Created |
| `high_awareness_master` | `/images/titles/high-awareness-master.webp` | Not Created |
| `aspiration_manager` | `/images/titles/aspiration-manager.webp` | Not Created |
| `northstar_reacher` | `/images/titles/northstar-reacher.webp` | Not Created |
| `corporate_planning_prodigy` | `/images/titles/corporate-planning-prodigy.webp` | Not Created |
| `consulting_fit` | `/images/titles/consulting-fit.webp` | Not Created |
| `chief_buzzword_officer` | `/images/titles/chief-buzzword-officer.webp` | Not Created |
| `series_a_ceo` | `/images/titles/series-a-ceo.webp` | Not Created |
| `still_speaks_japanese` | `/images/titles/still-speaks-japanese.webp` | Not Created |

## 画像仕様（将来実装時の想定）

- WebPまたはPNG
- 縦長または正方形
- 透過背景対応
- 1称号につき1キャラクター
- スマホ画面で称号名より上に表示（`Result.tsx` の `.result-title-image` 参照）

## 実装メモ

- `imagePath` が `null`、または画像読み込みに失敗した場合（`onError`発火時）は画像枠自体を非表示にする。プレースホルダーや人物シルエットは表示しない（`src/screens/Result.tsx` 参照）。
- 画像を追加する場合は `src/data/titles.ts` の該当 `imagePath` にパスを設定するだけで、`Result.tsx` 側のコード変更は不要。
