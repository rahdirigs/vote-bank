import { Document, Model } from "mongoose";

interface IUser {
  name: string;
  username: string;
  password: string;
  contact: string;
  isAdmin: boolean;
  isDeputy: boolean;
  pincode: string;
}

export interface IUserDocument extends IUser, Document {
  hashPassword: (this: IUserDocument) => Promise<void>;
}

export interface IUserModel extends Model<IUserDocument> {}
