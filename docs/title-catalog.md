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

| rank | id | 称号名 | category | 条件（conditionLabel） | 必要ワードID | imagePath |
|---:|---|---|---|---|---|---|
| 1 | `yokomoji_apprentice` | 横文字見習い | selected | 横文字を1語以上選択 | - | `null` |
| 2 | `yokomoji_native` | 横文字ネイティブ | bingo | ビンゴを1ライン達成 | - | `null` |
| 3 | `agenda_checker` | アジェンダ確認係 | selected | 横文字を5語以上選択 | - | `null` |
| 4 | `alignment_staff` | アライン担当 | score | スコア8以上 | - | `null` |
| 5 | `high_awareness_master` | 意識高い会議マスター | score | スコア10以上 | - | `null` |
| 6 | `resolution_supervisor` | 解像度向上主任 | score | スコア13以上 | - | `null` |
| 7 | `issue_manager` | イシュー特定課長 | score | スコア16以上 | - | `null` |
| 8 | `aspiration_manager` | アスピレーション管理職 | score | スコア20以上 | - | `null` |
| 9 | `milestone_director` | マイルストーン部長 | combo | must・milestone・roadmapを選択 | `must`,`milestone`,`roadmap` | `null` |
| 10 | `northstar_reacher` | ノーススター到達者 | score | スコア25以上 | - | `null` |
| 11 | `narrative_officer` | ナラティブ統括責任者 | combo | narrative・insight・reframeを選択 | `narrative`,`insight`,`reframe` | `null` |
| 12 | `corporate_planning_prodigy` | 経営企画の申し子 | score | スコア30以上 | - | `null` |
| 13 | `capability_head` | ケイパビリティ開発本部長 | score | スコア35以上 | - | `null` |
| 14 | `synergy_executive` | シナジー創出執行役員 | combo | synergy・ecosystem・cocreationを選択 | `synergy`,`ecosystem`,`cocreation` | `null` |
| 15 | `consulting_fit` | コンサル適性あり | score | **スコア38以上**（原案40から調整、下記参照） | - | `null` |
| 16 | `purpose_evangelist` | パーパス経営伝道師 | combo | purpose・aspiration・northstarを選択 | `purpose`,`aspiration`,`northstar` | `null` |
| 17 | `chief_alignment_officer` | Chief Alignment Officer | combo | align・alignmentを選択 | `align`,`alignment` | `null` |
| 18 | `chief_buzzword_officer` | Chief Buzzword Officer | **special** | ビンゴを5ライン以上達成 | - | `null` |
| 19 | `pre_unicorn_ceo` | ユニコーン予備軍CEO | combo | pmf・gtm・scalabilityを選択 | `pmf`,`gtm`,`scalability` | `null` |
| 20 | `series_a_ceo` | シリーズA調達済みCEO | **special** | 横文字を20語以上選択 | - | `null` |
| 0 | `still_speaks_japanese` | まだ日本語で会話できる人 | - | 称号条件未達成（コレクション対象外） | - | `null` |

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

## 画像仕様（将来実装時の想定）

- WebPまたはPNG、縦長または正方形、透過背景対応、1称号につき1キャラクター
- `imagePath`が`null`、または画像読み込みに失敗した場合（`onError`発火時）は画像枠自体を非表示にする。プレースホルダーや人物シルエットは表示しない（共通コンポーネント`src/components/TitleImage.tsx`が担う）
- 表示箇所は3つ: ①ビンゴ成立モーダル（小、NEW時のみ強調）②Result画面（最大）③称号コレクションの獲得済みカード
- 画像を追加する場合は `src/data/titles.ts` の該当 `imagePath` にパスを設定するだけで、3画面すべてに反映される（コード変更不要）

## 将来の画像ファイル名（想定・未確定）

| id | 想定ファイル名 | 画像制作状況 |
|---|---|---|
| `yokomoji_apprentice` | `/images/titles/yokomoji-apprentice.webp` | Not Created |
| `yokomoji_native` | `/images/titles/yokomoji-native.webp` | Not Created |
| `agenda_checker` | `/images/titles/agenda-checker.webp` | Not Created |
| `alignment_staff` | `/images/titles/alignment-staff.webp` | Not Created |
| `high_awareness_master` | `/images/titles/high-awareness-master.webp` | Not Created |
| `resolution_supervisor` | `/images/titles/resolution-supervisor.webp` | Not Created |
| `issue_manager` | `/images/titles/issue-manager.webp` | Not Created |
| `aspiration_manager` | `/images/titles/aspiration-manager.webp` | Not Created |
| `milestone_director` | `/images/titles/milestone-director.webp` | Not Created |
| `northstar_reacher` | `/images/titles/northstar-reacher.webp` | Not Created |
| `narrative_officer` | `/images/titles/narrative-officer.webp` | Not Created |
| `corporate_planning_prodigy` | `/images/titles/corporate-planning-prodigy.webp` | Not Created |
| `capability_head` | `/images/titles/capability-head.webp` | Not Created |
| `synergy_executive` | `/images/titles/synergy-executive.webp` | Not Created |
| `consulting_fit` | `/images/titles/consulting-fit.webp` | Not Created |
| `purpose_evangelist` | `/images/titles/purpose-evangelist.webp` | Not Created |
| `chief_alignment_officer` | `/images/titles/chief-alignment-officer.webp` | Not Created |
| `chief_buzzword_officer` | `/images/titles/chief-buzzword-officer.webp` | Not Created |
| `pre_unicorn_ceo` | `/images/titles/pre-unicorn-ceo.webp` | Not Created |
| `series_a_ceo` | `/images/titles/series-a-ceo.webp` | Not Created |
| `still_speaks_japanese` | `/images/titles/still-speaks-japanese.webp` | Not Created |

## 過去の設計記録（8件版、参考）

前バージョン（8称号・スコアのみ判定）では `consulting_fit`（score>=30）がrank比較の都合で表示称号として事実上到達不能という既知の問題があった。今回の3階層化（special/combo/normal）と条件調整により解消済み。
