import queryValidate from "../validation/query.js";

const generateFilterCriteria = (
  filter = ``,
  searchCriteria = ``,
  searchTerm = ``,
  searchKey = ``,
  allowedFilterFields = [],
  allowedSearchFields = []
) => {
  // ### → -> -> Validate filtering parameters <- <- <-
  queryValidate.filter(filter, allowedFilterFields);
  queryValidate.throwError(`Invalid filtering credentials`);

  queryValidate.search(searchCriteria, allowedSearchFields);
  queryValidate.searchTerm(searchTerm, searchKey, allowedSearchFields);
  queryValidate.throwError(`Invalid searching credentials`);

  // ### → -> -> Initialize an object to hold various filters <- <- <-
  let filterCriteria = {};

  // Filter the results based on targeted criteria
  if (filter !== ``) {
    filter.split(`,`).filter((item) => {
      const [key, value] = item.split(`:`);

      filterCriteria = {
        ...filterCriteria,
        [key]: { $regex: value, $options: "i" }, // Case-insensitive
      };
    });
  }

  // Filter the results based on field-specific searching criteria
  if (searchCriteria !== ``) {
    const [key, value] = searchCriteria.split(`:`);

    // Check for various filtering
    if (Object.keys(filterCriteria).includes(key)) {
      queryValidate.throwError(
        `It's filtering and searching with a single key`,
        ``,
        [
          {
            code: `VARIOUS_FILTERING`,
            message: `There are both filtering and searching at a time, using a single key.`,
            field: key,
            location: "query",
            status: 400,
          },
        ]
      );
    }

    filterCriteria = {
      ...filterCriteria,
      [key]: { $regex: value, $options: "i" }, // Case-insensitive
    };
  }

  // Filter the results based on free-text searching criteria
  if (searchTerm !== ``) {
    // Check for duplicate searching keys
    if (Object.keys(filterCriteria).includes(searchKey)) {
      queryValidate.throwError(`Duplicate searching credentials`, ``, [
        {
          code: `DUPLICATE_SEARCHING`,
          message: `There are duplicate searching at a time, using a single key.`,
          field: searchKey,
          location: "query",
          status: 400,
        },
      ]);
    }

    filterCriteria = {
      ...filterCriteria,
      [searchKey]: { $regex: searchTerm, $options: "i" }, // Case-insensitive
    };
  }

  return filterCriteria;
};

export default generateFilterCriteria;
