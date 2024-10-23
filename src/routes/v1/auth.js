import express from "express";

import authController from "../../api/v1/auth/controllers/index.js";

const router = express.Router();

router.post("/local/register", authController.signup);
router.post("/local/login", authController.signin);

export default router;
