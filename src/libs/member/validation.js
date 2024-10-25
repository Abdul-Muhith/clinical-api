import customError from "../../utils/error.js";
import memberUtils from "./utils.js";
import validationUtils from "../../utils/validation/index.js";
import authConfig from "../../config/auth.js";

// Initialize an empty array to store errors
let errors = [];

const throwError = (message, hints, array) => {
  if (errors.length > 0 || (array && array.length > 0)) {
    const error = customError.badRequest(message ?? ``, array ?? errors, hints);

    errors = []; // Reset errors to ensure it starts fresh for the next invocation.

    throw error;
  }
};

// Required fields validation
const requiredFields = (fields = {}) => {
  const missingFields = Object.entries(fields).filter(
    ([key, value]) =>
      // Check if null, undefined, empty object, empty array or empty string
      !value || Object.keys(value).length === 0 || value.trim() == ``
  );

  if (missingFields.length) {
    const names = missingFields.map(([key]) => key);

    // Format the field names with "and" for the last item
    const formattedNames =
      names.length > 1
        ? names.slice(0, -1).join(", ") + " and " + names[names.length - 1]
        : names.join("");

    errors.push({
      code: "MISSING_INPUT",
      message: `One or more input fields are required.`,
      field: formattedNames,
      location: "body",
      status: 400,
    });
  }
};

// Username validation
const username = (username) => {
  validationUtils.stringError(username, `username`, ``, errors, throwError);

  if (
    username &&
    username.trim &&
    (username.trim().length < 3 || username.trim().length > 20)
  ) {
    errors.push({
      code: `INVALID_USERNAME_LENGTH`,
      message: `The username must be between 3 and 20 characters.`,
      field: `username`,
      location: `bodY`,
      status: 400,
    });
  }
};

// Phone validation
const phone = (phone) => {
  validationUtils.stringError(phone, `phone`, ``, errors, throwError);

  const phoneRegex = /^\+8801[0-9]{9}$/; // Bangladesh phone number format

  if (phone !== undefined && phone !== null && !phoneRegex.test(phone)) {
    errors.push({
      code: `INVALID_MOBILE_FORMAT`,
      message: `The mobile number format is invalid.`,
      field: `phone`,
      location: `bodY`,
      status: 400,
    });
  }
};

// Phone exists validation
const phoneExists = async (phone) => {
  if (phone) {
    const exists = await memberUtils.checkMemberExistsByPhone(phone);

    if (exists) {
      errors.push({
        code: `PHONE_TAKEN`,
        message: `The phone number is already registered.`,
        field: `phone`,
        location: `bodY`,
        status: 400,
      });
    }
  }
};

// Email format validation
const email = (email) => {
  validationUtils.stringError(email, `email`, ``, errors, throwError);

  const emailRegex = /.+\@.+\..+/; // Basic email regex

  if (email && !emailRegex.test(email)) {
    errors.push({
      code: "INVALID_EMAIL_FORMAT",
      message: "The email format is invalid.",
      field: "email",
      location: "body",
      status: 400,
    });
  }
};

// Email exists validation
const emailExists = async (email) => {
  if (email) {
    const exists = await memberUtils.checkMemberExistsByEmail(email);

    if (exists) {
      errors.push({
        code: `EMAIL_TAKEN`,
        message: `The email address is already registered.`,
        field: `email`,
        location: `bodY`,
        status: 400,
      });
    }
  }
};

// Password validation
const password = (password) => {
  validationUtils.stringError(password, `password`, ``, errors, throwError);

  if (password && (password.length < 8 || password.length > 20)) {
    errors.push({
      code: `INVALID_PASSWORD_LENGTH`,
      message: `The password must be between 8 and 20 characters.`,
      field: `password`,
      location: `bodY`,
      status: 400,
    });
  }

  // password format regex
  const passwordPattern =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}:"<>?\[\];',.\/`~])[A-Za-z\d!@#$%^&*()_+{}:"<>?\[\];',.\/`~]+$/;

  if (password && !passwordPattern.test(password)) {
    errors.push({
      code: `INVALID_PASSWORD_FORMAT`,
      message: `The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.`,
      field: `password`,
      location: `bodY`,
      status: 400,
    });
  }
};

// Confirm password validation
const passwordMatches = (confirmPassword, password) => {
  if (confirmPassword && confirmPassword !== password) {
    errors.push({
      code: "MISMATCHED_CONFIRMATION",
      message: "The password confirmation does not match.",
      field: "confirmation_password",
      location: "body",
      status: 400,
    });
  }
};

// Role validation
const role = (role) => {
  validationUtils.stringError(role, `role`, ``, errors, throwError);

  if (
    role &&
    !authConfig.allowedRoles.find((v) => v.toLowerCase() === role.toLowerCase())
  ) {
    errors.push({
      code: `INVALID_ROLE`,
      message: `The role provided is invalid.`,
      field: `role`,
      location: `bodY`,
      status: 400,
    });
  }
};

// Account status validation
const status = (status) => {
  validationUtils.stringError(status, `status`, ``, errors, throwError);

  if (
    status &&
    !authConfig.allowedStatuses.find(
      (v) => v.toLowerCase() === status.toLowerCase()
    )
  ) {
    errors.push({
      code: `INVALID_STATUS`,
      message: `The status provided is invalid.`,
      field: `status`,
      location: `bodY`,
      status: 400,
    });
  }
};

export default {
  throwError,
  requiredFields,
  username,
  email,
  emailExists,
  phone,
  phoneExists,
  password,
  passwordMatches,
  role,
  status,
};
