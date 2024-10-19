import { v4 as uuidv4 } from "uuid";

import customError from "../utils/error.js";

/**
 * GLOBAL ERROR HANDLER middleware for Express applications.
 *
 * This function handles errors that occur in the application,
 * formats them into a standardized response structure.
 *
 * @param {Object} err - The error object thrown in the application.
 * @param {Object} _req - The Express request object (not used in this handler).
 * @param {Object} res - The Express response object used to send the response.
 * @param {Function} _next - The next middleware function in the stack (not used).
 *
 * @returns {void} Sends a JSON response with the formatted error details.
 */
export const globalError = (err, _req, res, _next) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  const error = {
    code: err.code ?? 500,
    message: err.message ?? `Internal Server Error`,
    errors: err.errors ?? [
      {
        code: `SERVER_ERROR`,
        message: `An unexpected error occurred on the server.`,
        field: `none`,
        location: `server`,
        status: 500,
      },
    ],
    hints:
      err.hints ?? `We are sorry for the inconvenience. Please try again later`,
    trace_id: traceId,
  };

  res.status(err.code ?? 500).json(error);
};

/**
 * 404 NOT FOUND ERROR HANDLER middleware for Express applications.
 *
 * This function handles errors specifically related to routes that
 * cannot be found (HTTP status 404) and formats the error into a
 * standardized response.
 *
 * @param {Object} err - The error object thrown in the application.
 * @param {Object} req - The Express request object containing request details.
 * @param {Object} _res - The Express response object (not used in this handler).
 * @param {Function} next - The next middleware function in the stack to pass the error.
 *
 * @returns {void} Passes the formatted error object to the next middleware.
 */
export const notFoundHandler = (err, req, _res, next) => {
  // Check for route-related errors (404) from OpenApiValidator
  if (err.status === 404) {
    const traceId = uuidv4(); // Generate a unique trace_id for every error

    const result = customError.format({
      code: err.status ?? 404,
      message: `The requested resource could not be found at the specified path ${
        req && req.originalUrl
      }`,
      errors: [
        {
          code: `PAGE_NOT_FOUND`,
          message: `The page you are looking for could not be found.`,
          field: "path",
          location: `${req ? req.originalUrl : "none"}`,
          status: err.status ?? 404,
        },
      ],
      hints: `Please, verify the requested resource and try again`,
      trace_id: traceId,
    });

    next(result);
  } else {
    next(err); // Pass the error to the next middleware if it's not a route-related error
  }
};
