import config from "../../config/index.js";
import tokenUtils from "../../utils/token/index.js";
import customError from "../../utils/error.js";

// ### → -> -> Generate Refresh Token <- <- <-
const generateRefreshToken = (
  payload = {},
  privateKey = config.refreshTokenSecret,
  expiresIn = config.refreshTOkenLifetime
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

export default {
  generateRefreshToken,
  generateAccessToken,
};
