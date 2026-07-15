# Buzzword Quest

意識だけで上まで行け。横文字を集め、組織の頂点へ。

会議に登場する横文字を収集し、意識の高さを可視化するスマホ向けPWA。メインゲーム方式の名称は「横文字ビンゴ」（5×5・12ライン判定）。

## 主な機能

- 横文字ビンゴ（5×5・12ライン判定）／カスタムワード追加
- 横文字用語集（40語の意味・翻訳を検索付きで閲覧）
- 称号（20件・special/combo/normal階層判定）と称号コレクション（獲得履歴・リセット機能）
- 会議メモリ（過去100件までの議事録・翻訳の履歴、一覧/詳細/削除）
- 本日の議事録・翻訳の自動生成（テンプレート・締め文を多数用意）
- Web Share API連携、PWA対応、localStorage永続化

## ドキュメント

- [称号カタログ](docs/title-catalog.md) — 20称号のデータ・判定ロジック・コレクション仕様
- [会議メモリ仕様](docs/meeting-memory-spec.md) — 保存データ構造・移行方針
- [コンテンツ生成仕様](docs/content-generation-spec.md) — 議事録テンプレート・翻訳生成ルール

## 開発

```bash
npm install
npm run dev
npm run test
npm run build
```

---

このプロジェクトはVite + React + TypeScriptで構築されている。
