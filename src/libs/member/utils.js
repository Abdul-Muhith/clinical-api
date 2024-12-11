import { MemberModel } from "../../models/index.js";

import { findDoctorByProperty } from "../doctor/utils.js";

import {
  dbFindDocumentByProperty,
  dbEntityExistsByProperty,
} from "../../utils/index.js";

const findMemberByProperty = async (key, value) => {
  const member = await dbFindDocumentByProperty(MemberModel, key, value);

  return member ?? false;
};

const checkMemberExistsByEmail = async (email) => {
  return await dbEntityExistsByProperty(MemberModel, `email`, email);
};

const checkMemberExistsByPhone = async (phone) => {
  return await dbEntityExistsByProperty(MemberModel, `phone`, phone);
};

const checkMemberExistsByProperty = async (key, value) => {
  return await dbEntityExistsByProperty(MemberModel, key, value);
};

export const expandMultipleMembersByRole = async (
  document = [],
  role = ``,
  selects = ``
) => {
  return await document.reduce(async (accPromise, member) => {
    // Wait for the accumulator to resolve, since reduce is being used asynchronously
    const acc = await accPromise;

    // Check if the member has with the desired role
    if (member.role?.toLowerCase() === role.toLowerCase()) {
      const selectedArray = selects.split(" ");

      const doctorInfo = await findDoctorByProperty(`member`, member._id);

      // ### → -> -> Expand each member who have the doctor information <- <- <-
      if (doctorInfo) {
        // If wildcard is included, meaning all fields should be added to each document
        if (selectedArray.includes("*")) {
          acc.push({
            ...doctorInfo._doc,
            ...member,
            // ...member._doc,
          });
        } else {
          // Only the specified fields should be added to each document
          const specifiedDoctorInfo = {};

          selectedArray.forEach((field) => {
            if (doctorInfo._doc.hasOwnProperty(field)) {
              specifiedDoctorInfo[field] = doctorInfo._doc[field];
            }
          });

          acc.push({
            ...specifiedDoctorInfo,
            ...member,
            // ...member._doc,
          });
        }
      }
      // TODO: ### → -> -> Expand each member who have the nurse information <- <- <-
      // else if (nurseInfo) { }
      else {
        // ### → -> -> Add members without additional information to the accumulator, against their role <- <- <-
        acc.push({
          // ...member._doc,
          ...member,
        });
      }
    } else {
      // ### → -> -> Add nonExpanded member into the accumulator <- <- <-
      acc.push({
        // ...member._doc,
        ...member,
      });
    }

    return acc;
  }, Promise.resolve([]));
};

export default {
  findMemberByProperty,
  checkMemberExistsByEmail,
  checkMemberExistsByPhone,
  checkMemberExistsByProperty,
};
