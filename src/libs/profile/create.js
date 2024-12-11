import { ProfileModel } from "../../models/index.js";
import profileValidate from "./validation.js";
import { dbCreateDocument } from "../../utils/index.js";

import {
  cloudinaryDirectoryToUploadProfilePhoto,
  cloudinaryFieldsToResponse,
} from "../../config/defaults.js";

import { uploadToCloudinary } from "../../middlewares/uploadToCloude.js";
import { getTransformedItems } from "../../utils/index.js";

const create = async ({ member, gender, age, bloodGroup, photo, address }) => {
  // ### → -> -> Input validation <- <- <-
  profileValidate.objectId(member, `member`, `body`, `Invalid member input`); // If there are errors, throw the errors

  await profileValidate.profileExists(member);
  profileValidate.throwError(); // If there are errors, throw the errors

  profileValidate.gender(gender);
  profileValidate.age(age);
  profileValidate.bloodGroup(bloodGroup);
  profileValidate.address(address);

  profileValidate.throwError(); // If there are errors, throw the errors
  profileValidate.requiredFields({ member, gender }); // If there are errors, throw the errors

  // TODO: ### → -> -> Return the profile ID, if it exists <- <- <-
  // const ExistingProfile = await profileUtils.checkProfileExistsByMember(member);

  // console.log("Uploading here ====> ", ExistingProfile);

  let uploadedFiles = [];

  // ### → -> -> If no files are provided, the upload shouldn't technically proceed <- <- <-
  if (photo.length) {
    const result = await uploadToCloudinary(
      photo,
      cloudinaryDirectoryToUploadProfilePhoto
    );

    if (result.length) {
      // Ensure that the photo has been successfully uploaded to the cloud
      uploadedFiles = getTransformedItems(result, cloudinaryFieldsToResponse);
    } else {
      profileValidate.throwError(`No files uploaded to Cloudinary`, ``, [
        {
          code: `UPLOADING_PHOTO`,
          message: `No files uploaded to Cloudinary.`,
          field: `photo`,
          location: `bodY`,
          status: 400,
        },
      ]);
    }
  }

  // ### → -> -> Create a new profile for the member <- <- <-
  const profilePayload = {
    member,
    gender,
    age,
    bloodGroup,
    address,
  };

  if (uploadedFiles.length > 0) {
    profilePayload.photo = {
      caption: uploadedFiles[0].original_filename.split("-")[1],
      imageAlt: uploadedFiles[0].original_filename,
      assetId: uploadedFiles[0].asset_id,
      publicId: uploadedFiles[0].public_id,
      width: uploadedFiles[0].width,
      height: uploadedFiles[0].height,
      folder: uploadedFiles[0].folder,
      type: uploadedFiles[0].resource_type,
      format: uploadedFiles[0].format,
      size: uploadedFiles[0].bytes,
      url: uploadedFiles[0].url,
    };
  }

  const newProfile = await dbCreateDocument(ProfileModel, profilePayload);

  // ### → -> -> Return necessary responses <- <- <-
  return { getProfile: newProfile };
};

export default create;
