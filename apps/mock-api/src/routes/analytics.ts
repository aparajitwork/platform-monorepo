import { Router } from "express";
import { analyticsOverview, generateTimeseries } from "../data/analytics";
import { randomDelay } from "../utils/delay";

export const analyticsRouter = Router();

analyticsRouter.get("/overview", async (_req, res) => {
  await randomDelay();
  res.json(analyticsOverview);
});

analyticsRouter.get("/timeseries", async (req, res) => {
  await randomDelay();

  const daysParam = Number(req.query.days);
  const days = Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 90) : 30;

  res.json({ days, points: generateTimeseries(days) });
});