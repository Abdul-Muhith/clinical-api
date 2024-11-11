import { customError, format } from "../index.js";

// Initialize an empty array to store errors
let errors = [];

const throwError = (message, hints, array) => {
  if (errors.length > 0 || (array && array.length > 0)) {
    const error = customError.badRequest(message ?? ``, array ?? errors, hints);

    errors = []; // Reset errors to ensure it starts fresh for the next invocation.

    throw error;
  }
};

// ### → -> -> Validate sort parameter <- <- <-
const sort = (sort = ``, allowedFields = []) => {
  if (typeof sort !== `string`) {
    errors.push({
      code: `INVALID_SORT`,
      message: `The sort query parameter values must be strings.`,
      field: `sort`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-sort-by fields
  if (sort !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    // parse to an array of strings, removing the hyphens
    const sortFieldsArray = sort
      .split(`,`)
      .map((item) => item.replace("-", ""));

    // Check for duplicates
    const seen = new Set();
    const isFieldDuplicates = sortFieldsArray.filter((item) => {
      if (seen.has(item)) {
        return true;
      }

      seen.add(item);
      return false;
    });

    if (isFieldDuplicates.length > 0) {
      errors.push({
        code: `DUPLICATE_SORT`,
        message: `There are duplicate sorting fields.`,
        field: format.fieldNames(isFieldDuplicates),
        location: "query",
        status: 400,
      });
    }

    // Check for invalid sorting fields
    const invalidFields = sortFieldsArray.filter(
      (item) => !allowedFields.includes(item)
    );

    const uniqueFields = [...new Set(invalidFields)]; // Remove duplicates from invalid fields

    if (invalidFields.length > 0) {
      errors.push({
        code: `INVALID_SORT_BY`,
        message: `The sort-by parameter is currently unable to sort.`,
        field: format.fieldNames(uniqueFields),
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate sort-by parameter <- <- <-
const sortBy = (sortBy = ``, allowedFields = []) => {
  if (typeof sortBy !== `string`) {
    errors.push({
      code: `INVALID_SORT_BY`,
      message: `The sort-by query parameter values must be strings.`,
      field: `sortBy`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-sort-by parameter
  if (allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    // Check for invalid fields
    if (!allowedFields.includes(sortBy)) {
      errors.push({
        code: `INVALID_SORT_BY`,
        message: `The sort-by parameter is currently unable to sort.`,
        field: sortBy,
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate sort-order parameter <- <- <-
const sortOrder = (sortOrder = ``) => {
  if (typeof sortOrder !== `string`) {
    errors.push({
      code: `INVALID_SORT_ORDER`,
      message: `The sort-order query parameter values must be strings.`,
      field: `sortOrder`,
      location: "query",
      status: 400,
    });
  }

  if (![`ascending`, `descending`].includes(sortOrder.toLowerCase())) {
    errors.push({
      code: `INVALID_SORT_ORDER`,
      message: `The sort-order must be either ascending or descending.`,
      field: `sortOrder`,
      location: "query",
      status: 400,
    });
  }
};

// ### → -> -> Validate filter parameter <- <- <-
const filter = (filter = ``, allowedFields = []) => {
  if (typeof filter !== `string`) {
    errors.push({
      code: `INVALID_FILTER`,
      message: `The filter query parameter values must be strings.`,
      field: `filter`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-filter fields
  if (filter !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    const filterFieldsArray = filter.split(`,`); // parse to an array of strings

    // Check for key-value pairs
    const keyValuePairs = filterFieldsArray.filter((item) => {
      const [key, value] = item.split(`:`);

      return !key || !value;
    });

    if (keyValuePairs.length > 0) {
      errors.push({
        code: `INVALID_KEY_PAIR`,
        message: `Each filter parameter must be a key-value pair.`,
        field: format.fieldNames(keyValuePairs),
        location: "query",
        status: 400,
      });
    }

    // Check for duplicate keys
    const seen = new Set();

    const duplicateKeys = filterFieldsArray.filter(([key]) => {
      if (seen.has(key)) {
        return true;
      }

      seen.add(key);
      return false;
    });

    if (duplicateKeys.length > 0) {
      errors.push({
        code: `DUPLICATE_FILTER`,
        message: `There are duplicate filtering keys.`,
        field: format.fieldNames(duplicateKeys),
        location: "query",
        status: 400,
      });
    }

    // Check for invalid filter keys
    const invalidFields = filterFieldsArray.reduce((acc, item) => {
      const [key] = item.split(`:`);

      if (!keyValuePairs.includes(key) && !allowedFields.includes(key)) {
        acc.push(key);
      }

      return acc;
    }, []);

    const uniqueFields = [...new Set(invalidFields)]; // Remove duplicates from invalid fields

    if (invalidFields.length > 0) {
      errors.push({
        code: `INVALID_FILTER`,
        message: `One or more fields are currently unable to filter.`,
        field: format.fieldNames(uniqueFields),
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate search parameter <- <- <-
const search = (search = ``, allowedFields = []) => {
  if (typeof search !== `string`) {
    errors.push({
      code: `INVALID_SEARCH`,
      message: `The search query parameter values must be strings.`,
      field: `search`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-search fields
  if (search !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    // Check for key-value pairs
    const [key, value] = search.split(`:`);

    if (!key || !value) {
      errors.push({
        code: `INVALID_KEY_PAIR`,
        message: `The search parameter must be a key-value pair.`,
        field: search,
        location: "query",
        status: 400,
      });
    }

    // Check for various keys
    const searchFieldsArray = search.split(","); // parse to an array of strings

    const variousKeys = searchFieldsArray.reduce((acc, item) => {
      const [key] = item.split(":");

      if (!acc.includes(key)) {
        acc.push(key);
      }

      return acc;
    }, []);

    if (variousKeys.length > 1) {
      errors.push({
        code: `VARIOUS_SEARCHING_KEYS`,
        message: `There are various searching keys.`,
        field: format.fieldNames(variousKeys),
        location: "query",
        status: 400,
      });
    }

    // Check for invalid searching keys
    const invalidFields = variousKeys.filter(
      (item) => !allowedFields.includes(item)
    );

    if (invalidFields.length > 0) {
      errors.push({
        code: `INVALID_SEARCH_KEY`,
        message: `The provided parameter is currently unable to search.`,
        field: format.fieldNames(invalidFields),
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate search parameter <- <- <-
const searchTerm = (searchTerm = ``, searchKey = ``, allowedFields = []) => {
  if (typeof searchTerm !== `string`) {
    errors.push({
      code: `INVALID_SEARCH_TERM`,
      message: `The search-term query parameter values must be strings.`,
      field: searchTerm,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-search fields
  if (searchTerm !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    // Check for invalid search keys
    if (!allowedFields.includes(searchKey)) {
      errors.push({
        code: `INVALID_SEARCH_KEY`,
        message: `This is currently unable to search.`,
        field: searchKey,
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate expand parameter <- <- <-
const expand = (expand = ``, allowedFields = []) => {
  if (typeof expand !== `string`) {
    errors.push({
      code: `INVALID_EXPAND`,
      message: `The expand query parameter values must be strings.`,
      field: `expand`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-expand-by fields
  if (expand !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    const expandFieldsArray = expand.split(`,`); // parse to an array of strings

    // Check for duplicates
    const seen = new Set();

    const isFieldDuplicates = expandFieldsArray.filter((item) => {
      const [path, select] = item.split(".");

      if (path && select) {
        if (seen.has(path)) {
          return true;
        }

        seen.add(path);
        return false;
      } else {
        // TODO: Check if duplicate expanding in each object
      }
    });

    if (isFieldDuplicates.length > 0) {
      errors.push({
        code: `DUPLICATE_EXPAND`,
        message: `There are duplicate expanding fields.`,
        field: format.fieldNames(isFieldDuplicates),
        location: "query",
        status: 400,
      });
    }

    // Check for invalid expanding fields
    const invalidFields = expandFieldsArray.filter(
      (item) => !allowedFields.includes(item)
    );

    const uniqueFields = [...new Set(invalidFields)]; // Remove duplicates from invalid fields

    if (invalidFields.length > 0) {
      errors.push({
        code: `INVALID_EXPAND`,
        message: `The provided parameter is currently unable to expand.`,
        field: format.fieldNames(uniqueFields),
        location: "query",
        status: 400,
      });
    }
  }
};

// ### → -> -> Validate select parameter <- <- <-
const select = (select = ``, allowedFields = []) => {
  if (typeof select !== `string`) {
    errors.push({
      code: `INVALID_SELECT`,
      message: `The select query parameter values must be strings.`,
      field: `select`,
      location: "query",
      status: 400,
    });
  }

  // Validate the provided allowed-select-by fields
  if (select !== `` && allowedFields.length > 0) {
    if (
      !Array.isArray(allowedFields) ||
      !allowedFields.every((field) => typeof field === "string")
    ) {
      errors.push({
        code: `INVALID_ALLOWED_FIELD`,
        message: `Allowed-fields must be an array of strings.`,
        field: null,
        location: null,
        status: 400,
      });
    }

    const selectFieldsArray = select.split(`,`); // parse to an array of strings

    // Check for duplicates
    const seen = new Set();

    const isFieldDuplicates = selectFieldsArray.filter((item) => {
      if (seen.has(item)) {
        return true;
      }
      seen.add(item);
      return false;
    });

    if (isFieldDuplicates.length > 0) {
      errors.push({
        code: `DUPLICATE_SELECT`,
        message: `There are duplicate selecting fields.`,
        field: format.fieldNames(isFieldDuplicates),
        location: "query",
        status: 400,
      });
    }

    // Check for invalid selecting fields
    const invalidFields = selectFieldsArray.filter(
      (item) => !allowedFields.includes(item)
    );

    const uniqueFields = [...new Set(invalidFields)]; // Remove duplicates from invalid fields

    if (invalidFields.length > 0) {
      errors.push({
        code: `INVALID_SELECT`,
        message: `The provided parameter is currently unable to select.`,
        field: format.fieldNames(uniqueFields),
        location: "query",
        status: 400,
      });
    }
  }
};

export default {
  throwError,
  sort,
  sortBy,
  sortOrder,
  filter,
  search,
  searchTerm,
  expand,
  select,
  getErrors: () => errors,
  clearErrors: () => {
    errors = [];
  },
};
