/**
 * This function will logout an existing account and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const logout = async (req, res, next) => {
  try {
    // Check if the authorization header exists or not
    if (!req.headers["authorization"]) {
      throw customError.unAuthenticatedError();
    }

    // Check if the word "Bearer " exists there or not
    if (!req.headers.authorization?.startsWith("Bearer ")) {
      throw customError.unAuthenticatedError();
    }

    // Check if the access token exists there or not
    if (!req.headers.authorization?.split(" ")[1]) {
      throw customError.unAuthenticatedError();
    }

    req.headers.authorization = ``;
    req.user = ``;

    // ### → -> -> Generate necessary responses <- <- <-
    return res.status(200).json({
      code: 200,
      message: "Logout was completed successfully.",
      data: {
        status: true,
        uptime: process.uptime(), // Uptime in seconds
        timestamp: new Date().toISOString(),
      },
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        login: `${req.protocol}://${req.get("host")}/auth/local/login`,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default logout;
