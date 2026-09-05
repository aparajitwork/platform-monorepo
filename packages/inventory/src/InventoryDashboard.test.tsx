import type { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@platform/shared-ui";
import { InventoryDashboard } from "./InventoryDashboard";
import { fetchInventoryItems } from "./api/inventory";
import type { InventoryItem } from "./api/inventory";

jest.mock("./api/inventory", () => ({
  fetchInventoryItems: jest.fn(),
}));

const mockedFetch = jest.mocked(fetchInventoryItems);

const sampleItems: InventoryItem[] = [
  {
    id: "inv_001",
    sku: "TR2-UK8",
    name: "Trail Runner 2 — UK 8",
    category: "footwear",
    quantity: 42,
    warehouse: "BLR-1",
    price: 129,
    lowStock: false,
  },
];

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

beforeEach(() => {
  mockedFetch.mockReset();
});

test("shows a loading skeleton before the fetch resolves", () => {
  mockedFetch.mockReturnValue(new Promise(() => {}));
  renderWithTheme(<InventoryDashboard apiBaseUrl="http://localhost:4001" />);
  expect(screen.getByText("Inventory")).toBeInTheDocument();
  expect(screen.queryByRole("list")).not.toBeInTheDocument();
});

test("renders items once the fetch resolves", async () => {
  mockedFetch.mockResolvedValue(sampleItems);
  renderWithTheme(<InventoryDashboard apiBaseUrl="http://localhost:4001" />);
  expect(await screen.findByText("Trail Runner 2 — UK 8")).toBeInTheDocument();
});

test("shows an empty state with no items", async () => {
  mockedFetch.mockResolvedValue([]);
  renderWithTheme(<InventoryDashboard apiBaseUrl="http://localhost:4001" />);
  expect(await screen.findByText("No items in stock.")).toBeInTheDocument();
});

test("shows an error and recovers via Retry", async () => {
  mockedFetch.mockRejectedValueOnce(new Error("Network down"));
  renderWithTheme(<InventoryDashboard apiBaseUrl="http://localhost:4001" />);
  expect(await screen.findByText(/Couldn't load inventory: Network down/)).toBeInTheDocument();

  mockedFetch.mockResolvedValueOnce(sampleItems);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("Trail Runner 2 — UK 8")).toBeInTheDocument();
});

test("reads theme from context and toggles it via the shared ThemeToggleButton", () => {
  mockedFetch.mockReturnValue(new Promise(() => {}));
  renderWithTheme(<InventoryDashboard apiBaseUrl="http://localhost:4001" />);

  expect(screen.getByText("Viewing in light mode")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Toggle theme/ }));
  expect(screen.getByText("Viewing in dark mode")).toBeInTheDocument();
});