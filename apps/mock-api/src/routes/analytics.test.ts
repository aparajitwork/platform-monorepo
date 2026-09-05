import express from "express";
import request from "supertest";
import { analyticsRouter } from "./analytics";

function buildApp() {
  const app = express();
  app.use("/api/analytics", analyticsRouter);
  return app;
}

describe("GET /api/analytics/overview", () => {
  it("returns the summary object", async () => {
    const res = await request(buildApp()).get("/api/analytics/overview");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("totalRevenue");
  });
});

describe("GET /api/analytics/timeseries", () => {
  it("defaults to 30 days", async () => {
    const res = await request(buildApp()).get("/api/analytics/timeseries");
    expect(res.body.days).toBe(30);
    expect(res.body.points).toHaveLength(30);
  });

  it("respects a custom days value", async () => {
    const res = await request(buildApp()).get("/api/analytics/timeseries?days=7");
    expect(res.body.points).toHaveLength(7);
  });

  it("caps days at 90", async () => {
    const res = await request(buildApp()).get("/api/analytics/timeseries?days=500");
    expect(res.body.points).toHaveLength(90);
  });
});