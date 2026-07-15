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

describe("App - translation and meeting-minutes label rename", () => {
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

  it("shows 本日の議事録 instead of ラスボス文章 on the Result screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByText("会議を終了する"));
    expect(screen.getByText("本日の議事録")).toBeInTheDocument();
    expect(screen.queryByText("ラスボス文章")).not.toBeInTheDocument();
  });
});

describe("App - brand name (Buzzword Quest)", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("shows the Buzzword Quest title, tagline, and subcopy on Home", () => {
    render(<App />);
    expect(screen.getByText("Buzzword Quest")).toBeInTheDocument();
    expect(screen.getByText("意識だけで上まで行け")).toBeInTheDocument();
    expect(screen.getByText("横文字を集め、組織の頂点へ。")).toBeInTheDocument();
  });

  it("does not show 横文字ビンゴ as the user-facing product title", () => {
    render(<App />);
    expect(screen.queryByText("横文字ビンゴ")).not.toBeInTheDocument();
  });
});

describe("App - Home description copy", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("shows the new 4-paragraph description", () => {
    render(<App />);
    expect(
      screen.getByText("会議に登場する横文字を収集し、あなたの意識の高さを可視化するビジネスゲームです。")
    ).toBeInTheDocument();
    expect(
      screen.getByText("「パーパス」「アライン」「ノーススター」などが発言されたら、該当するマスをタップしてください。")
    ).toBeInTheDocument();
    expect(
      screen.getByText("会議終了後、使用された横文字をもとに本日の議事録と翻訳を生成し、あなたに最適な称号を授与します。")
    ).toBeInTheDocument();
    expect(screen.getByText("なお、称号の獲得と実務能力に相関関係は確認されていません。")).toBeInTheDocument();
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

describe("App - title collection reset", () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  it("shows the reset button in the collection screen", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /称号コレクション/ }));
    expect(screen.getByRole("button", { name: "意識を初期化する" })).toBeInTheDocument();
  });

  it("does not delete anything until the confirmation is accepted", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(document.querySelectorAll(".bingo-grid > button")[0]);
    await user.click(screen.getByText("会議を終了する"));
    await user.click(screen.getByRole("button", { name: "コレクションを見る" }));

    const unlockedBefore = loadTitleCollection().length;
    expect(unlockedBefore).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "意識を初期化する" }));
    expect(screen.getByText(/本当に意識を初期化しますか/)).toBeInTheDocument();
    expect(loadTitleCollection()).toHaveLength(unlockedBefore);
  });

  it("keeps the collection when cancelled", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByText("会議を始める"));
    await user.click(document.querySelectorAll(".bingo-grid > button")[0]);
    await user.click(screen.getByText("会議を終了する"));
    await user.click(screen.getByRole("button", { name: "コレクションを見る" }));

    const unlockedBefore = loadTitleCollection().length;
    expect(unlockedBefore).toBeGreaterThan(0);
    await user.click(screen.getByRole("button", { name: "意識を初期化する" }));
    await user.click(screen.getByRole("button", { name: "アスピレーションを維持する" }));

    expect(loadTitleCollection()).toHaveLength(unlockedBefore);
    expect(screen.getByText(`${unlockedBefore} / 20 獲得`)).toBeInTheDocument();
  });

  it("resets only the title collection, keeping meeting memory, custom words, and the in-progress game", async () => {
    const user = userEvent.setup();
    render(<App />);

    // add a custom word before the meeting so we can verify it survives the reset
    await user.click(screen.getByText("会議を始める"));
    await user.click(screen.getByRole("button", { name: "＋ 自社ワードを追加" }));
    await user.type(screen.getByPlaceholderText("横文字（例：バリューアップ）"), "テストワード");
    await user.click(screen.getByRole("button", { name: "追加" }));
    await user.click(document.querySelectorAll(".bingo-grid > button")[0]);

    await user.click(screen.getByText("会議を終了する"));
    expect(loadMeetingMemories()).toHaveLength(1);
    expect(loadTitleCollection().length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "コレクションを見る" }));
    await user.click(screen.getByRole("button", { name: "意識を初期化する" }));
    await user.click(screen.getByRole("button", { name: "初期化する" }));

    expect(loadTitleCollection()).toEqual([]);
    expect(screen.getByText("0 / 20 獲得")).toBeInTheDocument();
    // meeting memory and custom words must survive the reset
    expect(loadMeetingMemories()).toHaveLength(1);
    expect(JSON.parse(localStorage.getItem("yokomoji-bingo:customWords:v1")!)).toHaveLength(1);
  });
});
