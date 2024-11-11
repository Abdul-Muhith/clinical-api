/**
 * This function transforms an array of items by selecting specific fields and adding a `link` property for each item.
 *
 * @param {Array} items - The array of items to be transformed. Each item is expected to be an object and the function maps over each item to return a transformed version.
 * @param {string} path - The base URL path that will be used to generate the `link` property for each item.
 * @param {Array} selection - An array of keys that specify which fields should be selected from each item. If empty, all fields are included except `_id` (which is replaced by `id`).
 *
 * @returns {Array} - A new array of transformed items, where each item contains only the selected fields and a `link` property pointing to the item's URL.
 *
 * @throws {Error} - Throws an error if the parameters are invalid (e.g., `items` or `selection` is not an array, or if `path` is not a string).
 */

const getTransformedItems = (items = [], path = ``, selection = []) => {
  // TODO: Throw an error later when the provided parameters are invalid

  // if (!Array.isArray(items) || !Array.isArray(selection)) {
  //   throw([
  //     {
  //       code: `INVALID_TRANSFORMATION`,
  //       message: `Must both items and selection be a list format.`,
  //       field: `items and selection`,
  //       location: null,
  //       status: 400,
  //     },
  //   ]);
  // }

  // TODO: Validate items is passed or not -> return "please pass at least one item"
  // TODO: validate path is passed or not -> return "The path parameter is required"
  // TODO: validate path is string or not -> return "path must be a string format"

  if (selection.length === 0) {
    return items.map((item) => {
      const test = {
        ...item,
        id: item._id,
        link: `${path}/${item._id}`,
      };

      delete test._id;
      delete test.__v;

      return test;
    });
  }

  return items.map((item) => {
    const result = {};

    selection.forEach((key) => {
      if (key === `id`) {
        result[`id`] = item[`_id`];
      } else if (key in item) {
        result[key] = item[key];
      }
    });

    result.link = `${path}/${item._id}`;

    return result;
  });
};

export default getTransformedItems;
