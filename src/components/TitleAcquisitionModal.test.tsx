import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TitleAcquisitionModal } from "./TitleAcquisitionModal";
import { titleDefinitions } from "../data/titles";

describe("TitleAcquisitionModal", () => {
  it("shows NEW TITLE, the acquisition copy, and the title's name/description/rarity", () => {
    const def = titleDefinitions[0];
    render(<TitleAcquisitionModal titleDef={def} onContinue={() => {}} />);
    expect(screen.getByText("NEW TITLE")).toBeInTheDocument();
    expect(screen.getByText("称号を獲得しました")).toBeInTheDocument();
    expect(screen.getByText(def.name)).toBeInTheDocument();
    expect(screen.getByText(def.description)).toBeInTheDocument();
    expect(screen.getByText(def.rarity)).toBeInTheDocument();
  });

  it("shows the card image", () => {
    render(<TitleAcquisitionModal titleDef={titleDefinitions[0]} onContinue={() => {}} />);
    expect(document.querySelector("img")).toBeInTheDocument();
  });

  it("calls onContinue when 結果を見る is clicked", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<TitleAcquisitionModal titleDef={titleDefinitions[0]} onContinue={onContinue} />);
    await user.click(screen.getByRole("button", { name: "結果を見る" }));
    expect(onContinue).toHaveBeenCalledTimes(1);
  });

  it("calls onContinue when Escape is pressed", async () => {
    const user = userEvent.setup();
    const onContinue = vi.fn();
    render(<TitleAcquisitionModal titleDef={titleDefinitions[0]} onContinue={onContinue} />);
    await user.keyboard("{Escape}");
    expect(onContinue).toHaveBeenCalledTimes(1);
  });
});
