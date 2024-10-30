import express from "express";

import { create } from "../../api/v1/doctor/controllers/index.js";

const router = express.Router();

router.post("/", create);

export default router;
