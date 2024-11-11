import models from "../../models/index.js";
import validate from "./validation.js";
import { dbCreateDocument } from "../../utils/db/index.js";
import { hashing } from "../../utils/index.js";

const localCreate = async ({ username, phone, email, password, issuedIp }) => {
  // ### → -> -> input validation <- <- <-
  validate.username(username);
  validate.phone(phone);
  await validate.phoneExists(phone);
  validate.email(email);
  await validate.emailExists(email);
  validate.password(password);
  validate.throwError(); // If there are errors, throw the errors

  validate.requiredFields({ email, password });
  validate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

  // ### → -> -> Generate hashed password <- <- <-
  password = await hashing.generateHash(password);

  const payload = {
    username,
    phone,
    email,
    password,
    issuedIp,
    role: "user",
    status: "pending",
  };

  return await dbCreateDocument(models.Member, payload);
};

export default localCreate;
