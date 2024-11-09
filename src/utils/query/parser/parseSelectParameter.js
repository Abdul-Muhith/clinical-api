import queryValidate from "../../validation/query.js";
import { format } from "../../index.js";

const parseSelectParameter = (select = ``, allowedFields = []) => {
  // Validate selecting parameters
  queryValidate.select(select, allowedFields);
  queryValidate.throwError(`Invalid selecting credentials`);

  // Format and return
  return format.select(select);
};

export default parseSelectParameter;
