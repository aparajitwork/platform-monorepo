import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "../ThemeContext";
import { ThemeToggleButton } from "../ThemeToggleButton";
import React from "react";

test("toggles its own label when clicked", () => {
  render(
    <ThemeProvider>
      <ThemeToggleButton />
    </ThemeProvider>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Toggle theme (light)" }));
  expect(screen.getByRole("button", { name: "Toggle theme (dark)" })).toBeInTheDocument();
});