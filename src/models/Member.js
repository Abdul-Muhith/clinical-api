import { Schema, model } from "mongoose";

const memberSchema = new Schema(
  {
    username: {
      type: String,
      required: false,
      minLength: [3, `The username must be at least 3 characters long.`],
      maxLength: [20, `The username must not exceed 20 characters.`],
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+8801[0-9]{9}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    password: {
      type: String,
      required: false,
      minlength: [8, `The password must be at least 3 characters long.`],
      maxLength: [100, `The password must not exceed 100 characters.`],
      validate: {
        validator: function (v) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}:"<>?\[\];',.\/`~])[A-Za-z\d!@#$%^&*()_+{}:"<>?\[\];',.\/`~]+$/.test(
            v
          );
        },
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character.",
      },
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "nurse", "doctor", "administrator"],
      default: "user",
    },
    status: {
      type: String,
      required: true,
      enum: ["active", "disabled", "request changed", "pending"],
      default: "pending",
    },
    token: {
      type: String,
      require: false,
    },
    issuedIp: {
      type: String,
      require: false,
    },
  },
  {
    timestamps: true,
    required: true,
  }
);

// Create a partial index for unique phone numbers (only when phone is not null)
memberSchema.index(
  { phone: 1 },
  {
    unique: true,
    partialFilterExpression: { phone: { $exists: true, $ne: null } },
  }
);

const Member = model("Member", memberSchema);

export default Member;
