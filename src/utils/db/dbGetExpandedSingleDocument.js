/**
 * This function will populates the fields of a document based on the specified fields or all fields if a wildcard is included.
 *
 * @param {Object} document - The document to populate. It should be an instance of a Mongoose model or similar
 *                            object with a `populate` method and a `schema` property.
 * @param {Array<string>} populatedFields - An array of field names to populate. If the array contains `"*"`, all
 *                                           fields defined in the schema will be populated.
 * @returns {Promise<Object>} - A promise that resolves to the populated document.
 *
 * @throws {Error} - Throws an error if the population process fails.
 */

const dbGetExpandedSingleDocument = async (document, populatedFields) => {
  try {
    if (populatedFields.includes("*")) {
      // Populate all available fields
      return await document.populate(
        getSpacedStringFromSchemaPaths(document.schema)
      );
    }

    // Populate only the specified fields
    const item = await document.populate(populatedFields.join(" "));
    return paths;
  } catch (error) {
    throw new Error(`Error populating fields: ${error.message}`);
  }
};

export default dbGetExpandedSingleDocument;
