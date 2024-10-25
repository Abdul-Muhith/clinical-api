import authService from "../../../../libs/auth/index.js";
import memberValidate from "../../../../libs/member/validation.js";
import tokenUtils from "../../../../utils/token/index.js";

/**
 * This function will destructure request body, call auth's service to verify an existing account and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const verification = async (req, res, next) => {
  // ### → -> -> destructure the request body <- <- <-
  const { role, status } = req.body;

  try {
    // ### → -> -> Input validation <- <- <-
    memberValidate.requiredFields({ status });
    memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

    // ### → -> -> Invoke the service function <- <- <-
    const { member, accessToken } = await authService.verification({
      id: req.params.id,
      role,
      status,
      ownId: req.user.id,
    });

    // ### → -> -> Generate necessary responses <- <- <-
    return res.status(200).json({
      code: 200,
      message: "The account has been verified successfully.",
      data: member,
      access_token: accessToken,
      expires_in: tokenUtils.decodeJWT(accessToken).exp,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        login: `${req.protocol}://${req.get("host")}/api/v1/auth/local/login`,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default verification;
