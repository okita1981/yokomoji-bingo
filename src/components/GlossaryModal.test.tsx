import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GlossaryModal } from "./GlossaryModal";
import type { CustomWord } from "../types";

describe("GlossaryModal", () => {
  it("renders all 40 base words", () => {
    render(<GlossaryModal customWords={[]} onClose={() => {}} />);
    expect(screen.getByText("パーパス")).toBeInTheDocument();
    expect(screen.getByText("シナジー")).toBeInTheDocument();
  });

  it("filters by label as the user types", async () => {
    const user = userEvent.setup();
    render(<GlossaryModal customWords={[]} onClose={() => {}} />);
    await user.type(screen.getByPlaceholderText("横文字や意味で検索"), "パーパス");
    expect(screen.getByText("パーパス")).toBeInTheDocument();
    expect(screen.queryByText("シナジー")).not.toBeInTheDocument();
  });

  it("filters by meaning as the user types", async () => {
    const user = userEvent.setup();
    render(<GlossaryModal customWords={[]} onClose={() => {}} />);
    await user.type(screen.getByPlaceholderText("横文字や意味で検索"), "組織が長期的に目指す");
    expect(screen.getByText("ノーススター")).toBeInTheDocument();
  });

  it("shows an empty-state message when nothing matches", async () => {
    const user = userEvent.setup();
    render(<GlossaryModal customWords={[]} onClose={() => {}} />);
    await user.type(screen.getByPlaceholderText("横文字や意味で検索"), "存在しない単語xyz");
    expect(screen.getByText("該当する横文字が見つかりませんでした。")).toBeInTheDocument();
  });

  it("includes custom words in the list", () => {
    const custom: CustomWord = {
      id: "custom_1",
      label: "バリューアップ",
      meaning: "独自の意味",
      translation: "よしなに進めて",
      category: "common",
      isCustom: true,
    };
    render(<GlossaryModal customWords={[custom]} onClose={() => {}} />);
    expect(screen.getByText("バリューアップ")).toBeInTheDocument();
  });

  it("shows the default meaning for a custom word without one", () => {
    const custom: CustomWord = {
      id: "custom_2",
      label: "シナジー2.0",
      meaning: "あなたの会社でよく使われている横文字です。正確な意味は発言者にご確認ください。",
      translation: "よしなに進めて",
      category: "common",
      isCustom: true,
    };
    render(<GlossaryModal customWords={[custom]} onClose={() => {}} />);
    expect(
      screen.getByText("あなたの会社でよく使われている横文字です。正確な意味は発言者にご確認ください。")
    ).toBeInTheDocument();
  });
});
