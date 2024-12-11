import defaultConfig, {
  allowedForMember,
} from "../../../../config/defaults.js";

import { findAll } from "../../../../libs/member/index.js";

import {
  getTransformedItems,
  getPagination,
  getHATEOAS,
} from "../../../../utils/index.js";

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
  // ### → -> -> Validate query parameters and set default values <- <- <-
  let page = +req.query.page || defaultConfig.page;
  let size = +req.query.size || defaultConfig.size;
  let sort = req.query.sort || defaultConfig.sort;
  let sortBy = req.query.sort_by || defaultConfig.sortBy;
  let sortOrder = req.query.sort_order || defaultConfig.sortOrder;
  let filter = req.query.filter || defaultConfig.filter;
  let search = req.query.search || defaultConfig.search;
  let searchTerm = req.query.search_term || defaultConfig.searchTerm;
  let expand = req.query.expand || defaultConfig.expand;
  let select = req.query.select || defaultConfig.select;

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
      searchTerm,
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

    const data = getTransformedItems(
      members,
      allowedForMember.fieldsToResponse, // Array to generate a serial sequence, field by field
      getUrl.split("?")[0]
    );

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
