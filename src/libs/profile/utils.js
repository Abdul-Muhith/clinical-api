import models from "../../models/index.js";

import {
  dbFindDocumentByProperty,
  dbEntityExistsByProperty,
} from "../../utils/db/index.js";

export const findProfileByProperty = async (key, value) => {
  const profile = await dbFindDocumentByProperty(models.Profile, key, value);

  return profile ?? false;
};

export const checkProfileExistsByMember = async (member) => {
  return await dbEntityExistsByProperty(models.Profile, `member`, member);
};

export const checkProfileExistsByProperty = async (key, value) => {
  return await dbEntityExistsByProperty(models.Profile, key, value);
};

export default {
  findProfileByProperty,
  checkProfileExistsByMember,
  checkProfileExistsByProperty,
};
