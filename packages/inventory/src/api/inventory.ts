
type CategoryType = "footwear" | "outerwear" | "accessories";
type WareHouseType = "BLR-1" | "DEL-2" | "MUM-3";

export type InventoryItem = {
  id: string;
  sku: string;
  name: string;
  category: CategoryType;
  quantity: number;
  warehouse: WareHouseType;
  price: number;
  lowStock: boolean;
}

type InventoryItemsResponse = {
  items: InventoryItem[];
  count: number;
}

export const fetchInventoryItems = async (apiBaseUrl: string): Promise<InventoryItem[]> => {
  try {
    const response = await fetch(`${apiBaseUrl}/api/inventory/items`);
    if (!response.ok) {
      throw new Error(`Failed to load inventory: ${response.status}`);
    }

    const data: InventoryItemsResponse = await response.json();
    return data.items;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(`Failed to load inventory: ${message}`, { cause: err })
  }
}