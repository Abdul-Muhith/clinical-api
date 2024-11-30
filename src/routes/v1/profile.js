import express from "express";

import multer from "multer";

import upload from "../../middlewares/multer.js";

import profileValidate from "../../libs/profile/validation.js";

import { imageLimitToUpload } from "../../config/defaults.js";

import { create } from "../../api/v1/profile/controllers/index.js";

const router = express.Router();

router.route("").post(
  upload(imageLimitToUpload).array("photo", 1),
  (err, _req, _res, next) => {
    if (err instanceof multer.MulterError) {
      profileValidate.throwError(
        `Multer Specific Error`,
        `file size exceeded`,
        [err]
      );
    } else if (err) {
      profileValidate.throwError(
        `Invalid File Format`,
        `Please verify your file format`,
        [err]
      );
    } else {
      next();
    }
  },
  create
);

export default router;
