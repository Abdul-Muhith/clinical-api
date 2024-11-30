import { Schema, Types, model } from "mongoose";

const profileSchema = new Schema(
  {
    member: {
      type: Types.ObjectId,
      required: true,
      unique: true,
      ref: "Member",
    },
    gender: {
      type: String,
      required: true,
      lowercase: true,
      enum: ["male", "female", "other"],
    },
    age: {
      type: Number,
      min: 1,
    },
    bloodGroup: {
      type: String,
      lowercase: true,
      enum: ["a+", "a-", "b+", "b-", "ab+", "ab-", "o+", "o-"],
    },
    photo: {
      caption: {
        type: String,
        // required: true,
        // trim: true,
      },
      imageAlt: {
        type: String,
      },
      assetId: {
        type: String,
        // required: true,
        // unique: true,
      },
      publicId: {
        type: String,
        // required: true,
        // unique: true,
      },
      width: {
        type: Number,
      },
      height: {
        type: Number,
      },
      folder: {
        type: String,
      },
      type: {
        type: String,
        // required: true,
        enum: ["image", "video", "other"],
      },
      format: {
        type: String,
        // required: true,
        enum: ["jpg", "png", "gif", "jpeg", "webp"],
      },
      size: {
        type: Number,
      },
      url: {
        type: String,
        // required: true,
        match: [/^https?:\/\/[^\s]+$/, "Please enter a valid URL"],
      },
    },
    address: {
      village: {
        type: String,
      },
      postOffice: {
        type: String,
      },
      postalCode: {
        type: Number,
      },
      thana: {
        type: String,
      },
      district: {
        type: String,
      },
      division: {
        type: String,
      },
      country: {
        type: String,
      },
    },
  },
  {
    timestamps: true,
    required: true,
  }
);

const Profile = model("Profile", profileSchema);

export default Profile;
