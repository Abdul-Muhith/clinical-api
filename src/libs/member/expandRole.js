import validate from "./validation.js";

import doctorValidate, {
  validateThrowError as doctorThrowError,
} from "../doctor/validation.js";

import { allowedForDoctor } from "../../config/defaults.js";

import { expandMultipleMembersByRole } from "../member/utils.js";

const expandRole = async (formattedExpand = [], document = {} || []) => {
  // Validate the provided formatted expansion
  if (!formattedExpand.length >= 1) {
    doctorThrowError(
      `The expand format must be a list of strings.`,
      `Please, ensure the expandRole function is correctly called and try again`,
      doctorValidate.getErrors(),
      doctorValidate.clearErrors() // Clear errors for the next validation
    );
  }

  // ### → -> -> When the document format is an array <- <- <-
  if (Array.isArray(document)) {
    // Check if the role property exists in at least one member
    const hasRole = document.some((member) => member?.role);

    if (hasRole) {
      // TODO: find all roles within the document and expand them accordingly

      // Check for invalid selecting fields
      return await Promise.all(
        formattedExpand.map(async (item) => {
          // When the path is equal to 'doctor'
          if (item.path === `doctor`) {
            doctorValidate.selectParameter(
              item.select.split(" "),
              allowedForDoctor.selectFields
            );

            doctorThrowError(
              `The doctor parameter is currently unable to select.`,
              `Please, ensure all fields are correctly filled and try again`,
              doctorValidate.getErrors(),
              doctorValidate.clearErrors() // Clear errors for the next validation
            );

            // ### → -> -> Expand each member who have the 'doctor' role to include doctor information <- <- <-
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
      // throw an error if the role does not exist
      validate.throwError(
        ``,
        `Please, ensure all fields are correctly filled and try again`,
        [
          {
            code: `MISSING_MEMBER_ROLE`,
            message: `The role property is required to expand the result.`,
            field: `role`,
            location: "query",
            status: 400,
          },
        ]
      );
    }
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
