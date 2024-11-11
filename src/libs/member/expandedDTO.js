const expandedDTO = (payload = {}) => {
  if (payload && typeof payload === "object") {
    return {
      id: payload.id,
      // member: payload.member,
      username: payload.username,
      phone: payload.phone,
      email: payload.email,
      traceId: payload.traceId,
      specialty: payload.specialty,
      conditions: payload.conditions,
      availability: payload.availability,
      role: payload.role,
      status: payload.status,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    };
  }
};

export default expandedDTO;
