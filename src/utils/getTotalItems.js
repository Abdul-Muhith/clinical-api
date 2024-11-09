/**
 * This function will count and return the total number of documents in a given model.
 *
 * @param {Object} model - The Mongoose model (or any MongoDB model) for which to count the total documents.
 * @returns {Promise<number>} - A promise that resolves to the total number of documents in the model.
 */

const getTotalItems = (model) => {
  return model.countDocuments();
};

export default getTotalItems;
