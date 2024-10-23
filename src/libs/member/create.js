import models from "../../models/index.js";
import memberValidate from "./validation.js";
import dbUtils from "../../utils/db/index.js";
import hashingUtils from "../../utils/hashing.js";

export const localCreate = async ({
  username,
  phone,
  email,
  password,
  issuedIp,
}) => {
  // ### → -> -> input validation <- <- <-
  memberValidate.username(username);
  memberValidate.phone(phone);
  await memberValidate.phoneExists(phone);
  memberValidate.email(email);
  await memberValidate.emailExists(email);
  memberValidate.password(password);
  memberValidate.throwError(); // If there are errors, throw the errors

  memberValidate.requiredFields({ email, password });
  memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

  // ### → -> -> Generate hashed password <- <- <-
  password = await hashingUtils.generateHash(password);

  const payload = {
    username,
    phone,
    email,
    password,
    issuedIp,
    role: "user",
    status: "pending",
  };

  return await dbUtils.dbCreateDocument(models.Member, payload);
};
