import path from "path";

import multer from "multer";

import { allowedFormatsToUpload } from "../config/defaults.js";

// Set up multer storage (optional - for file handling)
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "./src/uploads/"); // specify upload folder
  },
  filename: (_req, file, cb) => {
    // cb(null, Date.now() + "-" + path.extname(file.originalname));
    cb(null, Date.now() + "-" + file.originalname); // generate unique file name
  },
});

// File validation
const fileFilter = (_req, file, cb) => {
  const type = file.mimetype.split("/")[1]; // Extract file extension and mimetype

  if (allowedFormatsToUpload.includes(type)) {
    cb(null, true);
  } else {
    // Prevent the upload
    cb(
      {
        code: 400,
        message: `Unsupported file format ${type}`,
        field: null,
        location: `multer`,
      },
      false
    );
  }
};

// Create multer instance
const upload = (limit) => {
  return multer({
    storage: storage,
    limits: { fileSize: limit },
    fileFilter,
  });
};

export default upload;
