/**
 * Checks if an entity exists in the database based on a specified property and its value.
 *
 * @param {object} collection - The database collection to search within.
 * @param {string} key - The property name by which to find the document.
 *                       For example: '_id', 'username', 'email', etc.
 * @param {*} value - The value of the property to match. This can be a string, number or other types.
 * @returns {Promise<boolean>} - A promise that resolves to true if the document exists or false if it does not.
 *
 * @throws {Error} - Throws an error if an invalid property key is provided.
 */

const dbEntityExistsByProperty = async (collection, key, value) => {
  // ### → Validate the key to prevent SQL injection or other issues.
  if (!key || typeof key !== "string") {
    throw new Error("Invalid key provided.");
  }

  // ### → Handle the case where the key is '_id'
  if (key === "_id") {
    // ### → Check if value is a valid format for ObjectId if using MongoDB
    if (typeof value === "string" && value.match(/^[0-9a-fA-F]{24}$/)) {
      const entity = await collection.findById(value).exec();
      return !!entity; // Return true if the entity exists, false otherwise
    } else {
      throw new Error("Invalid _id format.");
    }
  }

  // ### → Handle generic property search and return
  const entity = await collection.findOne({ [key]: value }).exec();

  // return entity ? true : false;
  return !!entity; // Return true if the entity exists, false otherwise
};

export default dbEntityExistsByProperty;
