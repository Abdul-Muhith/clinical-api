// ### -> --> --> Define the allowed member roles <- <-- <--
const allowedRoles = [`user`, `nurse`, `doctor`, `administrator`];

// ### -> --> --> Define the allowed account statuses <- <-- <--
const allowedStatuses = [`active`, `disabled`, `request changed`, `pending`];

export default {
  allowedRoles,
  allowedStatuses,
};
