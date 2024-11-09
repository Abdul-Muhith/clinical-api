import { dbGetSpacedStringFromSchema } from "./index.js";

/**
 * This function will populates the specified fields for multiple documents, or all fields if a wildcard is included.
 *
 * @param {Array<Object>} documents - An array of documents to populate. Each document should be an instance of a Mongoose model or similar object with a `populate` method and a `schema` property.
 * @param {Array<string>} populatedFields - An array of field names to populate. If the array contains `"*"`, all fields defined in the schema of each document will be populated.
 * @returns {Promise<Array<Object>>} - A promise that resolves to an array of populated documents.
 * @throws {Error} - Throws an error if the population process for any document fails.
 */

const dbGetExpandedMultipleDocuments = async (documents, populatedFields) => {
  console.log("DB populate various -> ", populatedFields);

  // If wildcard is included, populate all fields for each document
  if (populatedFields.includes("*")) {
    return Promise.all(
      documents.map((item) =>
        item.populate(dbGetSpacedStringFromSchema(item.schema)).execPopulate()
      )
    );
  }

  // Populate only the specified fields for each document
  const fieldsString = populatedFields.join(" ");

  return Promise.all(
    documents.map((item) => item.populate(fieldsString).execPopulate())
  );
};

export default dbGetExpandedMultipleDocuments;
