import dotenv from "dotenv";

import defaults from "./defaults.js";
import auth from "./auth.js";

// Load environment variables from .env file
dotenv.config();

const config = {
  defaults,
  auth,
  port: process.env.SERVER_PORT || 4000,
  type: process.env.TYPE,
  devDbConnectionUrl: process.env.DB_TEST_MONGO_URI,
  devDbConnectionUrlQuery: process.env.DB_TEST_MONGO_URI_QUERY,
  prodDbConnectionUrl: process.env.DB_MONGO_URI,
  prodDbConnectionUrlQuery: process.env.DB_MONGO_URI_QUERY,
  databaseName: process.env.DB_NAME,
  databaseUsername: process.env.DB_USER_NAME,
  databasePassword: process.env.DB_PASSWORD,
  cors: {
    origin: process.env.CORS_ORIGIN.split(","), // Split origins into an array
    credentials: process.env.CORS_CREDENTIALS === "true", // Convert string to boolean
    exposedHeaders: process.env.CORS_EXPOSED_HEADERS.split(","),
    methods: process.env.CORS_METHODS,
    preflightContinue: process.env.CORS_PREFLIGHT_CONTINUE === "true",
  },
  jwtSecret: process.env.JWT_SECRET,
  jwtLifetime: process.env.JWT_LIFE_TIME,
  jwtAlgorithm: process.env.JWT_ALGORITHM,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
  refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
  accessTokenLifetime: process.env.ACCESS_TOKEN_LIFE_TIME,
  refreshTokenLifetime: process.env.REFRESH_TOKEN_LIFE_TIME,
};

Object.freeze(config); // avoid to update any existing config

export default config;
