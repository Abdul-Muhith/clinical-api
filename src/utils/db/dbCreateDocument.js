/**
 * Creates a new document in the specified database collection.
 *
 * @param {object} collection - The database collection (model) to use for creating the document.
 * @param {object} payload - An object containing the document data to be created. Must include all required fields.
 * @returns {Promise<object>} - A promise that resolves to the created document with an added `id` field.
 *
 * @throws {Error} - Throws an error if required fields are missing or if the save operation fails.
 */

const dbCreateDocument = async (collection, payload) => {
  // ### → Validate that the payload has at least one key
  if (Object.keys(payload).length === 0) {
    throw new Error("Payload must include at least one field.");
  }

  // ### → Create a new document in the specified collection
  const document = new collection(payload);

  // ### → Store the document in the database
  await document.save();

  // ### → Return the created document with an added `id` field
  // return { ...document.toObject(), id: document.id };
  return { ...document._doc, id: document.id };
};

export default dbCreateDocument;
