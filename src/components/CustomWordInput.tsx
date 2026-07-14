import { useState } from "react";

type Props = {
  onAdd: (label: string, translation: string, meaning: string) => void;
};

export function CustomWordInput({ onAdd }: Props) {
  const [label, setLabel] = useState("");
  const [meaning, setMeaning] = useState("");
  const [translation, setTranslation] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!label.trim()) return;
    onAdd(label, translation, meaning);
    setLabel("");
    setMeaning("");
    setTranslation("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button type="button" className="custom-word-toggle" onClick={() => setOpen(true)}>
        ＋ 自社ワードを追加
      </button>
    );
  }

  return (
    <form className="custom-word-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="横文字（例：バリューアップ）"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        maxLength={20}
        required
      />
      <input
        type="text"
        placeholder="意味（任意）"
        value={meaning}
        onChange={(e) => setMeaning(e.target.value)}
        maxLength={60}
      />
      <input
        type="text"
        placeholder="おじさん翻訳（任意）"
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
        maxLength={30}
      />
      <div className="custom-word-actions">
        <button type="submit">追加</button>
        <button type="button" onClick={() => setOpen(false)}>
          キャンセル
        </button>
      </div>
    </form>
  );
}
