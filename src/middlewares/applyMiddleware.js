import YAML from "yamljs";
import swaggerUI from "swagger-ui-express";
import OpenApiValidator from "express-openapi-validator";

import presetMiddleware from "./presetMiddleware.js";

// → → → Parsed YAML data for the swagger documentation → → →
const swaggerDoc = YAML.load("./swagger.yaml");

const applyMiddleware = (app) => {
  app.use(presetMiddleware);

  // → → → Swagger documentation serving at /docs/v1 → → →
  app.use("/docs/v1", swaggerUI.serve, swaggerUI.setup(swaggerDoc));

  // → → → Error handling using the Express Open API Validator → → →
  app.use(OpenApiValidator.middleware({ apiSpec: "./swagger.yaml" }));
};

export default applyMiddleware;
