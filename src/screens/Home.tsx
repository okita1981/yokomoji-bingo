type Props = {
  onStart: () => void;
  onOpenGlossary: () => void;
  onOpenCollection: () => void;
  onOpenMemory: () => void;
};

export function Home({ onStart, onOpenGlossary, onOpenCollection, onOpenMemory }: Props) {
  return (
    <div className="screen home-screen">
      <div className="home-hero">
        <h1>Buzzword Quest</h1>
        <p className="home-tagline">意識だけで上まで行け</p>
        <p className="home-subcopy">横文字を集め、組織の頂点へ。</p>

        <button type="button" className="primary-btn" onClick={onStart}>
          会議を始める
        </button>

        <div className="home-secondary-nav">
          <button type="button" className="secondary-btn" onClick={onOpenGlossary}>
            📖 横文字用語集
          </button>
          <button type="button" className="secondary-btn" onClick={onOpenCollection}>
            🏆 称号コレクション
          </button>
          <button type="button" className="secondary-btn" onClick={onOpenMemory}>
            🗂 会議メモリ
          </button>
        </div>
      </div>

      <div className="home-about">
        <h2>これは何？</h2>
        <p>会議に登場する横文字を収集し、あなたの意識の高さを可視化するビジネスゲームです。</p>
        <p>
          「パーパス」「アライン」「ノーススター」などが発言されたら、該当するマスをタップしてください。
        </p>
        <p>
          会議終了後、使用された横文字をもとに本日の議事録と翻訳を生成し、あなたに最適な称号を授与します。
        </p>
        <p className="home-about-punchline">
          なお、称号の獲得と実務能力に相関関係は確認されていません。
        </p>
      </div>
    </div>
  );
}
