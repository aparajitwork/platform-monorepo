declare module "orders/OrdersDashboard" {
  import type { ComponentType } from "react";

  export type Theme = "light" | "dark";
  export const OrdersDashboard: ComponentType<{ theme: Theme }>;
}