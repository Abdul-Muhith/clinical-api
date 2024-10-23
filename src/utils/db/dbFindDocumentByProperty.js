/**
 * Finds a document in the database collection by a specified property.
 *
 * @param {object} collection - The database collection to search within.
 * @param {string} key - The property name by which to find the document.
 *                       For example: '_id', 'username', 'email', etc.
 * @param {*} value - The value of the property to match. This can be a string, number or other types.
 * @returns {Promise<object|null>} - A promise that resolves to the found document or null if no document matches.
 *
 * @throws {Error} - Throws an error if an invalid property key is provided.
 */

const dbFindDocumentByProperty = async (collection, key, value) => {
  // ### → Validate the key to prevent SQL injection or other issues.
  if (!key || typeof key !== "string") {
    throw new Error("Invalid key provided.");
  }

  // ### → Handle the case where the key is '_id'
  if (key === "_id") {
    // ### → Check if value is a valid format for ObjectId if using MongoDB
    if (typeof value === "string" && value.match(/^[0-9a-fA-F]{24}$/)) {
      return await collection.findById(value).exec();
    } else {
      throw new Error("Invalid _id format.");
    }
  }

  // ### → Handle generic property search and return
  return await collection.findOne({ [key]: value }).exec();
};

export default dbFindDocumentByProperty;
