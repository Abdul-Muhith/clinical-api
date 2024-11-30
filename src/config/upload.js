export const imageLimitToUpload = 10 * 1024 * 1024; // Limit image file size to 10 MB

export const videoLimitToUpload = 100 * 1024 * 1024; // Limit video file size to 100 MB

export const cloudinaryDirectoryToUploadProfilePhoto = `jm-api/profile-images`;

export const allowedFormatsToUpload = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
  // "svg",
  // "pdf",
  // "mp4",
  // "mov",
  // "avi",
];

export const cloudinaryFieldsToResponse = [
  "asset_id",
  "public_id",
  // "version", // Uncomment if you want to include the version
  // "version_id", // Uncomment if you want to include the version_id
  // "signature", // Uncomment if you want to include the signature
  "width",
  "height",
  "format",
  "resource_type",
  // "created_at",
  // "updated_at",
  // "tags", // Uncomment if you want to include tags
  // "pages", // Uncomment if you want to include pages
  "bytes",
  // "type", // Uncomment if you want to include type
  // "etag", // Uncomment if you want to include the etag
  // "placeholder", // Uncomment if you want to include placeholder
  "url",
  // "secure_url",
  "folder",
  "original_filename",
  // "api_key",
];
