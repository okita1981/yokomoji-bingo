import type { TitleRarity } from "../data/titles";

type Props = {
  rarity: TitleRarity;
};

// カード画像自体にレア度フレームが焼き込まれているため、アプリ側は控えめな補助バッジとして文字も併記する。
export function RarityBadge({ rarity }: Props) {
  return <span className={`rarity-badge rarity-${rarity.toLowerCase()}`}>{rarity}</span>;
}
