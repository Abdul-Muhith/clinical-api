import express from "express";

import { findAll } from "../../api/v1/member/controllers/index.js";

const router = express.Router();

router.route("/local").get(findAll);

export default router;
