import memberValidate from "../../libs/member/validation.js";

// String validation
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

// ### → Check if the provided ID is a valid format for ObjectId if using MongoDB
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

export default { stringError, objectIdError };
