import ip from "ip";
import { isAfter } from "date-fns";

import customError from "../utils/error.js";
import tokenService from "../libs/token/index.js";
import memberService from "../libs/member/index.js";

const authenticate = async (req, _res, next) => {
  try {
    // Check if the authorization header exists or not
    if (!req.headers["authorization"]) {
      throw customError.unAuthenticatedError();
    }

    // Check if the word "Bearer " exists there or not
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      throw customError.unAuthenticatedError(
        `No token is attached to the header.`,
        [
          {
            code: "MISSING_TOKEN",
            message: `There is no token that contains "Bearer".`,
            field: "accessToken",
            location: "header",
            status: 401,
          },
        ]
      );
    }

    // Check if the access token exists there or not
    if (!req.headers.authorization?.split(" ")[1]) {
      throw customError.unAuthenticatedError();
    }

    // ### Check if it's a verified access token or not
    const payload = tokenService.verifyAccessToken(
      req.headers.authorization.split(" ")[1]
    );

    // ### Verify if the access token has expired or is still valid.
    if (!isAfter(new Date(), payload.exp)) {
      throw customError.unAuthenticatedError(``, [
        {
          code: "TOKEN_EXPIRED",
          message: "The authentication token provided has expired.",
          field: "accessToken",
          location: "header",
          status: 401,
        },
      ]);
    }

    // ### → -> -> Check if the member exists in the database to ensure they haven't been removed or deleted, even if the token is present in the header <- <- <-
    const member = await memberService.utils.findMemberByProperty(
      `email`,
      payload.email
    );

    // ### → -> -> Confirm whether their issued IP matches the current IP <- <- <-
    if (!member || (member?.issuedIp && member?.issuedIp !== ip.address())) {
      throw customError.forbiddenError(``, [
        {
          code: "INVALID_IP_ADDRESS",
          message: "The IP address is currently denied access to the service.",
          field: "accessToken",
          location: "header",
          status: 403,
        },
      ]);
    }

    // ### → -> -> Check that only accounts with an active status are allowed access <- <- <-
    if (member?.status.toLowerCase() != `active`) {
      throw customError.forbiddenError(``, [
        {
          code: "INVALID_ACCOUNT",
          message: `The account status is ${member.status.toUpperCase()} at this moment.`,
          field: "accessToken",
          location: "header",
          status: 403,
        },
      ]);
    }

    let memberDTO = memberService.getDTO(member);

    delete memberDTO.created_at;
    delete memberDTO.updated_at;

    req.user = memberDTO;

    next();
  } catch (err) {
    next(err);
  }
};

export default authenticate;
