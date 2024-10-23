const DTO = (payload = {}) => {
  if (payload && typeof payload === "object") {
    return {
      id: payload.id,
      username: payload.username,
      phone: payload.phone,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    };
  }
};

export default DTO;
