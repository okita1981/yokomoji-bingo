import { afterEach, describe, expect, it, vi } from "vitest";
import { buildShareText, shareResult } from "./share";

describe("buildShareText", () => {
  it("uses the Buzzword Quest brand name and new hashtags", () => {
    const text = buildShareText("横文字ネイティブ", "一言添える文", "本日の議事録の本文", "翻訳の本文");
    expect(text).toContain("Buzzword Questで『横文字ネイティブ』に昇格しました。");
    expect(text).toContain("#BuzzwordQuest");
    expect(text).toContain("#意識だけで上まで行け");
    expect(text).toContain("#横文字ビンゴ");
  });

  it("labels the sections as 本日の議事録 and 翻訳", () => {
    const text = buildShareText("称号", "一言", "議事録の内容", "翻訳の内容");
    expect(text).toContain("本日の議事録：\n議事録の内容");
    expect(text).toContain("翻訳：\n翻訳の内容");
  });

  it("truncates a very long meeting minutes text", () => {
    const longMinutes = "あ".repeat(200);
    const text = buildShareText("称号", "一言", longMinutes, "翻訳");
    expect(text).toContain("…");
    expect(text.length).toBeLessThan(longMinutes.length + 200);
  });
});

describe("shareResult", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses navigator.share when available", async () => {
    const shareMock = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share: shareMock });

    const result = await shareResult("称号", "一言", "議事録", "翻訳");
    expect(result).toBe("shared");
    expect(shareMock).toHaveBeenCalledTimes(1);
  });

  it("falls back to clipboard when navigator.share is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: { writeText } });

    const result = await shareResult("称号", "一言", "議事録", "翻訳");
    expect(result).toBe("copied");
    expect(writeText).toHaveBeenCalledTimes(1);
  });

  it("returns failed when both share and clipboard are unavailable", async () => {
    vi.stubGlobal("navigator", { ...navigator, share: undefined, clipboard: undefined });

    const result = await shareResult("称号", "一言", "議事録", "翻訳");
    expect(result).toBe("failed");
  });
});
