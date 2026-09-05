export type AnalyticsOverview = {
  period: string;
  totalRevenue: number;
  totalOrders: number;
  conversionRate: number;
  avgOrderValue: number;
};

export const analyticsOverview: AnalyticsOverview = {
  period: "last_30_days",
  totalRevenue: 284650,
  totalOrders: 1042,
  conversionRate: 3.4,
  avgOrderValue: 273,
};

export type RevenuePoint = { date: string; revenue: number; orders: number };

export function generateTimeseries(days: number): RevenuePoint[] {
  const points: RevenuePoint[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);

    const weekday = date.getDay();
    const weekendDip = weekday === 0 || weekday === 6 ? 0.7 : 1;
    const wave = Math.sin(i / 4) * 1500;
    const revenue = Math.round((8500 + wave) * weekendDip);
    const orders = Math.round(revenue / 273);

    points.push({ date: date.toISOString().slice(0, 10), revenue, orders });
  }

  return points;
}