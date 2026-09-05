import express from "express";
import request from "supertest";
import { inventoryRouter } from "../routes/inventory";

function buildApp() {
  const app = express();
  app.use("/api/inventory", inventoryRouter);
  return app;
}

describe("GET /api/inventory/items", () => {
  it("returns all items by default", async () => {
    const res = await request(buildApp()).get("/api/inventory/items");
    expect(res.status).toBe(200);
    expect(res.body.count).toBeGreaterThan(0);
  });

  it("filters by category", async () => {
    const res = await request(buildApp()).get("/api/inventory/items?category=footwear");
    expect(
      res.body.items.every((item: { category: string }) => item.category === "footwear"),
    ).toBe(true);
  });

  it("filters by lowStock=true", async () => {
    const res = await request(buildApp()).get("/api/inventory/items?lowStock=true");
    expect(res.body.items.every((item: { lowStock: boolean }) => item.lowStock)).toBe(true);
  });
});

describe("GET /api/inventory/items/:id", () => {
  it("returns 404 for an unknown id", async () => {
    const res = await request(buildApp()).get("/api/inventory/items/does-not-exist");
    expect(res.status).toBe(404);
  });

  it("returns the item for a known id", async () => {
    const res = await request(buildApp()).get("/api/inventory/items/inv_001");
    expect(res.status).toBe(200);
    expect(res.body.id).toBe("inv_001");
  });
});