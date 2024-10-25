import customError from "../utils/error.js";

// ### → -> -> This function will check that only accounts with an appropriate roles are allowed access <- <- <-

const authorize =
  (allowedRoles = ["administrator"]) =>
  (req, _res, next) => {
    if (
      allowedRoles.some(
        (role) => role.toLowerCase() === req.user.role.toLowerCase()
      )
    ) {
      return next();
    }

    return next(customError.forbiddenError());
  };

export default authorize;
