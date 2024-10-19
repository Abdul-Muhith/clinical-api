import express from "express";

import healthRouter from "./health.js";

const router = express.Router();

// → → → HEALTH CHECK ROUTE → → →
router.use("/local/health", healthRouter);

export default router;
