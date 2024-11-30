const DTO = (payload = {}) => {
  if (payload && typeof payload === "object") {
    return {
      id: payload.id,
      member: payload.member,
      gender: payload.gender,
      age: payload.age,
      bloodGroup: payload.bloodGroup,
      photo: payload.photo,
      address: payload.address,
      created_at: payload.createdAt,
      updated_at: payload.updatedAt,
    };
  }
};

export default DTO;
