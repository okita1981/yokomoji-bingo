import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Result } from "./Result";
import { NO_TITLE, titleDefinitions } from "../data/titles";

const baseProps = {
  bingoCount: 1,
  unlockCount: 1,
  selectedWords: [],
  meetingMinutes: "テストの議事録",
  translation: "テストの翻訳。要するに、みんなで頑張ります。",
  onReplay: () => {},
  onViewCollection: () => {},
};

describe("Result screen", () => {
  it("renders without a broken image when imagePath is null", () => {
    const noImage = { ...titleDefinitions[0], imagePath: null };
    render(<Result {...baseProps} titleDef={noImage} isNewTitle={false} />);
    expect(screen.getByText(noImage.name)).toBeInTheDocument();
    expect(screen.getByText(noImage.description)).toBeInTheDocument();
    expect(document.querySelector("img")).not.toBeInTheDocument();
  });

  it("renders correctly for NO_TITLE (no bingo achieved)", () => {
    render(<Result {...baseProps} titleDef={NO_TITLE} bingoCount={0} unlockCount={0} isNewTitle={false} />);
    expect(screen.getByText("まだ日本語で会話できる人")).toBeInTheDocument();
  });

  it("shows the image element when imagePath is set", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(document.querySelector("img")).toBeInTheDocument();
  });

  it("shows the rarity badge", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByText(titleDefinitions[0].rarity)).toBeInTheDocument();
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

  it("shows a re-acquired message with unlockCount when not new and unlockCount > 1", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} unlockCount={3} />);
    expect(screen.getByText(/この称号を再獲得しました/)).toBeInTheDocument();
    expect(screen.getByText(/3回/)).toBeInTheDocument();
  });

  it("does not show a re-acquired message on the very first unlock (unlockCount=1, isNewTitle=true)", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={true} unlockCount={1} />);
    expect(screen.queryByText(/再獲得/)).not.toBeInTheDocument();
  });

  it("has a link to the title collection", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByRole("button", { name: "コレクションを見る" })).toBeInTheDocument();
  });

  it("labels the meeting minutes section as 本日の議事録, not ラスボス文章", () => {
    render(<Result {...baseProps} titleDef={titleDefinitions[0]} isNewTitle={false} />);
    expect(screen.getByText("本日の議事録")).toBeInTheDocument();
    expect(screen.getByText("テストの議事録")).toBeInTheDocument();
    expect(screen.queryByText("ラスボス文章")).not.toBeInTheDocument();
  });

  it("still shows the meeting minutes and translation when the image fails to load", () => {
    const brokenImage = { ...titleDefinitions[0], imagePath: "/images/titles/does-not-exist.webp" };
    render(<Result {...baseProps} titleDef={brokenImage} isNewTitle={false} />);
    const img = document.querySelector("img")!;
    img.dispatchEvent(new Event("error"));
    expect(screen.getByText("本日の議事録")).toBeInTheDocument();
    expect(screen.getByText("テストの議事録")).toBeInTheDocument();
    expect(screen.getByText("翻訳")).toBeInTheDocument();
  });
});
