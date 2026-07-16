# 称号カタログ（title-catalog）

アプリ正式名称: **Buzzword Quest**（メインゲーム方式の名称は「横文字ビンゴ」のまま）

正本ファイル: [`src/data/titles.ts`](../src/data/titles.ts)（データ）／[`src/utils/titles.ts`](../src/utils/titles.ts)（判定ロジック）／[`src/utils/titleCollection.ts`](../src/utils/titleCollection.ts)（コレクション保存）

称号コレクションは`src/screens/Collection.tsx`の「意識を初期化する」から獲得状況をリセットできる（`resetTitleCollection()`）。会議メモリ・カスタムワード・進行中カード等、他のlocalStorageキーには一切影響しない。

このドキュメントは、称号キャラクターイラストの制作を進める際の正本として使用する。
称号を追加・変更した場合は、必ず `src/data/titles.ts` と本ファイルを同時に更新すること。

## 称号総数

**20種類**（+ 未達成時フォールバック1種類 = 実質21パターン。フォールバックは称号コレクションには含めない）

## 判定の階層構造（重要）

称号は単純な`rank`降順だけでは決まらない。`category`によって3段階の階層で解決する（`src/utils/titles.ts` の `computeTitleDefinition`）。

1. **special（最上位2件）**: `series_a_ceo` → `chief_buzzword_officer` の順に判定し、どちらかが成立した時点で確定する。両方成立する場合は`series_a_ceo`が勝つ。
2. **combo（特定ワード組み合わせ、6件）**: specialが1つも成立しない場合のみ評価する。`requiredWordIds`が全て選択済みの組み合わせが対象。複数のcomboが同時成立した場合は`rank`が最も高いものを採用する。
3. **score / bingo / selected（通常成長、12件）**: specialもcomboも成立しない場合のみ評価する。条件を満たしたものの中で`rank`が最も高いものを採用する。
4. **NO_TITLE**: どの階層でも1件も成立しない場合のフォールバック。

`rank`はカタログ内の表示順・**同一カテゴリ内**でのタイブレークにのみ使う値であり、カテゴリをまたいだ優先順位の決定には使わない（例: `chief_buzzword_officer`のrank(18)は`pre_unicorn_ceo`のrank(19)より小さいが、specialカテゴリのため常にcomboより優先される）。

## 称号一覧（rank順）

スコア計算式: `score = bingoCount * 5 + selectedWordCount`

| No. | rank | id | 称号名 | category | rarity | 条件（conditionLabel） | 必要ワードID |
|---:|---:|---|---|---|---|---|---|
| 1 | 1 | `yokomoji_apprentice` | 横文字見習い | selected | N | 横文字を1語以上選択 | - |
| 2 | 2 | `yokomoji_native` | 横文字ネイティブ | bingo | N | ビンゴを1ライン達成 | - |
| 3 | 3 | `agenda_checker` | アジェンダ確認係 | selected | N | 横文字を5語以上選択 | - |
| 4 | 4 | `alignment_staff` | アライン担当 | score | R | スコア8以上 | - |
| 5 | 5 | `high_awareness_master` | 意識高い会議マスター | score | R | スコア10以上 | - |
| 6 | 6 | `resolution_supervisor` | 解像度向上主任 | score | R | スコア13以上 | - |
| 7 | 7 | `issue_manager` | イシュー特定課長 | score | R | スコア16以上 | - |
| 8 | 8 | `aspiration_manager` | アスピレーション管理職 | score | SR | スコア20以上 | - |
| 9 | 9 | `milestone_director` | マイルストーン部長 | combo | SR | must・milestone・roadmapを選択 | `must`,`milestone`,`roadmap` |
| 10 | 10 | `northstar_reacher` | ノーススター到達者 | score | SR | スコア25以上 | - |
| 11 | 11 | `narrative_officer` | ナラティブ統括責任者 | combo | SR | narrative・insight・reframeを選択 | `narrative`,`insight`,`reframe` |
| 12 | 12 | `corporate_planning_prodigy` | 経営企画の申し子 | score | SR | スコア30以上 | - |
| 13 | 13 | `capability_head` | ケイパビリティ開発本部長 | score | SSR | スコア35以上 | - |
| 14 | 14 | `synergy_executive` | シナジー創出執行役員 | combo | SSR | synergy・ecosystem・cocreationを選択 | `synergy`,`ecosystem`,`cocreation` |
| 15 | 15 | `consulting_fit` | コンサル適性あり | score | SSR | **スコア38以上**（原案40から調整、下記参照） | - |
| 16 | 16 | `purpose_evangelist` | パーパス経営伝道師 | combo | SSR | purpose・aspiration・northstarを選択 | `purpose`,`aspiration`,`northstar` |
| 17 | 17 | `chief_alignment_officer` | Chief Alignment Officer | combo | SSR | align・alignmentを選択 | `align`,`alignment` |
| 18 | 18 | `chief_buzzword_officer` | Chief Buzzword Officer | **special** | SSR | ビンゴを5ライン以上達成 | - |
| 19 | 19 | `pre_unicorn_ceo` | ユニコーン予備軍CEO | combo | UR | pmf・gtm・scalabilityを選択 | `pmf`,`gtm`,`scalability` |
| 20 | 20 | `series_a_ceo` | シリーズA調達済みCEO | **special** | UR | 横文字を20語以上選択 | - |
| - | 0 | `still_speaks_japanese` | まだ日本語で会話できる人 | - | N | 称号条件未達成（コレクション対象外） | - |

