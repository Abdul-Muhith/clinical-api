/**
 * Helper function to retrieve and concatenate all field names from a schema, excluding the `_id` field.
 *
 * @param {Object} schema - The schema object, expected to have a `paths` property containing field definitions.
 * @returns {string} - A space-separated string of field names extracted from the schema, excluding `_id`.
 */

const dbGetSpacedStringFromSchema = (schema) => {
  const paths = Object.keys(schema.paths).filter((path) => path !== "_id");

  console.log("dbGetSpacedStringFromSchema -> ", paths.join(" "));

  return paths.join(" ");
};

export default dbGetSpacedStringFromSchema;
