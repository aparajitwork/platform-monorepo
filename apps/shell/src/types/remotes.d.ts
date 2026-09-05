declare module "orders/OrdersDashboard" {
  import type { ComponentType } from "react";

  export type Theme = "light" | "dark";
  const OrdersDashboard: ComponentType<{ theme: Theme }>;
  export default OrdersDashboard;
}