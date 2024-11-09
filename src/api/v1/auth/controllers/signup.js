import authService from "../../../../libs/auth/index.js";
import memberValidate from "../../../../libs/member/validation.js";
import { getDTO } from "../../../../libs/member/index.js";
import tokenService from "../../../../libs/token/index.js";
import tokenUtils from "../../../../utils/token/index.js";

/**
 * This function will destructure request body , call auth's service to create a new account and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const signup = async (req, res, next) => {
  // ### → -> -> destructure the request body <- <- <-
  const { username, phone, email, password, confirmPassword } = req.body;

  try {
    // ### → -> -> Input validation <- <- <-
    memberValidate.requiredFields({ email, password, confirmPassword });
    memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

    // ### → -> -> Invoke the service function <- <- <-
    const member = await authService.signup({
      username,
      phone,
      email,
      password,
      confirmPassword,
    });

    // ### → -> -> Generate necessary responses <- <- <-
    const memberDTO = getDTO(member);

    const token = tokenService.generateAccessToken(memberDTO);

    return res.status(201).json({
      code: 201,
      message: "Account request was completed successfully.",
      data: memberDTO,
      access_token: token,
      expires_in: tokenUtils.decodeJWT(token).exp,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        login: `${req.protocol}://${req.get("host")}${req.originalUrl}`.replace(
          `register`,
          `login`
        ),
      },
    });
  } catch (e) {
    next(e);
  }
};

export default signup;