レア度内訳: N=No.1〜3／R=No.4〜7／SR=No.8〜12／SSR=No.13〜18／UR=No.19〜20（画像自体にもレア度フレームが焼き込まれている）。

## `consulting_fit` の条件調整について

指示書の原案は「スコア40以上」だったが、以下の理由で**スコア38以上**へ調整した。

- special条件（`bingoCount>=5` または `selectedWordCount>=20`）を避けた状態で到達できる最大スコアは `bingoCount<=4` かつ `selectedWordCount<=19` の組み合わせで `4*5+19=39`。
- 原案の40はこの上限を超えており、通常階層の表示称号としては到達不可能だった。
- 到達可能性を優先するという指示書の方針（「到達不能称号がある場合は、条件を調整して全称号を到達可能にしてください」）に従い、上限39以下の38に調整した。
- 全20称号の到達可能性は `src/utils/titles.test.ts` の `computeTitleDefinition` テストで検証済み。

## 称号コレクション保存仕様（`UnlockedTitleRecord`）

```ts
export type UnlockedTitleRecord = {
  titleId: string;
  firstUnlockedAt: string;
  lastUnlockedAt: string;
  unlockCount: number;
  bestScore: number;
  bestBingoCount: number;
  bestSelectedWordCount: number;
};
```

- localStorageキー: `yokomoji-bingo:titleCollection:v1`
- `still_speaks_japanese`（NO_TITLE）は記録しない
- 画像・名称・説明は保存せず、`titleId`を通じて`titleDefinitions`から都度参照する（後から`imagePath`や文言を変更しても、過去データの移行なしに反映される）
- 初回獲得時に`firstUnlockedAt`を設定し、以降は更新しない。`lastUnlockedAt`は獲得の都度更新。`unlockCount`は加算。`bestScore`/`bestBingoCount`/`bestSelectedWordCount`は都度最大値を保持

## NEW判定の仕様

- 「会議を終了する」を押した時点（`App.tsx`の`handleEndMeeting`）で、その称号が**このタイミング以前にコレクションへ記録されていなかった場合のみ** `isNewTitle: true`
- ビンゴ成立モーダル（会議途中）でも同様のプレビュー判定を行うが、こちらは**永続化された称号コレクションと照合するだけ**で、モーダル表示時点ではコレクションへの書き込みは行わない（書き込みは会議終了時の1回のみ）

## 画像仕様・実装状況（2026-07-16・実装済み）

称号キャラクターカード全20枚を実装済み。画像原本・変換手順・PWAキャッシュ方針の詳細は [docs/title-card-assets.md](title-card-assets.md) を参照。

- WebP形式、900×1200px（3:4縦長）、不透明背景（装飾フレーム焼き込み済み、上下にレア度バッジ・称号名・説明文を含む）
- `imagePath`が`null`、または画像読み込みに失敗した場合（`onError`発火時）は画像枠自体を非表示にする。プレースホルダーや人物シルエットは表示しない（共通コンポーネント`src/components/TitleImage.tsx`が担う。`imagePath`変更時に読み込み失敗stateをリセットする実装済み）
- 表示箇所: ①ビンゴ成立モーダル（小サムネイル＋レア度バッジ）②称号初回獲得モーダル（`TitleAcquisitionModal`、最大）③Result画面（最大）④会議メモリ詳細（`titleId`から都度参照）⑤称号コレクションの獲得済みカード（タップで拡大表示`CardZoomModal`）
- 画像を差し替える場合は `src/data/titles.ts` の該当 `imagePath` にパスを設定するだけで、全画面に反映される（コード変更不要）

