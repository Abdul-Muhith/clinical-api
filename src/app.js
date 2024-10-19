import express from "express";

import { globalError, notFoundHandler } from "./middlewares/globalError.js";
import applyMiddleware from "./middlewares/applyMiddleware.js";
import routes from "./routes/index.js";

const app = express();

// → → → Apply middleware configurations here → → →
applyMiddleware(app);

// → → → Set up application routes here → → →
app.use(routes);

// → → → Handle 404 NOT FOUND errors for any route → → →
app.use(notFoundHandler);

// → → → Register global error handling middleware → → →
app.use(globalError);

export default app;
