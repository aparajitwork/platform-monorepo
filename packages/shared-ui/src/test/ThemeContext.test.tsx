import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider, useTheme } from "../ThemeContext";
import React from "react";

function Probe() {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="theme-value">{theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  );
}

test("defaults to light and toggles to dark", () => {
  render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByTestId("theme-value")).toHaveTextContent("light");
  fireEvent.click(screen.getByRole("button", { name: "toggle" }));
  expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
});

test("respects a defaultTheme override", () => {
  render(
    <ThemeProvider defaultTheme="dark">
      <Probe />
    </ThemeProvider>,
  );
  expect(screen.getByTestId("theme-value")).toHaveTextContent("dark");
});

test("sets data-theme on its wrapper element", () => {
  const { container } = render(
    <ThemeProvider>
      <Probe />
    </ThemeProvider>,
  );
  expect(container.querySelector('[data-theme="light"]')).not.toBeNull();
});

test("useTheme throws when used outside a ThemeProvider", () => {
  // React logs its own error to the console when a component throws during
  // render — expected here, so we suppress it rather than clutter otherwise
  // clean test output.
  const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  expect(() => render(<Probe />)).toThrow("useTheme must be used within a ThemeProvider");
  consoleSpy.mockRestore();
});