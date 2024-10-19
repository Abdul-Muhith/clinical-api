import cors from "cors";
import morgan from "morgan";
import express from "express";

import config from "../config/index.js";

const presetMiddleware = [
  cors(config.cors), // CORS configuration
  morgan("dev"), // HTTP requests logging in development mode
  express.json(), // Middleware to parsed JSON request
  express.urlencoded({ extended: false }), // Middleware to parse URL-encoded data (form submissions)
];

export default presetMiddleware;
