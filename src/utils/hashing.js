import bcrypt from "bcrypt";

// ### → -> -> This function will generate and return a hashed string from the given data. <- <- <-

const generateHash = async (payload, saltRound = 10) => {
  const salt = await bcrypt.genSalt(saltRound);

  return bcrypt.hash(payload, salt);
};

// ### → -> -> This function will compare between given data and a hashed string. <- <- <-

const compareHash = async (raw, hash) => {
  return await bcrypt.compare(raw, hash);
};

export default {
  generateHash,
  compareHash,
};
