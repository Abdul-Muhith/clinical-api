import queryValidate from "../../validation/query.js";
import { format } from "../../index.js";

const parseExpandParameter = (expand = ``, allowedFields = []) => {
  // Validate expanding parameters
  const formattedExpand = format.expand(expand);

  if (!formattedExpand) {
    queryValidate.throwError(
      `Invalid expanding parameter.`,
      `Please, ensure all fields are correctly filled and try again`,
      [
        {
          code: `INVALID_EXPAND`,
          message: `The provided parameter is currently unable to expand.`,
          field: null,
          location: "query",
          status: 400,
        },
      ]
    );
  }

  const expandedArray = formattedExpand.map((item) => item.path);

  queryValidate.expand(expandedArray.join(","), allowedFields);
  queryValidate.throwError();

  // return formatted expand
  return formattedExpand;
};

export default parseExpandParameter;
