import express from "express";

const router = express.Router();

router.get("/", (_req, res) => {
  res.status(200).json({
    code: 200,
    message: "The service is operational and functioning properly.",
    data: {
      status: true,
      uptime: process.uptime(), // Uptime in seconds
      timestamp: new Date().toISOString(),
    },
  });
});

export default router;
