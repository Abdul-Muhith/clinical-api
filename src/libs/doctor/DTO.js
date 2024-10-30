const DTO = (doctor = {}, member = {}) => {
  let result = {};

  if (doctor && typeof doctor === "object") {
    result = {
      id: doctor.id,
      member: doctor.member,
      traceId: doctor.traceId,
      specialty: doctor.specialty,
      conditions: doctor.conditions,
      availability: doctor.availability,
      created_at: doctor.createdAt,
      updated_at: doctor.updatedAt,
    };
  }

  if (member && typeof member === "object") {
    result = {
      ...result,
      username: member.username,
      phone: member.phone,
      email: member.email,
      role: member.role,
      status: member.status,
    };
  }

  return result;
};

export default DTO;
