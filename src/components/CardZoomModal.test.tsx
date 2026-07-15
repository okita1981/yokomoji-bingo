import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CardZoomModal } from "./CardZoomModal";
import { titleDefinitions } from "../data/titles";
import type { UnlockedTitleRecord } from "../utils/titleCollection";

const record: UnlockedTitleRecord = {
  titleId: titleDefinitions[0].id,
  firstUnlockedAt: "2026-01-01T00:00:00.000Z",
  lastUnlockedAt: "2026-01-05T00:00:00.000Z",
  unlockCount: 2,
  bestScore: 10,
  bestBingoCount: 1,
  bestSelectedWordCount: 5,
};

describe("CardZoomModal", () => {
  it("shows the card image, rarity, name, description, and stats", () => {
    render(<CardZoomModal titleDef={titleDefinitions[0]} record={record} onClose={() => {}} />);
    expect(document.querySelector("img")).toBeInTheDocument();
    expect(screen.getByText(titleDefinitions[0].rarity)).toBeInTheDocument();
    expect(screen.getByText(titleDefinitions[0].name)).toBeInTheDocument();
    expect(screen.getByText(titleDefinitions[0].description)).toBeInTheDocument();
    expect(screen.getByText("2回")).toBeInTheDocument();
    expect(screen.getByText("10")).toBeInTheDocument();
  });

  it("closes when the close button is clicked", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CardZoomModal titleDef={titleDefinitions[0]} record={record} onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "閉じる" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CardZoomModal titleDef={titleDefinitions[0]} record={record} onClose={onClose} />);
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
