import express from "express";

import healthRouter from "./health.js";
import authRouter from "./auth.js";

const router = express.Router();

// → → → HEALTH CHECK ROUTE → → →
router.use("/local/health", healthRouter);

// → → → AUTH ROUTE → → →
router.use("/auth", authRouter);

export default router;
