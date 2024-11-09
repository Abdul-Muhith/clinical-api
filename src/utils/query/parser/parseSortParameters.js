import queryValidate from "../../validation/query.js";
import { format } from "../../index.js";

/**
 * Parses and validates sort parameters into a structured format.
 *
 * @param {string} sort - A comma-separated list of fields to sort by, with optional order prefixes.
 * @param {string} sortBy - The field by which to sort.
 * @param {string} sortOrder - The sort order, either `ascending` or `descending`.
 * @param {string[]} allowedFields - An array of strings that are allowed for sorting.
 * @returns {string} - An object representing the parsed and validated sort parameters:
 *                     - singleSortCriteria: A formatted string for single sorting.
 *                     - singleSortCriteriaForDB: An object for single sort criteria for the database.
 *                     - multipleSortCriteriaForDB: An object for multiple sort criteria for the database.
 * @throws {Error} - Throws an error if the parameters are invalid or if the field is not allowed.
 */

const parseSortParameters = (
  sort = ``,
  sortBy = `updatedAt`,
  sortOrder = `ascending`,
  allowedFields = []
) => {
  // ### → -> -> Validate sorting parameters <- <- <-
  queryValidate.sort(sort, allowedFields);
  queryValidate.sortBy(sortBy, allowedFields);
  queryValidate.sortOrder(sortOrder);
  queryValidate.throwError(`Invalid sorting credentials`);

  // ### → -> -> Initialize an object to hold multiple sorting criteria with the sort fields <- <- <-
  const sortCriteria = {};

  if (sort !== ``) {
    const sortPartsArray = sort.split(",");

    for (const sortPart of sortPartsArray) {
      const sortParts = sortPart.split(`-`);

      if (sortParts.length === 2) {
        const [_sortOrder, sortBy] = sortParts;

        sortCriteria[sortBy] = -1;
      } else {
        sortCriteria[sortParts] = 1; // Sort to ascending order if no prefix indicated
      }
    }
  }

  return {
    singleSortCriteria: `${format.sortOrder(sortOrder)}${sortBy}`,
    singleSortCriteriaForDB: { [sortBy]: format.sortOrderForDB(sortOrder) },
    multipleSortCriteriaForDB: sortCriteria,
  };
};

export default parseSortParameters;
