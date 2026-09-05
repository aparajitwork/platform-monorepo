import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../Button";
import React from "react";

test("renders its children and responds to clicks", () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>)
  fireEvent.click(screen.getByRole('button', { name: "Click me" }))
  expect(handleClick).toHaveBeenCalledTimes(1);
})

test("applies the secondary variant's classes when specified", () => {
  render(<Button variant="secondary">Cancel</Button>);
  expect(screen.getByRole("button", { name: "Cancel" })).toHaveClass("border-line");
});