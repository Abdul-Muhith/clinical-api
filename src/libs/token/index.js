import config from "../../config/index.js";
import tokenUtils from "../../utils/token/index.js";
import customError from "../../utils/error.js";

// ### → -> -> Generate Refresh Token <- <- <-
const generateRefreshToken = (
  payload = {},
  privateKey = config.refreshTokenSecret,
  expiresIn = config.refreshTokenLifetime
) => {
  try {
    return tokenUtils.generateJWT(payload, privateKey, expiresIn);
  } catch (error) {
    throw customError.serverError(`Failed to generate refresh token`);
  }
};

// ### → -> -> Generate Access Token <- <- <-
const generateAccessToken = (
  payload = {},
  privateKey = config.accessTokenSecret,
  expiresIn = config.accessTokenLifetime
) => {
  try {
    return tokenUtils.generateJWT(payload, privateKey, expiresIn);
  } catch (error) {
    throw customError.serverError(`Failed to generate access token`);
  }
};

// ### → -> -> Verify Access Token <- <- <-
const verifyAccessToken = (token, privateKey = config.accessTokenSecret) => {
  // We will verify the access token within a try-catch block to handle any verifying errors gracefully and provide a user-friendly error message instead.

  try {
    return tokenUtils.verifyJWT(token, privateKey);
  } catch (err) {
    throw customError.unAuthenticatedError(``, [
      {
        code: "FAILED_VERIFY",
        message: `Failed to verify the provided access token`,
        field: "accessToken",
        location: "header",
        status: 401,
      },
    ]);
  }
};

export default {
  generateRefreshToken,
  generateAccessToken,
  verifyAccessToken,
};
