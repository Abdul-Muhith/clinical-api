import models from "../../models/index.js";

import {
  dbFindDocumentByProperty,
  dbEntityExistsByProperty,
} from "../../utils/db/index.js";

export const findDoctorByProperty = async (key, value) => {
  const doctor = await dbFindDocumentByProperty(models.Doctor, key, value);

  return doctor ?? false;
};

export const checkDoctorExistsByMember = async (member) => {
  return await dbEntityExistsByProperty(models.Doctor, `member`, member);
};

export const checkDoctorExistsByTraceId = async (traceId) => {
  return await dbEntityExistsByProperty(models.Doctor, `traceId`, traceId);
};

export const checkDoctorExistsByProperty = async (key, value) => {
  return await dbEntityExistsByProperty(models.Doctor, key, value);
};

export default {
  findDoctorByProperty,
  checkDoctorExistsByMember,
  checkDoctorExistsByTraceId,
  checkDoctorExistsByProperty,
};
