// ### -> --> --> Define the allowed sort-by fields for member <- <-- <--
const sortByFields = [
  "username",
  "phone",
  "email",
  "role",
  "status",
  "updatedAt",
  "createdAt",
];

// ### -> --> --> Define the allowed filter fields for member <- <-- <--
const filterFields = ["username", "phone", "email", "role", "status"];

// ### -> --> --> Define the allowed search fields for member <- <-- <--
const searchFields = ["username", "phone", "email"];

// ### -> --> --> Define the allowed expand fields for member <- <-- <--
const expandFields = ["doctor", "nurse"];

// ### -> --> --> Define the allowed select fields for member <- <-- <--
const selectFields = [
  "*",
  "id",
  "username",
  "phone",
  "email",
  "role",
  "status",
  "updatedAt",
  "createdAt",
];

// ### -> --> --> Define the fields to response for member <- <-- <--
const fieldsToResponse = [
  "id",
  "username",
  "phone",
  "email",
  "age",
  "gender",
  "bloodGroup",
  "address",
  "photo",
  "traceId",
  "specialty",
  "conditions",
  "availability",
  "role",
  "status",
  "createdAt",
  "updatedAt",
];

export default {
  filterFields,
  sortByFields,
  searchFields,
  expandFields,
  selectFields,
  fieldsToResponse,
};
