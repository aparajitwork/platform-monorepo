import { render, screen } from "@testing-library/react";
import { Card } from "../Card";
import React from "react";

test("renders its children", () => {
  render(<Card>Some content</Card>);
  expect(screen.getByText("Some content")).toBeInTheDocument();
});