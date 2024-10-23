import authService from "../../../../libs/auth/index.js";
import memberValidate from "../../../../libs/member/validation.js";
import tokenUtils from "../../../../utils/token/index.js";

/**
 * This function will destructure request body , call auth's service to log into an existing account and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const signin = async (req, res, next) => {
  // ### → -> -> destructure the request body <- <- <-
  const { email, password } = req.body;

  try {
    // ### → -> -> Input validation <- <- <-
    memberValidate.requiredFields({ email, password });
    memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

    // ### → -> -> Invoke the service function <- <- <-
    const { member, accessToken } = await authService.signin({
      email,
      password,
    });

    // ### → -> -> Generate necessary responses <- <- <-
    delete member.created_at;
    delete member.updated_at;

    return res.status(200).json({
      code: 200,
      message: "Log in was completed successfully.",
      data: member,
      access_token: accessToken,
      expires_in: tokenUtils.decodeJWT(accessToken).exp,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        login: `${req.protocol}://${req.get("host")}${req.originalUrl}`.replace(
          `login`,
          `register`
        ),
      },
    });
  } catch (e) {
    next(e);
  }
};

export default signin;
