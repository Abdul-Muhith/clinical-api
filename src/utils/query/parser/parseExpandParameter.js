import queryValidate from "../../validation/query.js";
import { format } from "../../index.js";

const parseExpandParameter = (expand = ``, allowedFields = []) => {
  // Validate expanding parameters
  queryValidate.expand(expand, allowedFields);
  queryValidate.throwError();

  // return formatted expand
  return format.expand(expand);
};

export default parseExpandParameter;
