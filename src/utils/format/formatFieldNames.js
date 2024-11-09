/**
 * Formats an array of field names into a human-readable string.
 * If the array contains multiple items, the last item is prefixed with "and".
 *
 * @param {string[]} fields - An array of field names to format.
 * @returns {string} - A formatted string of field names.
 */

const formatFieldNames = (fields = []) => {
  if (fields.length > 1) {
    return fields.slice(0, -1).join(`, `) + ` and ` + fields[fields.length - 1];
  } else {
    return fields.join(``);
  }
};

export default formatFieldNames;
