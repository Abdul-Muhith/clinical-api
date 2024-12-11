import { DoctorModel } from "../../models/index.js";

import {
  dbFindDocumentByProperty,
  dbEntityExistsByProperty,
} from "../../utils/index.js";

export const findDoctorByProperty = async (key, value) => {
  const doctor = await dbFindDocumentByProperty(DoctorModel, key, value);

  return doctor ?? false;
};

export const checkDoctorExistsByMember = async (member) => {
  return await dbEntityExistsByProperty(DoctorModel, `member`, member);
};

export const checkDoctorExistsByTraceId = async (traceId) => {
  return await dbEntityExistsByProperty(DoctorModel, `traceId`, traceId);
};

export const checkDoctorExistsByProperty = async (key, value) => {
  return await dbEntityExistsByProperty(DoctorModel, key, value);
};

export default {
  findDoctorByProperty,
  checkDoctorExistsByMember,
  checkDoctorExistsByTraceId,
  checkDoctorExistsByProperty,
};
