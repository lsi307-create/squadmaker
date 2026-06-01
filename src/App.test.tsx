import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("App", () => {
  it("marks a roster player present and opens actions when tapped again", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("button", { name: /김은규/ })).toHaveTextContent("미출석");

    await user.click(screen.getByRole("button", { name: /김은규/ }));

    expect(screen.getByRole("button", { name: /김은규/ })).toHaveTextContent("출석");
    expect(screen.getByRole("button", { name: /김은규/ })).toHaveTextContent("#1");

    await user.click(screen.getByRole("button", { name: /김은규/ }));

    expect(screen.getByRole("dialog", { name: "김은규 상태 변경" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "잠시 제외" })).toBeInTheDocument();
  });

  it("switches between the three bottom tabs", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "A팀" }));
    expect(screen.getByRole("heading", { name: "A팀" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "B팀" }));
    expect(screen.getByRole("heading", { name: "B팀" })).toBeInTheDocument();
  });

  it("distributes active players into A and B teams when auto assign is tapped", async () => {
    const { container } = render(<App />);
    const playerCards = Array.from(container.querySelectorAll<HTMLButtonElement>(".player-card"));

    for (const playerCard of playerCards.slice(0, 23)) {
      fireEvent.click(playerCard);
    }

    fireEvent.click(screen.getByRole("button", { name: "자동 배정" }));

    expect(screen.getByRole("heading", { name: "A팀" })).toBeInTheDocument();
    expect(screen.getByText("A팀 11명")).toBeInTheDocument();
    expect(screen.getByText("B팀 11명")).toBeInTheDocument();
    expect(screen.getByText("대기 1명")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "B팀" }));

    expect(screen.getByRole("heading", { name: "B팀" })).toBeInTheDocument();
    expect(screen.getByText("B팀 11명")).toBeInTheDocument();
  });
});
