import models from "../../models/index.js";
import dbUtils from "../../utils/db/index.js";

const findMemberByProperty = async (key, value) => {
  const member = await dbUtils.dbFindDocumentByProperty(
    models.Member,
    key,
    value
  );

  return member ?? false;
};

const checkMemberExistsByEmail = async (email) => {
  return await dbUtils.dbEntityExistsByProperty(models.Member, `email`, email);
};

const checkMemberExistsByPhone = async (phone) => {
  return await dbUtils.dbEntityExistsByProperty(models.Member, `phone`, phone);
};

const checkMemberExistsByProperty = async (key, value) => {
  return await dbUtils.dbEntityExistsByProperty(models.Member, key, value);
};

export default {
  findMemberByProperty,
  checkMemberExistsByEmail,
  checkMemberExistsByPhone,
  checkMemberExistsByProperty,
};
