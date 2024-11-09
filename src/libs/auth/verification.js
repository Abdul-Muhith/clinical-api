import validationUtils from "../../utils/validation/index.js";
import memberValidate from "../member/validation.js";
import { getDTO } from "../member/index.js";
import memberUtils from "../member/utils.js";
import customError from "../../utils/error.js";
import tokenService from "../token/index.js";

const verification = async ({ id, role, status, ownId }) => {
  // ### → -> -> Input validation <- <- <-
  validationUtils.objectIdError(id, `accountId`);
  memberValidate.role(role);
  memberValidate.status(status);
  memberValidate.throwError(); // If there are errors, throw the errors

  memberValidate.requiredFields({ id, status, ownId });
  memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

  // ### → Check if the expected account exists or not
  const member = await memberUtils.findMemberByProperty(`_id`, id);

  if (!member) {
    throw customError.notFound(`Unable to locate the requested account`, [
      {
        code: "ACCOUNT_NOT_FOUND",
        message: "The account you are looking for could not be found.",
        field: "memberId",
        location: "path",
        status: 404,
      },
    ]);
  }

  // ### → Check if the ownId is a valid format for ObjectId if using MongoDB
  validationUtils.objectIdError(ownId, `ownId`);

  if (ownId === member._id.toString()) {
    throw customError.forbiddenError(
      `You weren't able to verify your account to update your role or status.`
    );
  }

  // ### → -> -> Update member to modify their token, role and account status in database <- <- <-
  member.status = status;
  if (role) member.role = role;

  let memberDTO = getDTO(member);

  const refreshToken = tokenService.generateRefreshToken(memberDTO);

  member.token = refreshToken;
  await member.save();

  const accessToken = tokenService.generateAccessToken(memberDTO);

  return { member: memberDTO, accessToken };
};

export default verification;
