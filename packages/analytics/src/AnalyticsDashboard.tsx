import { useEffect, useState } from 'react';
import { Card, ThemeToggleButton, useTheme } from "@platform/shared-ui";
import { fetchAnalyticsData, type AnalyticsData } from './api/analytics';
import Stat from './Stat';
import AnalyticsSkeleton from './AnalyticsSkeleton';

type AnalyticsDashboardProps = {
  apiBaseUrl: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error", message: string }
  | { status: "success", data: AnalyticsData };

export const AnalyticsDashboard = ({ apiBaseUrl }: AnalyticsDashboardProps) => {
  const { theme } = useTheme();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchAnalyticsData(apiBaseUrl)
      .then((data) => {
      if (!cancelled) setState({ status: 'success', data })
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setState({ status: "error", message });
        }
      })
    
    return () => { cancelled = true; }
  }, [apiBaseUrl, reloadKey]);

  const handleRetry = () => {
    setState({ status: 'loading' })
    setReloadKey(prev => prev + 1);
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Analytics</h2>
        <ThemeToggleButton />
      </div>
      <p className="mt-1 text-sm text-ink-muted">Viewing in {theme} mode</p>

      {state.status === "loading" && <AnalyticsSkeleton />}

      {state.status === "error" && (
        <div className="mt-3">
          <p className="text-sm text-ink-muted">Couldn't load analytics: {state.message}</p>
          <button
            type="button"
            onClick={handleRetry}
            className="mt-3 rounded-md border border-line px-3 py-1.5 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "success" && (
        <>
          <dl className="mt-3 grid grid-cols-2 gap-4">
            <Stat label="Revenue" value={`$${state.data.overview.totalRevenue.toLocaleString()}`} />
            <Stat label="Orders" value={state.data.overview.totalOrders.toLocaleString()} />
            <Stat label="Conversion" value={`${state.data.overview.conversionRate}%`} />
            <Stat label="Avg. order" value={`$${state.data.overview.avgOrderValue}`} />
          </dl>

          <ul className="mt-4 divide-y divide-line">
            {state.data.recentPoints.map((point) => (
              <li key={point.date} className="flex items-center justify-between py-2 text-sm">
                <span className="text-ink-muted">{point.date}</span>
                <span className="font-medium">${point.revenue.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </Card>
  )
}