import { Schema } from "mongoose";
import { hashPassword } from "./user.methods";
import { IUserDocument, IUserModel } from "./user.types";

const UserSchema = new Schema<IUserDocument, IUserModel>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    isDeputy: {
      type: Boolean,
      required: true,
      default: false,
    },
    pincode: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", hashPassword);

export default UserSchema;
