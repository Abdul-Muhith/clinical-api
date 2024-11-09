import { generateQueryString } from "./index.js";

/**
 * This function will generate HATEOAS links for pagination and related resources. The links are dynamically generated based on the given parameters.
 *
 * @param {Object} params - The parameters to generate HATEOAS links.
 * @param {string} [params.path=''] - The base URL path (without query parameters).
 * @param {string} [params.url='/'] - The full URL of the current request, including query parameters.
 * @param {Object} [params.query={}] - The current query parameters, which will be included in the `nextPage` and `prevPage` links.
 * @param {boolean} [params.hasNext=false] - Flag indicating if there is a next page.
 * @param {boolean} [params.hasPrev=false] - Flag indicating if there is a previous page.
 * @param {number} [params.page=1] - The current page number.
 *
 * @returns {Object} - The object containing the following links:
 * - `self`: The current page's URL
 * - `nextPage`: The URL for the next page, if applicable
 * - `prevPage`: The URL for the previous page, if applicable
 */

const getHATEOAS = (
  path = ``,
  url = `/`,
  query = {},
  hasNext = false,
  hasPrev = false,
  page = 1
) => {
  const links = { self: url };

  if (hasNext) {
    const getQuery = generateQueryString({ ...query, page: page + 1 });
    links.nextPage = `${path}?${getQuery}`;
  }

  if (hasPrev) {
    const getQuery = generateQueryString({ ...query, page: page - 1 });
    links.prevPage = `${path}?${getQuery}`;
  }

  return links;
};

export default getHATEOAS;
