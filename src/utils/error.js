import { v4 as uuidv4 } from "uuid";

/**
 * @typedef {Object} ErrorDetail
 * @property {string} message - A detailed message describing the specific error.
 * @property {string} [code] - A short code representing the type of error.
 * @property {string|null} [field] - The name of the field that caused the error (or null if not applicable).
 * @property {string} [location] - The location where the error occurred (or null if not applicable).
 * @property {number} [status] - An optional HTTP status code associated with the error.
 */

/**
 * Formats an error object with a standardized structure.
 *
 * @param {Object} param - The parameters for formatting the error.
 * @param {number} param.code - The error code (must be a three-digit number, defaults to 503).
 * @param {string} param.message - A human-readable message describing the error (defaults to a generic message).
 * @param {Array<ErrorDetail>} param.errors - An array detailing specific errors encountered in the request (defaults to a generic array).
 * @param {string} param.trace_id - A unique identifier for tracking the error (must be a valid UUID, defaults to a new trace ID).
 * @param {string} param.hints - Additional hints for troubleshooting (defaults to a standard hint).
 *
 * @returns {Object} The formatted error object.
 *
 * @throws {Error} Throws an error if any parameter has an invalid type.
 */
const format = ({ code, message, errors, trace_id, hints }) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  // ### → Validate code parameter
  if (!code && typeof code !== "number") {
    if (!Number.isInteger(code) || code < 100 || code > 999) {
      throw new Error("The code must be a three-digit number.");
    }
  }

  // ### → Validate message parameter
  if (!message && typeof message !== "string") {
    throw new Error("The message provided is invalid.");
  }

  // ### → Validate errors parameter
  if (!errors && !Array.isArray(errors)) {
    // Check if each element in the errors array is an object
    for (const error of errors) {
      if (error && typeof error !== "object") {
        throw new Error(
          "The errors should be an array containing at least one object."
        );
      }
    }
  }

  // ### → Validate trace ID parameter
  if (!trace_id && typeof trace_id !== "string") {
    // Check if it is an UUID format
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(trace_id)) {
      throw new Error("The trace_id must be a valid UUID.");
    }
  }

  // ### → Validate hints parameter
  if (!hints && typeof hints !== "string") {
    throw new Error("The hints provided is invalid.");
  }

  // ### → Construct the error object
  const error = {
    code: code ?? 503,
    message: message ?? "Service is unavailable.",
    errors: errors ?? [
      {
        code: "SERVICE_UNAVAILABLE",
        message: "The service is currently (2024-10-12T12:34:56Z) unavailable.",
        field: null,
        location: "server",
        status: 503,
      },
    ],
    trace_id: trace_id ?? traceId,
    hints: hints
      ? `${hints}. If you continue to have issues, please reach out to our support team by providing your trace ID.`
      : "We are sorry for the inconvenience. The service is temporarily down for maintenance. Please try again shortly by creating a support ticket with the trace ID for further assistance or feel free to contact our technical support directly by including your trace ID in the support ticket.",
  };

  return error;
};

const unAuthenticatedError = (message, errors, hints) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  return format({
    code: 401,
    message:
      message && message.trim() !== ``
        ? message
        : `UNAUTHORIZED! to continue, Please log in to your account using your credentials`,
    errors: errors ?? [
      {
        code: `MISSING_TOKEN`,
        message: `The authentication token is required.`,
        field: `access_token`,
        location: `header`,
        status: 401,
      },
    ],
    hints:
      hints ??
      `Please, send the access token in the header as a Bearer Token and try again.`,
    trace_id: traceId,
  });
};

const forbiddenError = (message, errors, hints) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  return format({
    code: 403,
    message:
      message && message.trim() !== ``
        ? message
        : `You do not have the required permissions to perform this action.`,
    errors: errors ?? [
      {
        code: `FORBIDDEN`,
        message: `The authorization token is required.`,
        field: `access_token`,
        location: `header`,
        status: 403,
      },
    ],
    hints:
      hints ??
      `Please, send the access token in the header as a Bearer Token and try again.`,
    trace_id: traceId,
  });
};

const badRequest = (message, errors, hints) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  return format({
    code: 400,
    message: message && message.trim() !== `` ? message : `Invalid credentials`,
    errors: errors ?? [
      {
        code: `BAD_REQUEST`,
        message: `One or more input fields are invalid.`,
        field: null,
        location: null,
        status: 400,
      },
    ],
    hints:
      hints ?? `Please, ensure all fields are correctly filled and try again.`,
    trace_id: traceId,
  });
};

const notFound = (message, errors, hints) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  return format({
    code: 404,
    message:
      message && message.trim() !== ``
        ? message
        : `No data found based on the provided credentials.`,
    errors: errors ?? [
      {
        code: `NOT_FOUND`,
        message: `The item you are looking for could not be found.`,
        field: null,
        location: null,
        status: 404,
      },
    ],
    hints: hints ?? `Please, verify the requested resource and try again.`,
    trace_id: traceId,
  });
};

const serverError = (message, errors, hints) => {
  const traceId = uuidv4(); // Generate a unique trace_id for every error

  return format({
    code: 500,
    message:
      message && message.trim() !== `` ? message : `Internal Server Error`,
    errors: errors ?? [
      {
        code: `SERVER_ERROR`,
        message: `An unexpected error occurred on the server.`,
        field: `none`,
        location: `server`,
        status: 500,
      },
    ],
    hints:
      hints ?? `We are sorry for the inconvenience. Please try again later`,
    trace_id: traceId,
  });
};

export default {
  format,
  unAuthenticatedError,
  forbiddenError,
  badRequest,
  notFound,
  serverError,
};
