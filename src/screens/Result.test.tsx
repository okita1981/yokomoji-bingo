import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Result } from "./Result";
import { NO_TITLE, titleDefinitions } from "../data/titles";

const baseProps = {
  bingoCount: 1,
  selectedWords: [],
  bossText: "テストのラスボス文章",
  translation: "テストの翻訳。要するに、みんなで頑張ります。",
  onReplay: () => {},
  onViewCollection: () => {},
};

describe("Result screen", () => {
  it("renders without a broken image when imagePath is null", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByText(titleDefinitions[0].name)).toBeInTheDocument();
    expect(screen.getByText(titleDefinitions[0].description)).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders correctly for NO_TITLE (no bingo achieved)", () => {
    render(<Result {...baseProps} titleDef={NO_TITLE} bingoCount={0} isNewTitle={false} />);
    expect(screen.getByText("まだ日本語で会話できる人")).toBeInTheDocument();
  });

  it("shows the image element when imagePath is set", () => {
    const withImage = { ...titleDefinitions[0], imagePath: "/images/titles/example.webp" };
    render(<Result {...baseProps} titleDef={withImage} isNewTitle={false} />);
    expect(document.querySelector("img")).toBeInTheDocument();
  });

  it("labels the translation section as 翻訳, not 現場のおじさん翻訳", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByText("翻訳")).toBeInTheDocument();
    expect(screen.queryByText("現場のおじさん翻訳")).not.toBeInTheDocument();
  });

  it("shows a NEW badge when isNewTitle is true", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={true} />);
    expect(screen.getByText("NEW")).toBeInTheDocument();
  });

  it("does not show a NEW badge when isNewTitle is false", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.queryByText("NEW")).not.toBeInTheDocument();
  });

  it("has a link to the title collection", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByRole("button", { name: "コレクションを見る" })).toBeInTheDocument();
  });
});
