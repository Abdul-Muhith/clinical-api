import { allowedForDoctor } from "../../config/defaults.js";

import queryValidate from "../../utils/validation/query.js";

import { expandMultipleMembersByRole } from "../member/utils.js";

const expandRole = async (formattedExpand = [], document = {} || []) => {
  // Validate the provided formatted expansion
  if (!formattedExpand.length > 0) {
    queryValidate.throwError(
      `The expand format must include at least one object, containing both the path and select fields.`,
      ``,
      [
        {
          code: `INVALID_EXPAND_FORMAT`,
          message: `Please, ensure the expandRole function is correctly called.`,
          field: null,
          location: null,
          status: 400,
        },
      ]
    );
  }

  // ### → -> -> When the document format is an array <- <- <-
  if (Array.isArray(document)) {
    // Check and throw an error if the role property does not exist in at least one member
    const hasRole = document.some((member) => member?.role);

    if (!hasRole) {
      queryValidate.throwError(
        `Invalid selecting parameters`,
        `Please, ensure that the 'role' field is currently selected`,
        [
          {
            code: `MISSING_MEMBER_ROLE`,
            message: `The 'role' property is required to expand the result.`,
            field: `select`,
            location: "query",
            status: 400,
          },
        ]
      );
    }

    return await Promise.all(
      formattedExpand.map(async (item) => {
        // TODO: get all roles within the document and expand them accordingly

        // ### → -> -> Expand each member who have the 'doctor' role to include doctor information <- <- <-
        if (item.path === `doctor`) {
          // Check for invalid selecting fields
          queryValidate.select(
            item.select.split(` `).join(`,`),
            allowedForDoctor.selectFields
          );

          queryValidate.throwError(
            `The doctor parameter is currently unable to select.`,
            `Please, ensure all fields are correctly filled and try again`,
            queryValidate.getErrors(),
            queryValidate.clearErrors() // Clear errors for the next validation
          );

          // When the path is equal to 'doctor'
          return await expandMultipleMembersByRole(
            document,
            `doctor`,
            item.select
          );
        } else if (item.path === `nurse`) {
          // TODO: Implement later -> When the path is equal to 'nurse'
        }
      })
    );
  } else {
    // TODO: ### → -> -> Expand a single member based on their role to include additional information <- <- <-
    // {
    //   _id: "6721f78241edbad9398a09fd",
    //   username: "Abdullah",
    //   email: "pakhi@example.com",
    //   role: "doctor",
    //   status: "pending",
    //   createdAt: "2024-10-30T09:08:18.471Z",
    //   updatedAt: "2024-10-30T09:08:18.471Z",
    //   __v: 0,
    // }
  }
};

export default expandRole;
