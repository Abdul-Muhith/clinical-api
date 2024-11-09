import defaultConfig from "../../config/defaults.js";

/**
 * This function will generate pagination details based on provided total items, page size and current page.
 *
 * @param {number} totalItems - The total number of items to paginate through.
 * @param {number} size - The number of items per page (page size).
 * @param {number} page - The current page number.
 *
 * @returns {Object} - An object containing pagination details:
 *   - `page`: The current page number.
 *   - `size`: The number of items per page (page size).
 *   - `totalPages`: The total number of pages based on the `totalItems` and `size`.
 *   - `totalItems`: The total number of items in the dataset.
 *   - `next`: The next page number if it exists (only present if there is a next page).
 *   - `prev`: The previous page number if it exists (only present if there is a previous page).
 */

const getPagination = (
  totalItems = defaultConfig.totalItems || 0,
  size = defaultConfig.size || 25,
  page = defaultConfig.page || 1
) => {
  const pagination = { page, size };

  const totalPages = totalItems === 0 ? 1 : Math.ceil(totalItems / size);

  if (page < totalPages) {
    pagination.next = page + 1;
  }

  if (page > 1) {
    pagination.prev = page - 1;
  }

  pagination.totalPages = totalPages;
  pagination.totalItems = totalItems;

  return pagination;
};

export default getPagination;
