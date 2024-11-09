// ### -> --> --> Define the allowed sort-by fields for doctor <- <-- <--
const sortByFields = [
  "traceId",
  "specialty",
  "conditions",
  "availability",
  "updatedAt",
  "createdAt",
];

// ### -> --> --> Define the allowed filter fields for doctor <- <-- <--
const filterFields = ["specialty", "conditions", "availability"];

// ### -> --> --> Define the allowed search fields for doctor <- <-- <--
const searchFields = ["specialty", "conditions", "availability"];

// ### -> --> --> Define the allowed expand fields for doctor <- <-- <--
const expandFields = ["member"];

// ### -> --> --> Define the allowed select fields for doctor <- <-- <--
const selectFields = [
  "*",
  "id",
  "member",
  "traceId",
  "specialty",
  "conditions",
  "availability",
  "updatedAt",
  "createdAt",
];

export default {
  filterFields,
  sortByFields,
  searchFields,
  expandFields,
  selectFields,
};
