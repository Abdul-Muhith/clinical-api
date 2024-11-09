import { parse, isValid } from "date-fns";

import validationUtils, {
  throwError as validateThrowError,
} from "../../utils/validation/index.js";

import { format } from "../../utils/index.js";

export { throwError as validateThrowError } from "../../utils/validation/index.js";

// Initialize an empty array to store errors
let errors = [];

// ### -> Throw an error
const throwError = (message = ``, hints = ``, array = []) => {
  validateThrowError(
    message || ``,
    hints || `Please, ensure all fields are correctly filled and try again`,
    array ?? errors,
    () => (errors = []) // Clear errors for the next validation
  );

  // TODO: remove this later
  // validateThrowError(
  //   ``,
  //   `Please, ensure all fields are correctly filled and try again`,
  //   doctorValidate.getErrors(),
  //   doctorValidate.clearErrors // Clear errors for the next validation
  // );
};

// ### → Validate an ObjectId and throw an error if invalid
const objectId = (id, field = ``, location, message) => {
  const result = validationUtils.isObjectId(id, field, location);

  // If there are errors, throw the errors
  if (result) {
    validateThrowError(
      message,
      `Please, ensure all fields are correctly filled and try again.`,
      [result]
    );
  }
};

// ### → Validate required fields and return an error if invalid
const requiredFields = (fields = {}) => {
  const str = validationUtils.haveRequiredFields(fields);

  if (str?.toLowerCase().includes(`and`)) {
    validateThrowError(
      `Must fill up all required fields.`,
      `Please, ensure all fields are correctly filled and try again`,
      [
        {
          code: "MISSING_INPUT",
          message: `Either a member ID or an email address is required.`,
          field: `member or email`,
          location: "body",
          status: 400,
        },
      ]
    );
  }
};

// ### → Validate specialty and return an error if invalid
const specialty = (input) => {
  if (
    input &&
    (!Array.isArray(input) || !input.every((item) => typeof item === "string"))
  ) {
    errors.push({
      code: `INVALID_SPECIALTY`,
      message: `The specialty must be a list of characters.`,
      field: `specialty`,
      location: `body`,
      status: 400,
    });
  }
};

// ### → Validate conditions and return an error if invalid
const conditions = (input) => {
  if (
    input &&
    (!Array.isArray(input) || !input.every((item) => typeof item === "string"))
  ) {
    errors.push({
      code: `INVALID_CONDITIONS`,
      message: `The conditions should be a list of characters.`,
      field: `conditions`,
      location: `body`,
      status: 400,
    });
  }
};

// ### → Validate availability and return an error if invalid
const availability = (input) => {
  if (
    input &&
    (!Array.isArray(input) || !input.every((item) => typeof item === "object"))
  ) {
    errors.push({
      code: `INVALID_AVAILABILITY`,
      message: `The availability should be a list of objects.`,
      field: `availability`,
      location: `body`,
      status: 400,
    });
  } else if (
    input &&
    Array.isArray(input) &&
    input.every((item) => typeof item === "object")
  ) {
    input.every((item) => {
      // Validate all required keys are present in availability
      if ([`day`, `startTime`, `endTime`].every((v) => v in item) === false) {
        errors.push({
          code: "INVALID_AVAILABILITY",
          message: "One or more availability fields are required.",
          field: "day, startTime or endTime",
          location: "body",
          status: 400,
        });
      }

      // Validate day in availability
      if (
        item.day &&
        [
          `saturday`,
          `sunday`,
          `monday`,
          `tuesday`,
          `wednesday`,
          `thursday`,
          `friday`,
        ].includes(item.day?.toLowerCase()) === false
      ) {
        errors.push({
          code: `INVALID_AVAILABILITY_DAY`,
          message: `The day provided in availability is invalid.`,
          field: `day`,
          location: `body`,
          status: 400,
        });
      }

      // Validate start Time and end Time in availability
      if (
        isValid(parse(item.startTime, `hh:mm a`, new Date())) === false ||
        isValid(parse(item.endTime, `hh:mm a`, new Date())) === false
      ) {
        errors.push({
          code: `INVALID_AVAILABILITY_TIME`,
          message: `Either a start time or an end time is invalid.`,
          field: `startTime or endTime`,
          location: `body`,
          status: 400,
        });
      }
    });
  }
};

// ### → Validate select query parameter and return an error if invalid
const selectParameter = (selects = [], allowedFields = []) => {
  if (
    selects &&
    (!Array.isArray(selects) ||
      !selects.every((item) => typeof item === "string"))
  ) {
    errors.push({
      code: `INVALID_DOCTOR_SELECTION`,
      message: `The selection should be a list of strings.`,
      field: `doctor_selection`,
      location: `query`,
      status: 400,
    });
  } else if (
    selects &&
    Array.isArray(selects) &&
    selects.every((item) => typeof item === "string")
  ) {
    const invalidFields = selects.filter(
      (select) => !allowedFields.includes(select)
    );

    const uniqueFields = [...new Set(invalidFields)]; // Remove duplicates from invalid fields

    if (invalidFields.length > 0) {
      errors.push({
        code: "INVALID_DOCTOR_SELECTION",
        message: "One or more selection fields are invalid.",
        field: format.fieldNames(uniqueFields),
        location: "query",
        status: 400,
      });
    }
  }
};

export default {
  throwError,
  objectId,
  requiredFields,
  specialty,
  conditions,
  availability,
  selectParameter,
  getErrors: () => errors,
  clearErrors: () => {
    errors = [];
  },
};
