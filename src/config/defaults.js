export {
  allowedForMember,
  allowedForDoctor,
  allowedForProfile,
} from "./query/index.js";

export {
  imageLimitToUpload,
  videoLimitToUpload,
  cloudinaryDirectoryToUploadProfilePhoto,
  allowedFormatsToUpload,
  cloudinaryFieldsToResponse,
} from "./upload.js";

const defaults = {
  page: 1,
  size: 25,
  sort: ``,
  sortBy: `updatedAt`,
  sortOrder: `ascending`,
  filter: ``,
  search: ``,
  searchKey: ``,
  searchTerm: ``,
  searchKeyForMember: `username`,
  expand: ``,
  select: ``,
  totalItems: 0,
};

export default defaults;
