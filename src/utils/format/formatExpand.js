/**
 * Formats a string into an array of objects where each object contains a path and select property.
 *
 * @param {string} fields - A string to format.
 * @returns {object[]} - A formatted array of objects.
 */

const formatExpand = (expand = ``) => {
  // parse to an array of strings
  const expandFieldsArray = expand.split(`,`);

  return expandFieldsArray.reduce((acc, item) => {
    // Validate if the provided expansion follows the correct format
    const extractedFields = item.split(".");

    if (extractedFields.length > 1 && extractedFields[1] !== ``) {
      // Extract the pathFields and selectedFields
      const [path, select] = item.split(`.`);

      if (path) {
        // Check if the path already exists in the accumulator
        let pathObject = acc.find((item) => item.path === path);

        if (pathObject) {
          pathObject.select += ` ${select}`; // Append the select field
        } else {
          if (select) {
            acc.push({ path: path, select: select }); // Create a new entry
          } else {
            acc[acc.length - 1].select += ` ${path}`; // Append the select field
          }
        }

        return acc;
      }
    }
  }, []);
};

export default formatExpand;
