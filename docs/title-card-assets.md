# 称号カードアセット仕様（title-card-assets）

称号キャラクターカード画像20枚の原本管理・変換手順・PWAキャッシュ方針をまとめたドキュメント。

## 画像原本の場所

```text
C:\Users\kousu\Downloads\#1.png 〜 #20.png
```

- 原本は`#1.png`〜`#20.png`の連番（ファイル数として欠番・重複なし）
- 原本サイズ: 1086×1200px（実際は1086×1448px、3:4縦長）、容量2.0〜3.1MB/枚（原本合計 約54.6MB）
- 原本は上書き・削除せず、ダウンロードフォルダにそのまま保持する

### 修正履歴

- **2026-07-16発覚・同日修正済み**: `#10.png`と`#11.png`が原本の時点でバイト単位の重複ファイルになっており、`11-narrative-officer.webp`（ナラティブ統括責任者）の中身が`10-northstar-reacher.webp`（ノーススター到達者）と同一になっていた。`src/data/titles.ts`のIDと画像パスのマッピング自体に誤りはなく、原因は原本画像側の重複のみだった。ユーザーが正しい原本を`#11.png`として差し替え後、同じ変換手順（`scale=-1:1200`・quality82）で`11-narrative-officer.webp`を再生成し解消した。

## 公開用画像の場所

```text
public/images/titles/{No.}-{titleId風のケバブケース}.webp
```

例: `public/images/titles/01-yokomoji-apprentice.webp`

## No.とtitleIdの対応

| No. | titleId | ファイル名 |
|---:|---|---|
| 1 | `yokomoji_apprentice` | `01-yokomoji-apprentice.webp` |
| 2 | `yokomoji_native` | `02-yokomoji-native.webp` |
| 3 | `agenda_checker` | `03-agenda-checker.webp` |
| 4 | `alignment_staff` | `04-alignment-staff.webp` |
| 5 | `high_awareness_master` | `05-high-awareness-master.webp` |
| 6 | `resolution_supervisor` | `06-resolution-supervisor.webp` |
| 7 | `issue_manager` | `07-issue-manager.webp` |
| 8 | `aspiration_manager` | `08-aspiration-manager.webp` |
| 9 | `milestone_director` | `09-milestone-director.webp` |
| 10 | `northstar_reacher` | `10-northstar-reacher.webp` |
| 11 | `narrative_officer` | `11-narrative-officer.webp` |
| 12 | `corporate_planning_prodigy` | `12-corporate-planning-prodigy.webp` |
| 13 | `capability_head` | `13-capability-head.webp` |
| 14 | `synergy_executive` | `14-synergy-executive.webp` |
| 15 | `consulting_fit` | `15-consulting-fit.webp` |
| 16 | `purpose_evangelist` | `16-purpose-evangelist.webp` |
| 17 | `chief_alignment_officer` | `17-chief-alignment-officer.webp` |
| 18 | `chief_buzzword_officer` | `18-chief-buzzword-officer.webp` |
| 19 | `pre_unicorn_ceo` | `19-pre-unicorn-ceo.webp` |
| 20 | `series_a_ceo` | `20-series-a-ceo.webp` |

対応は実際に各画像を目視確認（No.1/4/8/13/17/18/19/20をスポットチェック）し、称号名・レア度バッジが一覧表と完全一致することを確認済み。

## 変換前後の形式

- 変換前: PNG、1086×1448px、2.0〜3.1MB/枚
- 変換後: WebP、900×1200px（長辺1200pxにリサイズ、縦横比不変）、113〜318KB/枚（合計約4.3MB）

## 最適化方法

`ffmpeg`（libwebp同梱）を使用。

```bash
ffmpeg -i "#{No}.png" -vf "scale=-1:1200" -c:v libwebp -quality 82 -compression_level 6 "public/images/titles/{No}-{titleId}.webp"
```

- `scale=-1:1200`: 縦横比を維持したまま長辺（高さ）を1200pxに縮小。トリミング・向き変更は行わない
- `-quality 82`: カード内の文字（称号名・説明文・レア度バッジ）が全20枚で判読可能なことを目視確認したうえで採用した値
- 変換後の全ファイルが500KB以下の目標を達成（実測最大318KB）

## PWAキャッシュ方針

**案A（全画像プリキャッシュ）を採用**（`vite.config.ts`の`workbox.globPatterns`に`webp`を追加）。

理由:
- 最適化後の合計容量が約4.3MBと小さく、「大きい場合は初回プリキャッシュを避ける」という判断基準に該当しない
- 称号カードはゲームプレイで段階的に「表示」されるが、画像ファイル自体を先読みしても内容が事前に露見するわけではない（コレクション画面のUI側で未獲得カードは画像を表示しない設計のため、プリキャッシュ自体はネタバレにならない）
- 実装がシンプルになり、「一度獲得したカードは必ずオフラインでも再表示できる」という要件を、ランタイムキャッシュの世代管理なしに保証できる

将来画像枚数が大幅に増える場合（Later課題）は、ランタイムキャッシュ（案B、CacheFirst戦略）への切り替えを再検討すること。

## 画像差し替え手順

1. 新しい原本画像を`C:\Users\kousu\Downloads`等に用意する（原本は削除しない）
2. 上記のffmpegコマンドで`public/images/titles/{No}-{titleId}.webp`へ変換・上書き
3. `src/data/titles.ts`の該当`imagePath`が同じファイル名を指していることを確認（ファイル名を変えない限りコード変更は不要）
4. `npm run build`でPWAプリキャッシュに新しい画像が含まれることを確認

## 今後カードを追加する場合の手順

現時点では称号数の追加はスコープ外だが、将来追加する場合の手順を記録する。

1. 新しい称号を`src/data/titles.ts`の`titleDefinitions`に追加する（rank・category・rarity・conditionLabel等を既存の規約に従って設定）
2. 対応する画像を用意し、`public/images/titles/{No}-{titleId}.webp`へ配置
3. `imagePath`を設定する
4. `docs/title-catalog.md`・本ドキュメントの一覧表を更新する
5. `src/utils/titles.test.ts`に到達可能性テストを追加する
