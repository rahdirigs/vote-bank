export interface IUser {
  _id: string;
  name: string;
  username: string;
  contact: string;
  isAdmin: boolean;
  isDeputy: boolean;
  pincode: string;
  token: string;
}

export interface IUserUpdate {
  id: string;
  username?: string;
  password?: string;
  contact?: string;
  pincode?: string;
}
