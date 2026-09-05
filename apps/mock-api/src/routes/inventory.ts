import { Router } from "express";
import { inventoryItems } from "../data/inventory";
import { randomDelay } from "../utils/delay";

export const inventoryRouter = Router();

inventoryRouter.get("/items", async (req, res) => {
  await randomDelay();

  const { category, lowStock, warehouse } = req.query;
  let results = inventoryItems;

  if (typeof category === "string") {
    results = results.filter((item) => item.category === category);
  }
  if (typeof warehouse === "string") {
    results = results.filter((item) => item.warehouse === warehouse);
  }
  if (lowStock === "true") {
    results = results.filter((item) => item.lowStock);
  }

  res.json({ items: results, count: results.length });
});

inventoryRouter.get("/items/:id", async (req, res) => {
  await randomDelay();

  const item = inventoryItems.find((i) => i.id === req.params.id);
  if (!item) {
    return res.status(404).json({ error: "Item not found" });
  }
  res.json(item);
});