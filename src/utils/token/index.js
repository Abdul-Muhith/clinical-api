import jwt from "jsonwebtoken";

import config from "../../config/index.js";
import customError from "../error.js";

// ### → -> -> Generate JWT Token <- <- <-
const generateJWT = (
  payload = {},
  privateKey = config.jwtSecret,
  expiresIn = config.jwtLifetime,
  algorithm = config.jwtAlgorithm
) => {
  // We will generate the token within a try-catch block to handle any generating errors gracefully and provide a user-friendly error message instead.

  try {
    // return jwt.sign(payload, privateKey, { algorithm, expiresIn });
    const token = jwt.sign(payload, privateKey, { algorithm, expiresIn });

    if (!token) {
      throw customError.serverError(``, [
        {
          code: `JWT_TOKEN`,
          message: `Something went wrong to generate a jwt token.`,
          field: `jsonwebtoken`,
          location: `server`,
        },
      ]);
    }

    return token;
  } catch (err) {
    throw customError.serverError();
  }
};

// ### → -> -> Decode JWT Token <- <- <-
const decodeJWT = (token, algorithm = config.jwtAlgorithm) => {
  // We will decode the token within a try-catch block to handle any decoding errors gracefully and provide a user-friendly error message instead.

  try {
    if (!token) {
      throw customError.badRequest(``, [
        {
          code: `MISSING_TOKEN`,
          message: `The authentication token is required.`,
          field: `access_token`,
          location: `header`,
        },
      ]);
    }

    return jwt.decode(token, { algorithms: [algorithm] });
  } catch (err) {
    throw customError.unAuthenticatedError(``, [
      {
        code: `INVALID_TOKEN`,
        message: `The authentication token provided is invalid.`,
        field: `jwt_token`,
        location: `header`,
      },
    ]);
  }
};

// ### → -> -> Verify JWT Token <- <- <-
const verifyJWT = (
  token,
  privateKey = config.jwtSecret,
  algorithm = config.jwtAlgorithm
) => {
  // We will verify the token within a try-catch block to handle any verifying errors gracefully and provide a user-friendly error message instead.

  try {
    if (!token) {
      throw customError.badRequest(``, [
        {
          code: `MISSING_TOKEN`,
          message: `The authentication token is required.`,
          field: `access_token`,
          location: `header`,
        },
      ]);
    }

    return jwt.verify(token, privateKey, { algorithms: [algorithm] });
  } catch (err) {
    throw customError.unAuthenticatedError(``, [
      {
        code: `INVALID_TOKEN_EXPIRED`,
        message: `The token provided is invalid or token has expired.`,
        field: `jwt_token`,
        location: `header`,
      },
    ]);
  }
};

export default {
  generateJWT,
  decodeJWT,
  verifyJWT,
};
