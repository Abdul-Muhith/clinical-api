import validate from "../../../../libs/profile/validation.js";
import { create, getDTO } from "../../../../libs/profile/index.js";

/**
 * This function will destructure request body , call profile's service to a new profile and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const createProfile = async (req, res, next) => {
  // ### → -> -> destructure the request body <- <- <-
  const { member, gender, age, bloodGroup, address } = req.body;

  const photo = req.files;

  try {
    // ### → -> -> Input validation <- <- <-
    validate.requiredFields({ member, gender }); // If there are errors, throw the errors

    // ### → -> -> Invoke the service function <- <- <-
    const { getProfile } = await create({
      member,
      gender,
      age: JSON.parse(age),
      bloodGroup,
      photo,
      address: JSON.parse(address),
    });

    // ### → -> -> Generate necessary responses <- <- <-
    const profileDTO = getDTO(getProfile);

    const getUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    return res.status(201).json({
      code: 201,
      message: "Profile creation was completed successfully.",
      data: profileDTO,
      links: {
        self: getUrl,
        profile: `${getUrl}/${profileDTO.id}`,
        member: `${getUrl.replace(`-profiles`, `s/local`)}/${member}`,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default createProfile;
