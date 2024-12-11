import { MemberModel, ProfileModel } from "../../models/index.js";

import defaultConfig, { allowedForMember } from "../../config/defaults.js";

import { parse, generateFilterCriteria } from "../../utils/index.js";

import { expandRole } from "./index.js";

/**
 * This function retrieves and returns a list of all members from the database with support for sorting, filtering, searching, pagination and field expansion. It allows customization of query parameters for sorting, filtering, selecting and expanding member-related data.
 *
 * The function handles the following query parameters:
 * - **pagination**: `page`, `size` for controlling result set size and page number.
 * - **sorting**: `sort`, `sortBy`, `sortOrder` for controlling the order of the results.
 * - **filtering**: `filter`, `search`, `search_term`, and `searchKey` for filtering the results based on specific fields.
 * - **expanding**: `expand` to include additional related fields (e.g., expanding roles or relationships).
 * - **selecting**: `select` to limit the fields returned for each member.
 *
 * @param {Object} params - The query parameters to customize the member search and results.
 * @param {number} [params.page=defaultConfig.page] - The page number for pagination (default is 1).
 * @param {number} [params.size=defaultConfig.size] - The number of items per page (default is 10).
 * @param {string} [params.sort=defaultConfig.sort] - The field to sort the results by (default is 'name').
 * @param {string} [params.sortBy=defaultConfig.sortBy] - The sorting direction, either 'asc' or 'desc' (default is 'asc').
 * @param {string} [params.sortOrder=defaultConfig.sortOrder] - Sorting order, either 'ascending' or 'descending' (default is 'ascending').
 * @param {string} [params.filter=defaultConfig.filter] - Filter criteria for narrowing down results.
 * @param {string} [params.search=defaultConfig.search] - Search term for matching members' fields.
 * @param {string} [params.search_term=defaultConfig.searchTerm] - Alternative search term.
 * @param {string} [params.searchKey=defaultConfig.searchKeyForMember] - Key to search for within the member data.
 * @param {string} [params.expand=defaultConfig.expand] - Fields to expand (e.g., relationships like roles).
 * @param {string} [params.select=defaultConfig.select] - Fields to include in the result set.
 *
 * @returns {Object} The response object containing the total number of items, the filtered and transformed list of members, and pagination information.
 *   - `totalItems`: The total number of members available after applying filters.
 *   - `members`: The paginated, transformed list of members with selected fields and expanded data.
 *
 * @throws {Error} If there is an issue with fetching or processing the member data.
 */

const findAll = async ({
  page = defaultConfig.page,
  size = defaultConfig.size,
  sort = defaultConfig.sort,
  sortBy = defaultConfig.sortBy,
  sortOrder = defaultConfig.sortOrder,
  filter = defaultConfig.filter,
  search = defaultConfig.search,
  searchTerm = defaultConfig.searchTerm,
  searchKey = defaultConfig.searchKeyForMember,
  expand = defaultConfig.expand,
  select = defaultConfig.select,
}) => {
  // ### → -> -> Parse sorting parameters <- <- <-
  const {
    _singleSortCriteria: singleSortCriteria,
    singleSortCriteriaForDB,
    multipleSortCriteriaForDB,
  } = parse.sortParameters(
    sort,
    sortBy,
    sortOrder,
    allowedForMember.sortByFields
  );

  // ### → -> -> Initialize various filters for specific criteria <- <- <-
  const filterCriteria = generateFilterCriteria(
    filter,
    search,
    searchTerm,
    searchKey,
    allowedForMember.filterFields,
    allowedForMember.searchFields
  );

  // ### → -> -> Parse selecting parameters <- <- <-
  const selectCriteria = parse.selectParameter(
    select,
    allowedForMember.selectFields
  );

  const members = await MemberModel.find(filterCriteria)
    // .sort(singleSortCriteria); // A string for sorting
    .sort(
      Object.keys(multipleSortCriteriaForDB).length > 0
        ? multipleSortCriteriaForDB
        : singleSortCriteriaForDB
    ) // An object for sorting
    .select(selectCriteria);

  // ### → -> -> Retrieve profile details for each member and if found, include them in the relevant data <- <- <-
  const membersWithProfiles = await Promise.all(
    members.map(async (member) => {
      const profile = await ProfileModel.findOne({ member: member._id });

      delete profile?._doc.__v;
      delete profile?._doc._id;
      delete profile?._doc.member;
      delete profile?._doc.createdAt;
      delete profile?._doc.updatedAt;

      return {
        ...member.toObject(),
        ...profile?._doc,
      };
    })
  );

  // ### → -> -> Expand the members based on the specified expansions <- <- <-
  if (membersWithProfiles.some((member) => member) && expand) {
    // Parse expanding parameters
    const formattedExpand = parse.expandParameter(
      expand,
      allowedForMember.expandFields
    );

    const expandedCriteria =
      formattedExpand?.length > 0 &&
      (await expandRole(formattedExpand, membersWithProfiles));

    if (expandedCriteria) {
      return {
        totalItems: membersWithProfiles.length,
        members: expandedCriteria[0].slice(page * size - size, page * size), // Skip and limit to 'size' items
      };
    }
  }

  return {
    totalItems: membersWithProfiles.length,
    members: membersWithProfiles.slice(page * size - size, page * size), // Skip and limit to 'size' items
  };
};

export default findAll;
