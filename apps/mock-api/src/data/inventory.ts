type ItemCategory = "footwear" | "outerwear" | "accessories";
type WareHouse = "BLR-1" | "DEL-2" | "MUM-3"

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: ItemCategory;
  quantity: number;
  warehouse: WareHouse;
  price: number;
  lowStock: boolean;
}

export const inventoryItems: InventoryItem[] = [
  { id: "inv_001", sku: "TR2-UK8", name: "Trail Runner 2 — UK 8", category: "footwear", quantity: 42, warehouse: "BLR-1", price: 129, lowStock: false },
  { id: "inv_002", sku: "TR2-UK10", name: "Trail Runner 2 — UK 10", category: "footwear", quantity: 3, warehouse: "BLR-1", price: 129, lowStock: true },
  { id: "inv_003", sku: "SSJ-M", name: "Summit Shell Jacket — M", category: "outerwear", quantity: 18, warehouse: "DEL-2", price: 219, lowStock: false },
  { id: "inv_004", sku: "SSJ-L", name: "Summit Shell Jacket — L", category: "outerwear", quantity: 5, warehouse: "DEL-2", price: 219, lowStock: true },
  { id: "inv_005", sku: "TS-2PK", name: "Trail Socks (2-pack)", category: "accessories", quantity: 130, warehouse: "MUM-3", price: 18, lowStock: false },
  { id: "inv_006", sku: "TG-STD", name: "Trail Gaiters", category: "accessories", quantity: 7, warehouse: "MUM-3", price: 32, lowStock: true },
];