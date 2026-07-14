import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Result } from "./Result";
import { NO_TITLE, titleDefinitions } from "../data/titles";

describe("Result screen", () => {
  it("renders without a broken image when imagePath is null", () => {
    render(
      <Result
        titleDef={titleDefinitions[0]}
        bingoCount={1}
        selectedWords={[]}
        bossText="テストのラスボス文章"
        translation="テストの翻訳。要するに、みんなで頑張ります。"
        onReplay={() => {}}
      />
    );
    expect(screen.getByText(titleDefinitions[0].name)).toBeInTheDocument();
    expect(screen.getByText(titleDefinitions[0].description)).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders correctly for NO_TITLE (no bingo achieved)", () => {
    render(
      <Result
        titleDef={NO_TITLE}
        bingoCount={0}
        selectedWords={[]}
        bossText="テストのラスボス文章"
        translation="テストの翻訳。"
        onReplay={() => {}}
      />
    );
    expect(screen.getByText("まだ日本語で会話できる人")).toBeInTheDocument();
  });

  it("shows the image element when imagePath is set", () => {
    const withImage = { ...titleDefinitions[0], imagePath: "/images/titles/example.webp" };
    render(
      <Result
        titleDef={withImage}
        bingoCount={1}
        selectedWords={[]}
        bossText="テスト"
        translation="テスト。"
        onReplay={() => {}}
      />
    );
    expect(document.querySelector("img")).toBeInTheDocument();
  });
});
