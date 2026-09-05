import { Card, ThemeToggleButton, useTheme } from "@platform/shared-ui";
import { fetchInventoryItems, type InventoryItem } from "./api/inventory";
import { useEffect, useState } from "react";
import InventorySkeleton from "./InventorySkeleton";

type InventoryDashboardProps = {
  apiBaseUrl: string;
}

type LoadState =
  | { status: "loading" }
  | { status: "error", message: string }
  | { status: "success", items: InventoryItem[] }

export const InventoryDashboard = ({ apiBaseUrl}: InventoryDashboardProps) => {
  const { theme } = useTheme();
  const [state, setState] = useState<LoadState>({ status: "loading" });
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    fetchInventoryItems(apiBaseUrl)
      .then((items) => {
        if (!cancelled) setState({ status: "success", items})
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : "Something went wrong";
          setState({ status: "error", message })
      }
    })
    
    return () => { cancelled = true; }
  }, [apiBaseUrl, reloadKey])

  const handleRetry = () => {
    setState({ status: "loading" })
    setReloadKey(prev => prev + 1);
  }

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium">Inventory</h2>
        <ThemeToggleButton />
      </div>
      <p className="mt-1 text-sm text-ink-muted">Viewing in {theme} mode</p>

      {state.status === "loading" && <InventorySkeleton />}

      {state.status === "error" && (
        <div className="mt-3">
          <p className='text-sm text-ink-muted'>Couldn't load inventory: {state.message}</p>
          <button
            type='button'
            onClick={handleRetry}
            className="mt-3 rounded-md border border-line px-3 py-1.5 text-sm"
          >
            Retry
          </button>
        </div>
      )}

      {state.status === "success" && state.items.length === 0 && (
        <p className="mt-3 text-sm text-ink-muted">No items in stock.</p>
      )}

      {state.status === "success" && state.items.length > 0 && (
        <ul className="mt-3 divide-y divide-line">
          {state.items.map((item) => (
            <li key={item.id} className="flex items-center justify-between py-2 text-sm">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-ink-muted">
                  {item.sku} · {item.warehouse}
                </p>
              </div>
              <div className="text-right">
                <p className="font-medium">${item.price}</p>
                <p className={item.lowStock ? "text-danger" : "text-ink-muted"}>
                  {item.quantity} in stock
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  )
}