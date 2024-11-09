import models from "../../models/index.js";
import dbUtils from "../../utils/db/index.js";

export const findDoctorByProperty = async (key, value) => {
  const doctor = await dbUtils.dbFindDocumentByProperty(
    models.Doctor,
    key,
    value
  );

  return doctor ?? false;
};

export const checkDoctorExistsByMember = async (member) => {
  return await dbUtils.dbEntityExistsByProperty(
    models.Doctor,
    `member`,
    member
  );
};

export const checkDoctorExistsByTraceId = async (traceId) => {
  return await dbUtils.dbEntityExistsByProperty(
    models.Doctor,
    `traceId`,
    traceId
  );
};

export const checkDoctorExistsByProperty = async (key, value) => {
  return await dbUtils.dbEntityExistsByProperty(models.Doctor, key, value);
};

export default {
  findDoctorByProperty,
  checkDoctorExistsByMember,
  checkDoctorExistsByTraceId,
  checkDoctorExistsByProperty,
};
