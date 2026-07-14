import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

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
    // The calculator UI (AC button, digit grid) must not exist anywhere in the app.
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
