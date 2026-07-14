type Props = {
  onStart: () => void;
};

export function Home({ onStart }: Props) {
  return (
    <div className="screen home-screen">
      <div className="home-hero">
        <h1>横文字ビンゴ</h1>
        <p className="home-tagline">会議に出た横文字をタップしろ</p>
        <button type="button" className="primary-btn" onClick={onStart}>
          会議を始める
        </button>
      </div>

      <div className="home-about">
        <h2>これは何？</h2>
        <p>
          ビジネス用語学習アプリです。会議で誰かが「パーパス」「アライン」「ノーススター」と言うたびに、
          あなたのボキャブラリー力がレベルアップしていく仕組みになっています（たぶん）。
        </p>
        <p>
          横文字を集めきると、あなたの意識の高さを客観的に測定した「称号」が授与されます。
          学びは、いつも予期せぬ場所にあります。
        </p>
      </div>
    </div>
  );
}
