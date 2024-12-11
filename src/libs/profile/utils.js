import { ProfileModel } from "../../models/index.js";

import {
  dbFindDocumentByProperty,
  dbEntityExistsByProperty,
} from "../../utils/index.js";

export const findProfileByProperty = async (key, value) => {
  const profile = await dbFindDocumentByProperty(ProfileModel, key, value);

  return profile ?? false;
};

export const checkProfileExistsByMember = async (member) => {
  return await dbEntityExistsByProperty(ProfileModel, `member`, member);
};

export const checkProfileExistsByProperty = async (key, value) => {
  return await dbEntityExistsByProperty(ProfileModel, key, value);
};

export default {
  findProfileByProperty,
  checkProfileExistsByMember,
  checkProfileExistsByProperty,
};
