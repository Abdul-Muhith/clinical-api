import defaultConfig from "../../../../config/defaults.js";

import { findAll } from "../../../../libs/member/index.js";

import { getTransformedItems } from "../../../../utils/index.js";

import { getPagination, getHATEOAS } from "../../../../utils/query/index.js";

/**
 * This function extracts query parameters from the request, invokes a service to retrieve a list of members, and then generates and returns a structured response with the list of members, pagination, and HATEOAS links.
 *
 * @param {Object} req - The request object containing query parameters for pagination, sorting, filtering, etc.
 * @param {Object} res - The response object used to send the final response.
 * @param {Function} next - The next middleware function to handle errors.
 *
 * @returns {Object} A JSON response containing the status, message, transformed member data, pagination metadata and HATEOAS links.
 *
 * @throws {Error} If an error occurs while fetching members or processing the response, it will be passed to the `next` middleware.
 */

const findAllMembers = async (req, res, next) => {
  // ### → -> -> Validate query parameters <- <- <-
  let {
    page,
    size,
    sort,
    sortBy,
    sortOrder,
    filter,
    search,
    search_term,
    expand,
    select,
  } = req.query;

  // Set default values for query parameters
  page = +req.query.page || defaultConfig.page;
  size = +req.query.size || defaultConfig.size;
  sort = req.query.sort || defaultConfig.sort;
  sortBy = req.query.sort_by || defaultConfig.sortBy;
  sortOrder = req.query.sort_order || defaultConfig.sortOrder;
  filter = req.query.filter || defaultConfig.filter;
  search = req.query.search || defaultConfig.search;
  search_term = req.query.search_term || defaultConfig.searchTerm;
  expand = req.query.expand || defaultConfig.expand;
  select = req.query.select || defaultConfig.select;

  try {
    // ### → -> -> Invoke the service function to fetch all members <- <- <-
    const { members, totalItems } = await findAll({
      page,
      size,
      sort,
      sortBy,
      sortOrder,
      filter,
      search,
      search_term,
      expand,
      select,
    });

    // ### → -> -> Generate necessary responses <- <- <-
    const pagination = getPagination(totalItems, size, page);

    const getUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    const links = getHATEOAS(
      getUrl.split("?")[0],
      getUrl,
      req.query,
      !!pagination.next,
      !!pagination.prev,
      page
    );

    const data = getTransformedItems(members, getUrl.split("?")[0], [
      "id",
      "username",
      "phone",
      "email",
      "traceId",
      "specialty",
      "conditions",
      "availability",
      "role",
      "status",
      "createdAt",
      "updatedAt",
    ]); // Array to generate a serial sequence, field by field

    const responses = {
      code: 200,
      message: "A list of members has been retrieved successfully",
      data: data ?? null,
      meta: {
        pagination,
        links: {
          ...links,
          administrators: getUrl
            .split("?")[0]
            .replace(`members/local`, `administrators`),
          doctors: getUrl.split("?")[0].replace(`members`, `doctors`),
          nurses: getUrl.split("?")[0].replace(`members`, `nurses`),
          users: getUrl.split("?")[0].replace(`members`, `users`),
        },
      },
    };

    res.status(200).json(responses);
  } catch (error) {
    next(error);
  }
};

export default findAllMembers;
