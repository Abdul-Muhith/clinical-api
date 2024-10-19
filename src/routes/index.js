import express from "express";

import routerV1 from "./v1/index.js";

const router = express.Router();

// → → → Register the version 1 routes → → →
router.use("/api/v1", routerV1);

export default router;
