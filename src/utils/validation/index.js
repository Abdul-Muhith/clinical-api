import customError from "../error.js";
import memberValidate from "../../libs/member/validation.js";

export const throwError = (message = ``, hints = ``, errors = [], cb) => {
  if (errors && errors.length > 0) {
    const error = customError.badRequest(message, errors, hints);

    // Reset errors to ensure it starts fresh for the next invocation.
    if (cb) {
      cb();
    }

    throw error;
  }
};

// Validate string
const stringError = (str, field = ``, location = ``, array = [], cb) => {
  if (
    str &&
    (str == "" || typeof str !== "string" || (str.trim && str.trim() === ""))
  ) {
    array.push({
      code: `INVALID_${field.toUpperCase()}`,
      message: `The ${field.toLowerCase()} provided is invalid.`,
      field: !field ? null : field.toLowerCase(),
      location:
        typeof location !== "string" && location !== ``
          ? location.toLowerCase()
          : `body`,
      status: 400,
    });

    // If there are errors, throw the errors
    if (cb) cb();
  }
};

// ### → Validate the provided ID format for ObjectId if using MongoDB and throw an error
const objectIdError = (id, field = ``) => {
  if (
    id &&
    (id == "" ||
      typeof id !== "string" ||
      (typeof id === "string" && !/^[0-9a-fA-F]{24}$/.test(id)))
  ) {
    let errors = [];

    errors.push({
      code: `INVALID_ID`,
      message: `The ${field ?? `ID`} provided is invalid.`,
      field: !field ? null : field.toLowerCase(),
      location: "query",
      status: 400,
    });

    // If there are errors, throw the errors
    if (errors.length > 0) {
      memberValidate.throwError(
        `Invalid query parameters`,
        `Please, ensure all fields are correctly filled and try again.`,
        errors
      );
    }
  }
};

// ### → Validate the provided ID format for ObjectId if using MongoDB
const isObjectId = (id, field = ``, location = ``, error) => {
  if (
    id &&
    (id == "" ||
      typeof id !== "string" ||
      (typeof id === "string" && !/^[0-9a-fA-F]{24}$/.test(id)))
  ) {
    return {
      code: `INVALID_ID`,
      message: `The ${field ?? `ID`} provided is invalid.`,
      field: !field ? null : field.toLowerCase(),
      location: location ?? "query",
      status: 400,
    };
  }
};

// ### → Validate required fields
const haveRequiredFields = (fields = {}) => {
  const missingFields = Object.entries(fields).filter(
    ([_key, value]) =>
      // Check if null, undefined, empty object, empty array or empty string
      !value || Object.keys(value).length === 0 || value.trim() == ``
  );

  if (missingFields.length) {
    const names = missingFields.map(([key]) => key);

    // Format the field names with "and" for the last item, Then return them as a string
    return names.length > 1
      ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1]
      : names.join("");
  }
};

export default {
  throwError,
  stringError,
  objectIdError,
  isObjectId,
  haveRequiredFields,
};
