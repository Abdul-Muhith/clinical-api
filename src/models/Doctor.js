import { Schema, Types, model } from "mongoose";

const doctorSchema = new Schema(
  {
    member: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      ref: "Member",
    },
    traceId: {
      type: String,
      required: true,
      unique: true,
    },
    specialty: {
      type: [String],
      required: false,
    },
    conditions: {
      type: [String],
      required: false,
    },
    availability: {
      type: [
        {
          day: {
            type: String,
            required: true,
            enum: [
              "Saturday",
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
            ],
          },
          startTime: {
            type: String,
            required: true,
          },
          endTime: {
            type: String,
            required: true,
          },
        },
      ],
      required: false,
    },
  },
  {
    timestamps: true,
    required: true,
  }
);

const Doctor = model("Doctor", doctorSchema);

export default Doctor;
