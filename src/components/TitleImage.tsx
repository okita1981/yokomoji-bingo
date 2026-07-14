import { useState } from "react";

type Props = {
  imagePath: string | null;
  alt: string;
  className: string;
};

// imagePathがnull、または画像読み込みに失敗した場合は何も描画しない（プレースホルダーやシルエットは出さない）。
export function TitleImage({ imagePath, alt, className }: Props) {
  const [failed, setFailed] = useState(false);

  if (!imagePath || failed) return null;

  return (
    <div className={className}>
      <img src={imagePath} alt={alt} onError={() => setFailed(true)} />
    </div>
  );
}
