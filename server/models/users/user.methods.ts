import { genSalt, hashSync } from "bcryptjs";
import { IUserDocument } from "./user.types";

export async function hashPassword(this: IUserDocument, next: any) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await genSalt(10);
  this.password = hashSync(this.password, salt);
}
