import express from "express";

import healthRouter from "./health.js";
import authRouter from "./auth.js";
import doctorRouter from "./doctor.js";
import memberRouter from "./member.js";

const router = express.Router();

// → → → HEALTH CHECK ROUTE → → →
router.use("/local/health", healthRouter);

// → → → AUTH ROUTE → → →
router.use("/auth", authRouter);

// → → → DOCTOR ROUTE → → →
router.use("/doctors", doctorRouter);

// → → → MEMBER ROUTE → → →
router.use("/members", memberRouter);

export default router;
