import { Schema, model } from "mongoose";

const memberSchema = new Schema(
  {
    username: {
      type: String,
      minLength: [3, `The username must be at least 3 characters long.`],
      maxLength: [20, `The username must not exceed 20 characters.`],
      required: false,
    },
    phone: {
      type: String,
      required: false,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\+8801[0-9]{8}$/.test(v);
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
      required: true,
      minlength: 8,
      maxLength: 20,
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
  },
  {
    timestamps: true,
    required: true,
  }
);

const Member = model("Member", memberSchema);

export default Member;
