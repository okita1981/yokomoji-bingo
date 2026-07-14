import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";
import { loadMeetingMemories } from "./utils/meetingMemory";
import { loadTitleCollection } from "./utils/titleCollection";

describe("App - camouflage feature removal", () => {
  beforeEach(() => {
    localStorage.clear();
  });
  afterEach(() => {
    localStorage.clear();
  });

  it("does not render a hide button on the Bingo screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    expect(screen.queryByRole("button", { name: "隠す" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("隠す")).not.toBeInTheDocument();
  });

  it("renders the 横文字用語集 button instead", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    expect(screen.getByRole("button", { name: /横文字用語集/ })).toBeInTheDocument();
  });

  it("never renders a decoy calculator screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    expect(screen.queryByText("AC")).not.toBeInTheDocument();
    expect(document.querySelector(".decoy-screen")).not.toBeInTheDocument();
  });

  it("opens the glossary modal from the Bingo screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByRole("button", { name: /横文字用語集/ }));
    expect(screen.getByText("分かったふりをする前に、一応確認しておこう。")).toBeInTheDocument();
  });
});

describe("App - translation label rename", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("shows 翻訳 instead of 現場のおじさん翻訳 on the Result screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByText("会議を終了する"));
    expect(screen.getByText("翻訳")).toBeInTheDocument();
    expect(screen.queryByText("現場のおじさん翻訳")).not.toBeInTheDocument();
  });
});

describe("App - Home navigation to Collection and Meeting Memory", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("opens the title collection from Home and can return", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /称号コレクション/ }));
    expect(screen.getByText("称号コレクション")).toBeInTheDocument();
    expect(screen.getByText("0 / 20 獲得")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.getByText("会議を始める")).toBeInTheDocument();
  });

  it("opens meeting memory from Home showing the empty state", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /会議メモリ/ }));
    expect(screen.getByText("まだ会議メモリがありません。会議を終了すると記録されます。")).toBeInTheDocument();
  });
});

describe("App - meeting memory and title collection recording", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("saves exactly one meeting memory and one title-collection record when a meeting ends", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByText("会議を終了する"));

    expect(loadMeetingMemories()).toHaveLength(1);
    expect(loadTitleCollection().length).toBeLessThanOrEqual(1);
  });

  it("does not duplicate the meeting memory just by re-rendering the Result screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByText("会議を終了する"));
    expect(loadMeetingMemories()).toHaveLength(1);

    // Navigating away to the collection and back does not re-trigger a save.
    await user.click(screen.getByRole("button", { name: "コレクションを見る" }));
    expect(loadMeetingMemories()).toHaveLength(1);
  });
});
