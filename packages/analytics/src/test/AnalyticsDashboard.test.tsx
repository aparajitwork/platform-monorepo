import type { ReactElement } from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ThemeProvider } from "@platform/shared-ui";
import { AnalyticsDashboard } from "../AnalyticsDashboard";
import { fetchAnalyticsData } from "../api/analytics";
import type { AnalyticsData } from "../api/analytics";

jest.mock("../api/analytics", () => ({
  fetchAnalyticsData: jest.fn(),
}));

const mockedFetch = jest.mocked(fetchAnalyticsData);

const sampleData: AnalyticsData = {
  overview: {
    period: "last_30_days",
    totalRevenue: 284650,
    totalOrders: 1042,
    conversionRate: 3.4,
    avgOrderValue: 273,
  },
  recentPoints: [{ date: "2026-09-01", revenue: 8500, orders: 31 }],
};

function renderWithTheme(ui: ReactElement) {
  return render(<ThemeProvider>{ui}</ThemeProvider>);
}

beforeEach(() => {
  mockedFetch.mockReset();
});

test("shows a loading skeleton before the fetch resolves", () => {
  mockedFetch.mockReturnValue(new Promise(() => {}));
  renderWithTheme(<AnalyticsDashboard apiBaseUrl="http://localhost:4001" />);
  expect(screen.getByText("Analytics")).toBeInTheDocument();
});

test("renders overview stats once the fetch resolves", async () => {
  mockedFetch.mockResolvedValue(sampleData);
  renderWithTheme(<AnalyticsDashboard apiBaseUrl="http://localhost:4001" />);
  expect(await screen.findByText("$284,650")).toBeInTheDocument();
  expect(screen.getByText("1,042")).toBeInTheDocument();
});

test("shows an error and recovers via Retry", async () => {
  mockedFetch.mockRejectedValueOnce(new Error("Network down"));
  renderWithTheme(<AnalyticsDashboard apiBaseUrl="http://localhost:4001" />);
  expect(await screen.findByText(/Couldn't load analytics: Network down/)).toBeInTheDocument();

  mockedFetch.mockResolvedValueOnce(sampleData);
  fireEvent.click(screen.getByRole("button", { name: "Retry" }));
  expect(await screen.findByText("$284,650")).toBeInTheDocument();
});

test("reads theme from context and toggles it via the shared ThemeToggleButton", () => {
  mockedFetch.mockReturnValue(new Promise(() => {}));
  renderWithTheme(<AnalyticsDashboard apiBaseUrl="http://localhost:4001" />);

  expect(screen.getByText(/Viewing in light mode/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Toggle theme/ }));
  expect(screen.getByText(/Viewing in dark mode/)).toBeInTheDocument();
});