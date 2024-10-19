/**
 * Formats an error object with standardized structure.
 *
 * @param {Object} param - The parameters for formatting the error.
 * @param {number} param.code - The error code (defaults to 503).
 * @param {string} param.message - A message describing the error (defaults to a generic message).
 * @param {Array} param.errors - An array of specific error details (defaults to an empty array).
 * @param {string} param.trace_id - A unique identifier for tracking the error (defaults to "none").
 * @param {string} param.hints - Additional hints for troubleshooting (defaults to a standard hint).
 *
 * @returns {Object} The formatted error object.
 */
const format = ({ code, message, errors, trace_id, hints }) => {
  const error = {
    code: code ?? 503,
    message: message ?? toString(),
    errors: errors ?? [],
    trace_id: trace_id ?? "none",
    hints: hints
      ? `${hints}. If you continue to have issues, please reach out to our support team by providing your trace ID.`
      : `Please, create a support ticket with the trace ID for further assistance or feel free to contact our technical support directly by including your trace ID in the support ticket`,
  };

  return error;
};

export default {
  format,
};
