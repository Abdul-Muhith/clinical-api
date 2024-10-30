import doctorValidate from "../../../../libs/doctor/validation.js";
import doctorService from "../../../../libs/doctor/index.js";

/**
 * This function will destructure request body , call doctor's service to designate a previously registered member as a doctor, or register a new one and generate necessary responses.
 * @returns object of status, code, message, data and links
 * @param {*} req, res, next
 */
const create = async (req, res, next) => {
  // ### → -> -> destructure the request body <- <- <-
  const {
    member,
    username,
    phone,
    email,
    specialty,
    conditions,
    availability,
  } = req.body;

  try {
    // ### → -> -> Input validation <- <- <-
    doctorValidate.requiredFields({ member, email }); // If there are errors, throw the errors

    // ### → -> -> Invoke the service function <- <- <-
    const { getMember, getDoctor } = await doctorService.create({
      member,
      username,
      phone,
      email,
      specialty,
      conditions,
      availability,
    });

    // ### → -> -> Generate necessary responses <- <- <-
    const doctorDTO = doctorService.getDTO(getDoctor, getMember);

    return res.status(201).json({
      code: 201,
      message: "Doctor creation was completed successfully.",
      data: doctorDTO,
      links: {
        self: `${req.protocol}://${req.get("host")}${req.originalUrl}`,
        doctors: `${req.protocol}://${req.get("host")}${req.originalUrl}/local`,
        users: `${req.protocol}://${req.get("host")}/api/v1/users/local`,
      },
    });
  } catch (e) {
    next(e);
  }
};

export default create;
