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
    });

    // If there are errors, throw the errors
    if (cb) cb();
  }
};

export default { stringError };
