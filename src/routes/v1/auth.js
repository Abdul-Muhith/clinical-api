import express from "express";

import authController from "../../api/v1/auth/controllers/index.js";

import { authenticate, authorize } from "../../middlewares/index.js";

const router = express.Router();

router.post("/local/register", authController.signup);
router.post("/local/login", authController.signin);
router.post(
  "/verification/account-verification/:id",
  authenticate,
  authorize([`administrator`]),
  authController.verification
);

export default router;
