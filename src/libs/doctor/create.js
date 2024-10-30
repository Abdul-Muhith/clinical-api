import models from "../../models/index.js";
import doctorValidate, { validateThrowError } from "./validation.js";
import memberValidate from "../member/validation.js";
import { generateTraceId } from "../../utils/index.js";
import dbUtils from "../../utils/db/index.js";
import doctorUtils from "./utils.js";
import memberUtils from "../member/utils.js";

export const create = async ({
  member,
  username,
  phone,
  email,
  specialty,
  conditions,
  availability,
}) => {
  // ### → -> -> Input validation <- <- <-
  doctorValidate.objectId(member, `member`, `body`, `Invalid member input`); // If there are errors, throw the errors

  memberValidate.username(username);
  memberValidate.phone(phone);
  memberValidate.email(email);
  memberValidate.throwError(); // If there are errors, throw the errors

  doctorValidate.specialty(specialty);
  doctorValidate.conditions(conditions);
  doctorValidate.availability(availability);

  doctorValidate.throwError(); // If there are errors, throw the errors
  doctorValidate.requiredFields({ member, email }); // If there are errors, throw the errors

  // Check if the account exists or not
  const isMemberExist =
    member && (await memberUtils.checkMemberExistsByProperty("_id", member));

  // ### → -> -> When account doesn't exist with the provided ID <- <- <-
  if (!isMemberExist) {
    await memberValidate.emailExists(email);
    await memberValidate.phoneExists(phone);
    memberValidate.throwError(); // If there are errors, throw the errors

    // Create a new account for the doctor
    const memberPayload = {
      username,
      phone,
      email,
      role: "doctor",
      status: "pending",
    };

    const newMember = await dbUtils.dbCreateDocument(
      models.Member,
      memberPayload
    );

    // Create a new doctor
    const doctorPayload = {
      member: newMember._id,
      traceId: generateTraceId(`DOC`),
      specialty,
      conditions,
      availability,
    };

    const newDoctor = await dbUtils.dbCreateDocument(
      models.Doctor,
      doctorPayload
    );

    return { getMember: newMember, getDoctor: newDoctor };

    // ### → -> -> When account exists with the provided ID <- <- <-
  } else {
    // Check if the doctor is already exists with the provided member ID
    const isDoctorExist = await doctorUtils.checkDoctorExistsByMember(member);

    if (isDoctorExist) {
      doctorValidate.throwError(
        `This account is already designated as a doctor`,
        ``,
        [
          {
            code: `MEMBER_TAKEN`,
            message: `The account provided is already registered as a doctor.`,
            field: `member`,
            location: `bodY`,
            status: 400,
          },
        ]
      );
    }

    // ### → -> -> Locate and update the account to change its username, role and status in the database. <- <- <-
    const findMember = await memberUtils.findMemberByProperty("_id", member);

    findMember.username = username;
    findMember.phone = phone;
    findMember.role = `doctor`;
    await findMember.save();

    // Create a new doctor
    const doctorPayload = {
      member: findMember._id,
      traceId: generateTraceId(`DOC`),
      specialty,
      conditions,
      availability,
    };

    const newDoctor = await dbUtils.dbCreateDocument(
      models.Doctor,
      doctorPayload
    );

    return { getMember: findMember, getDoctor: newDoctor };
  }
};
