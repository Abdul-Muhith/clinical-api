/**
 * This function will generate a URL-encoded query string from a given object.
 *
 * It takes an object of key-value pairs and converts it into a properly formatted query string.
 * The query string is encoded so that special characters in the keys and values are safely transmitted in a URL.
 *
 * @param {Object} query - An object where keys represent the query parameter names, and values represent the query parameter values.
 *
 * @returns {string} A URL-encoded query string, formatted as `key1=value1&key2=value2&...`.
 */

const generateQueryString = (query) => {
  return Object.keys(query)
    .map(
      (key) => encodeURIComponent(key) + "=" + encodeURIComponent(query[key])
    )
    .join("&");
};

export default generateQueryString;
