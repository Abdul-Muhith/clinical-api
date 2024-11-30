import { checkProfileExistsByMember } from "./utils.js";
import { allowedForProfile } from "../../config/defaults.js";

import validationUtils, {
  throwError as validateThrowError,
} from "../../utils/validation/index.js";

export { throwError as validateThrowError } from "../../utils/validation/index.js";

// Initialize an empty array to store errors
let errors = [];

// ### -> Throw an error
const throwError = (message = ``, hints = ``, array = []) => {
  validateThrowError(
    message || ``,
    hints || `Please, ensure all fields are correctly filled and try again`,
    array.length ? array : errors,
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

  if (str?.toLowerCase()) {
    validateThrowError(
      `Must fill up all required fields.`,
      `Please, ensure all fields are correctly filled and try again`,
      [
        {
          code: "MISSING_INPUT",
          message: `Either a member ID or a gender is required.`,
          field: str,
          location: "body",
          status: 400,
        },
      ]
    );
  }
};

// ### → Validate gender and return an error if invalid
const gender = (input) => {
  validationUtils.stringError(input, `gender`, `body`, errors);

  if (input && ["male", "female", "other"].includes(input) === false) {
    errors.push({
      code: `INVALID_GENDER`,
      message: `The gender provided is invalid.`,
      field: `gender`,
      location: `body`,
      status: 400,
    });
  }
};

// ### → Validate age and return an error if invalid
const age = (input) => {
  if (input && (!Number.isInteger(input) || input <= 11)) {
    errors.push({
      code: `INVALID_AGE`,
      message: `The age should be a number and greater than 11.`,
      field: `age`,
      location: `body`,
      status: 400,
    });
  }
};

// ### → Validate blood-group and return an error if invalid
const bloodGroup = (input) => {
  validationUtils.stringError(input, `bloodGroup`, `body`, errors);

  if (
    input &&
    ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(
      input.toUpperCase()
    ) === false
  ) {
    errors.push({
      code: `INVALID_BLOOD_GROUP`,
      message: `The blood group provided is invalid.`,
      field: `bloodGroup`,
      location: `body`,
      status: 400,
    });
  }
};

// ### → Validate address and return an error if invalid
const address = (input) => {
  if (input && typeof input !== "object") {
    errors.push({
      code: `INVALID_ADDRESS`,
      message: `The address provided is invalid.`,
      field: `address`,
      location: `body`,
      status: 400,
    });

    // Validate each address against their key and value
  } else if (input && typeof input === "object") {
    Object.keys(input).some((item) => {
      // Validate all keys are provided in the address
      if (!allowedForProfile.addressedFields.includes(item)) {
        errors.push({
          code: `INVALID_${item.toUpperCase()}`,
          message: `The ${item} is currently unable to address.`,
          field: `${item}`,
          location: `body`,
          status: 400,
        });
      }

      // Validate all values are provided in the address
      if (
        (item === `postalCode` && typeof input[item] !== `number`) ||
        (item !== `postalCode` && typeof input[item] !== "string")
      ) {
        errors.push({
          code: `INVALID_${item.toUpperCase()}`,
          message: `The ${item} provided in address is invalid.`,
          field: `${item}`,
          location: `body`,
          status: 400,
        });
      }
    });
  }
};

// TODO: ### → Validate photo and return an error if invalid

// Profile exists validation
const profileExists = async (member) => {
  if (member) {
    const exists = await checkProfileExistsByMember(member);

    if (exists) {
      errors.push({
        code: `MEMBER_TAKEN`,
        message: `The member is already registered to create a profile.`,
        field: `member`,
        location: `bodY`,
        status: 400,
      });
    }
  }
};

export default {
  throwError,
  objectId,
  requiredFields,
  gender,
  age,
  bloodGroup,
  address,
  profileExists,
  getErrors: () => errors,
  clearErrors: () => {
    errors = [];
  },
};
