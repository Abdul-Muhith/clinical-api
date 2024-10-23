import ip from "ip";

import memberService from "../member/index.js";
import memberValidate from "../member/validation.js";

const signup = async ({
  username,
  phone,
  email,
  password,
  confirmPassword,
}) => {
  // ### → -> -> Input validation <- <- <-
  memberValidate.username(username);
  memberValidate.phone(phone);
  await memberValidate.phoneExists(phone);
  memberValidate.email(email);
  await memberValidate.emailExists(email);
  memberValidate.password(password);
  memberValidate.passwordMatches(confirmPassword, password);
  memberValidate.throwError(); // If there are errors, throw the errors

  memberValidate.requiredFields({ email, password, confirmPassword });
  memberValidate.throwError(`Must fill up all required fields.`); // If there are errors, throw the errors

  // ### → -> -> Store a new member to database <- <- <-
  return await memberService.localCreate({
    username,
    phone,
    email,
    password,
    issuedIp: ip.address(),
  });
};

export default signup;
