import memberValidate from "../member/validation.js";
import memberService from "../member/index.js";
import memberUtils from "../member/utils.js";
import customError from "../../utils/error.js";
import hashingUtils from "../../utils/hashing.js";
import tokenService from "../token/index.js";

const signin = async ({ email, password }) => {
  // ### → -> -> Input validation <- <- <-
  memberValidate.email(email);
  memberValidate.password(password);
  memberValidate.throwError(); // If there are errors, throw the errors

  memberValidate.requiredFields({ email, password });
  memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

  const member = await memberUtils.findMemberByProperty(`email`, email);

  const error = {
    code: "INVALID_INPUT",
    message: "Either an email address or a password is invalid.",
    field: "email or password",
    location: "body",
    status: 400,
  };

  if (!member) {
    throw customError.badRequest(``, [error]);
  }

  const isPasswordMatched = await hashingUtils.compareHash(
    password,
    member?.password
  );

  if (!isPasswordMatched) {
    throw customError.badRequest(``, [error]);
  }

  // ### → -> -> Update member to include a refresh token in their token <- <- <-
  let memberDTO = memberService.getDTO(member);

  const refreshToken = tokenService.generateRefreshToken(memberDTO);

  member.token = refreshToken;
  await member.save();

  const accessToken = tokenService.generateAccessToken(memberDTO);

  return { member: memberDTO, accessToken };
};

export default signin;
