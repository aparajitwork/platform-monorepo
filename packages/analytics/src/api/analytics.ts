
export type AnalyticsOverview = {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
}

export type RevenuePoint = { date: string; revenue: number; orders: number };

export type AnalyticsData = {
  overview: AnalyticsOverview;
  recentPoints: RevenuePoint[];
}

const fetchOverview = async (apiBaseUrl: string): Promise<AnalyticsOverview> => {
  const response = await fetch(`${apiBaseUrl}/api/analytics/overview`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

const fetchTimeSeries = async (apiBaseUrl: string, days: number): Promise<RevenuePoint[]> => {
  const response = await fetch(`${apiBaseUrl}/api/analytics/timeseries?days=${days}`);

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const data: { days: number; points: RevenuePoint[] } = await response.json();
  return data.points;
}

export const fetchAnalyticsData = async (apiBaseUrl: string): Promise<AnalyticsData> => {
  try {
    const [overview, recentPoints] = await Promise.all([
      fetchOverview(apiBaseUrl),
      fetchTimeSeries(apiBaseUrl, 7)
    ]);

    return { overview, recentPoints };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load analytics: ${message}`, { cause: err });
  }
}