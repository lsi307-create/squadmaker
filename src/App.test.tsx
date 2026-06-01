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

  it("places assigned players on a formation board and changes formation", () => {
    const { container } = render(<App />);
    const playerCards = Array.from(container.querySelectorAll<HTMLButtonElement>(".player-card"));

    for (const playerCard of playerCards.slice(0, 22)) {
      fireEvent.click(playerCard);
    }

    fireEvent.click(screen.getByRole("button", { name: "자동 배정" }));

    expect(screen.getByLabelText("A팀 포메이션 보드")).toBeInTheDocument();
    expect(screen.getByText("GK")).toBeInTheDocument();
    expect(screen.getByText("ST")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "532" }));

    expect(screen.getByText("LWB")).toBeInTheDocument();
    expect(screen.getByText("RST")).toBeInTheDocument();
  });

  it("swaps two players by tapping them on the formation board", () => {
    const { container } = render(<App />);
    const playerCards = Array.from(container.querySelectorAll<HTMLButtonElement>(".player-card"));

    for (const playerCard of playerCards.slice(0, 22)) {
      fireEvent.click(playerCard);
    }

    fireEvent.click(screen.getByRole("button", { name: "자동 배정" }));
    expect(screen.getByRole("button", { name: /LB 김은규/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /LCB 김진우/ })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /LB 김은규/ }));
    fireEvent.click(screen.getByRole("button", { name: /LCB 김진우/ }));

    expect(screen.getByRole("button", { name: /LB 김진우/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /LCB 김은규/ })).toBeInTheDocument();
  });

  it("records completed field quarters in player labels", () => {
    const { container } = render(<App />);
    const playerCards = Array.from(container.querySelectorAll<HTMLButtonElement>(".player-card"));

    for (const playerCard of playerCards.slice(0, 22)) {
      fireEvent.click(playerCard);
    }

    fireEvent.click(screen.getByRole("button", { name: "자동 배정" }));
    fireEvent.click(screen.getByRole("button", { name: "쿼터 종료" }));

    expect(screen.getByRole("button", { name: /LB 김은규 \(1\)/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /GK 임상엽/ })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /GK 임상엽 \(1\)/ })).not.toBeInTheDocument();
  });

  it("can recommend the next quarter from the team screen using lower field-quarter counts", () => {
    const { container } = render(<App />);
    const playerCards = Array.from(container.querySelectorAll<HTMLButtonElement>(".player-card"));

    for (const playerCard of playerCards.slice(0, 23)) {
      fireEvent.click(playerCard);
    }

    fireEvent.click(screen.getByRole("button", { name: "자동 배정" }));
    fireEvent.click(screen.getByRole("button", { name: "쿼터 종료" }));
    fireEvent.click(screen.getByRole("button", { name: "다음 쿼터 추천" }));

    expect(screen.getByText("현재 2쿼터")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /김안종/ })).toBeInTheDocument();
  });
});
