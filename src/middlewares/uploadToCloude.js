import fs from "fs";

import cloudinary from "../config/cloudinary.js";

// Function to upload files to Cloudinary
export const uploadToCloudinary = async (
  files = [],
  folder = "jm-uploads",
  resource_type = "image"
) => {
  // TODO: uncomment if you use this instead of profile creation
  // if (!file) {
  // if (!files || files.length === 0) {
  //   return res
  //     .status(400)
  //     .json({ message: "At least one file is required to upload." });
  // }

  const uploadedFiles = [];

  for (const file of files) {
    // Check if the file is a video
    if (file.mimetype.startsWith("video/")) {
      resource_type = "video";
      //   folder = "jm-uploads/videos";
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder,
      resource_type,
    });

    uploadedFiles.push(uploadResult);

    fs.unlinkSync(file.path); // Remove the temporary file from the local storage
  }

  return uploadedFiles;
};
