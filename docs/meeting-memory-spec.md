# 会議メモリ仕様（meeting-memory-spec）

アプリ正式名称: **Buzzword Quest**（メインゲーム方式の名称は「横文字ビンゴ」のまま）

正本ファイル: [`src/utils/meetingMemory.ts`](../src/utils/meetingMemory.ts)（保存ロジック）／[`src/screens/MeetingMemory.tsx`](../src/screens/MeetingMemory.tsx)（画面）

「会議メモリ」は、各会議のResultを履歴として保存し、後から一覧・詳細確認・削除できる機能。

## 保存データ構造（`MeetingMemory`）

```ts
export type MeetingMemory = {
  id: string;
  createdAt: string;
  titleId: string;
  bingoCount: number;
  selectedWordCount: number;
  score: number;
  selectedWordIds: string[];
  selectedWordLabels: string[];
  meetingMinutes: string;
  translation: string;
  /** @deprecated 旧フィールド名。読み込み時にmeetingMinutesへ補完される。新規保存では使用しない。 */
  bossSentence?: string;
};
```

- `id`: `meeting_{timestamp}_{ランダム文字列}` 形式で会議ごとに一意に生成する（`generateMemoryId()`）
- `titleId`: 称号定義（`titleDefinitions`）への参照のみを保持し、名称・説明・画像は保存しない。表示時は`titleId`から都度参照する
- `selectedWordLabels`: 用語がカスタムワード削除等で後から参照できなくなった場合でも表示できるよう、labelはこの時点のスナップショットとして保存する（`selectedWordIds`は将来の用語集連携用に併せて保持）
- `meetingMinutes`: 「本日の議事録」として画面に表示するテキスト（旧称「ラスボス文章」）。ユーザー向け表記変更に伴い、内部フィールド名も`bossSentence`から`meetingMinutes`へ改称した

### 旧フィールド`bossSentence`からの移行

- `bossSentence`という名称は`meetingMinutes`へ改称したが、**旧データを削除・変換する移行処理は行わない**
- `loadMeetingMemories()`が読み込み時に`meetingMinutes: record.meetingMinutes ?? record.bossSentence ?? ""`で自動補完するため、`bossSentence`のみを持つ旧レコードもエラーなく「本日の議事録」として表示される
- **新規保存（`addMeetingMemory`）は常に`meetingMinutes`のみを書き込み、`bossSentence`は書き込まない**。ストレージ内は新旧フィールドが混在しうるが、読み込み側で常に吸収する

## 保存タイミング

- ユーザーがBingo画面で「会議を終了する」を押し、Result画面が生成される瞬間（`App.tsx`の`handleEndMeeting`）に**1回だけ**保存する
- Result画面の再描画（画面遷移し直す、リロードで復元される等）では再保存されない。保存はボタンクリックのイベントハンドラ内で直接呼び出しており、Reactの再レンダリングやuseEffectの再実行に依存しないため、同じ会議が重複保存されることはない

## 保存件数の上限

- 最大 **100件**
- 新しい記録は先頭に追加し、100件を超えた場合は末尾（最も古いもの）から自動的に切り捨てる（`addMeetingMemory`が`slice(0, 100)`を適用）

## localStorageキー

```text
yokomoji-bingo:meetingMemories:v1
```

既存の`yokomoji-bingo:game:v1`・`yokomoji-bingo:customWords:v1`と同じコロン区切りの命名規則に合わせた新規キー。

## 削除仕様

- **個別削除**: 詳細画面から対象の`id`を指定して削除する（`deleteMeetingMemory(id)`）
- **全件削除**: 一覧画面から実行可能。実行前に確認ダイアログを表示し、キャンセルできる（`MeetingMemory.tsx`の`confirmingDeleteAll`state）
- 会議メモリを削除しても、称号コレクション（`yokomoji-bingo:titleCollection:v1`）の獲得状況には一切影響しない。2つのデータは完全に独立したlocalStorageキーで管理されているため、一方の削除がもう一方を巻き込むことはない

## 壊れたデータへの耐性

- `loadMeetingMemories()`はJSON parseの例外を捕捉し、失敗時は空配列を返す
- 配列内の各要素は`isValidMemory()`で型チェックし、不正な要素は除外する（配列自体が壊れていても、有効な要素だけを復元する）
- これにより、localStorageの内容が手動編集や旧バージョンのデータで壊れていても、アプリ全体が起動不能になることはない

## 将来バックエンド化する場合の移行方針

- 現在のデータ構造はそのままAPIのレスポンス/リクエスト形式に転用できるよう、フラットなJSON互換の構造にしている
- `titleId`を参照のみで保持する設計のため、バックエンド化後も称号マスタデータ（`titleDefinitions`相当）は別テーブル/別エンドポイントとして分離しやすい
- 移行時は「localStorageの`yokomoji-bingo:meetingMemories:v1`を読み出し、ユーザーIDと紐付けてサーバーへ一括アップロードする」ワンショットの移行スクリプトを想定する（今回は実装しない、スコープ外）
- 100件上限はローカル運用時の肥大化防止が目的であり、バックエンド化後は上限を緩和する余地がある