| No. | titleId | ファイル名 | imagePath | 画像サイズ | 容量 | 制作状況 | 登録状況 |
|---:|---|---|---|---|---:|---|---|
| 1 | `yokomoji_apprentice` | `01-yokomoji-apprentice.webp` | `/images/titles/01-yokomoji-apprentice.webp` | 900×1200 | 123KB | Created | Implemented |
| 2 | `yokomoji_native` | `02-yokomoji-native.webp` | `/images/titles/02-yokomoji-native.webp` | 900×1200 | 116KB | Created | Implemented |
| 3 | `agenda_checker` | `03-agenda-checker.webp` | `/images/titles/03-agenda-checker.webp` | 900×1200 | 129KB | Created | Implemented |
| 4 | `alignment_staff` | `04-alignment-staff.webp` | `/images/titles/04-alignment-staff.webp` | 900×1200 | 188KB | Created | Implemented |
| 5 | `high_awareness_master` | `05-high-awareness-master.webp` | `/images/titles/05-high-awareness-master.webp` | 900×1200 | 195KB | Created | Implemented |
| 6 | `resolution_supervisor` | `06-resolution-supervisor.webp` | `/images/titles/06-resolution-supervisor.webp` | 900×1200 | 231KB | Created | Implemented |
| 7 | `issue_manager` | `07-issue-manager.webp` | `/images/titles/07-issue-manager.webp` | 900×1200 | 208KB | Created | Implemented |
| 8 | `aspiration_manager` | `08-aspiration-manager.webp` | `/images/titles/08-aspiration-manager.webp` | 900×1200 | 257KB | Created | Implemented |
| 9 | `milestone_director` | `09-milestone-director.webp` | `/images/titles/09-milestone-director.webp` | 900×1200 | 263KB | Created | Implemented |
| 10 | `northstar_reacher` | `10-northstar-reacher.webp` | `/images/titles/10-northstar-reacher.webp` | 900×1200 | 249KB | Created | Implemented |
| 11 | `narrative_officer` | `11-narrative-officer.webp` | `/images/titles/11-narrative-officer.webp` | 900×1200 | 248KB | Created | Implemented |
| 12 | `corporate_planning_prodigy` | `12-corporate-planning-prodigy.webp` | `/images/titles/12-corporate-planning-prodigy.webp` | 900×1200 | 256KB | Created | Implemented |
| 13 | `capability_head` | `13-capability-head.webp` | `/images/titles/13-capability-head.webp` | 900×1200 | 292KB | Created | Implemented |
| 14 | `synergy_executive` | `14-synergy-executive.webp` | `/images/titles/14-synergy-executive.webp` | 900×1200 | 315KB | Created | Implemented |
| 15 | `consulting_fit` | `15-consulting-fit.webp` | `/images/titles/15-consulting-fit.webp` | 900×1200 | 213KB | Created | Implemented |
| 16 | `purpose_evangelist` | `16-purpose-evangelist.webp` | `/images/titles/16-purpose-evangelist.webp` | 900×1200 | 267KB | Created | Implemented |
| 17 | `chief_alignment_officer` | `17-chief-alignment-officer.webp` | `/images/titles/17-chief-alignment-officer.webp` | 900×1200 | 318KB | Created | Implemented |
| 18 | `chief_buzzword_officer` | `18-chief-buzzword-officer.webp` | `/images/titles/18-chief-buzzword-officer.webp` | 900×1200 | 252KB | Created | Implemented |
| 19 | `pre_unicorn_ceo` | `19-pre-unicorn-ceo.webp` | `/images/titles/19-pre-unicorn-ceo.webp` | 900×1200 | 160KB | Created | Implemented |
| 20 | `series_a_ceo` | `20-series-a-ceo.webp` | `/images/titles/20-series-a-ceo.webp` | 900×1200 | 179KB | Created | Implemented |
| - | `still_speaks_japanese` | - | `null` | - | - | Not Created（対象外） | - |

合計容量: 約4.3MB（20枚）。`still_speaks_japanese`（NO_TITLE）はコレクション対象外のため画像を用意しない。

### 初回獲得演出・コレクション表示対応

- 初回獲得演出: `src/components/TitleAcquisitionModal.tsx` で対応済み。「会議を終了する」→新称号の初回判定→初回のみモーダル表示→「結果を見る」でResult画面へ、の順で実装
- コレクション表示: `src/screens/Collection.tsx` で対応済み。獲得済みカードはタップで拡大表示（`CardZoomModal`）、未獲得カードは画像を表示しない

## 過去の設計記録（8件版、参考）

前バージョン（8称号・スコアのみ判定）では `consulting_fit`（score>=30）がrank比較の都合で表示称号として事実上到達不能という既知の問題があった。今回の3階層化（special/combo/normal）と条件調整により解消済み。
