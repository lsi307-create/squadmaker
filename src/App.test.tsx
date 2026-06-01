import { render, screen } from "@testing-library/react";
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
    expect(screen.getByText("A팀 전술판 준비 중")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "B팀" }));
    expect(screen.getByText("B팀 전술판 준비 중")).toBeInTheDocument();
  });
});
