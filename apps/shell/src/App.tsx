import { AnalyticsDashboard } from '@platform/analytics';
import { InventoryDashboard } from '@platform/inventory';
import { ThemeProvider, ThemeToggleButton, useTheme } from '@platform/shared-ui';
import { lazy, Suspense } from 'react'
import OrdersFallback from './OrdersFallback';
import { MOCK_API_URL } from './config';

const OrdersDashboard = lazy(() => import("orders/OrdersDashboard").then((module) => ({
  default: module.OrdersDashboard
})));

const Dashboard = () => {
  const { theme } = useTheme();

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-ink">Trailhead — operations</h1>
        <ThemeToggleButton />
      </div>

      <InventoryDashboard apiBaseUrl={MOCK_API_URL} />
      <AnalyticsDashboard apiBaseUrl={MOCK_API_URL} />

      <Suspense fallback={<OrdersFallback />}>
        <OrdersDashboard theme={theme} />
      </Suspense>
    </div>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-surface">
        <Dashboard />
      </div>
    </ThemeProvider>
  )
}

export default App