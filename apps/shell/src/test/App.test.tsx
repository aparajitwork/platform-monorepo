import { render, screen, fireEvent } from "@testing-library/react";
import App from "../App";

jest.mock("@platform/inventory", () => ({
  InventoryDashboard: () => <div>Inventory mock</div>,
}));

jest.mock("../config", () => ({
  MOCK_API_URL: "http://localhost:4001",
}));

jest.mock("@platform/analytics", () => ({
  AnalyticsDashboard: () => <div>Analytics mock</div>,
}));

jest.mock(
  "orders/OrdersDashboard",
  () => ({
    __esModule: true,
    default: ({ theme }: { theme: string }) => <div>Orders mock ({theme})</div>,
  }),
  { virtual: true },
);

test("renders all three widgets", async () => {
  render(<App />);
  expect(screen.getByText("Inventory mock")).toBeInTheDocument();
  expect(screen.getByText("Analytics mock")).toBeInTheDocument();
  expect(await screen.findByText(/Orders mock/)).toBeInTheDocument();
});

test("toggling theme updates the federated Orders remote's prop", async () => {
  render(<App />);
  await screen.findByText(/Orders mock \(light\)/);

  fireEvent.click(screen.getByRole("button", { name: /Toggle theme/ }));

  expect(await screen.findByText(/Orders mock \(dark\)/)).toBeInTheDocument();
});