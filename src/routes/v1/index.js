import express from "express";

import healthRouter from "./health.js";
import authRouter from "./auth.js";
import doctorRouter from "./doctor.js";

const router = express.Router();

// → → → HEALTH CHECK ROUTE → → →
router.use("/local/health", healthRouter);

// → → → AUTH ROUTE → → →
router.use("/auth", authRouter);

// → → → DOCTOR ROUTE → → →
router.use("/doctors", doctorRouter);

export default router;
