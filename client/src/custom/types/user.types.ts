import { IUser } from '../interfaces/user.interface';

export type userLoginState = {
  loading?: boolean;
  userInfo?: IUser;
  error?: string;
};

export type userDetailsState = {
  loading?: boolean;
  user?: Partial<IUser>;
  error?: string;
};

export type userUpdateProfileState = {
  loading?: boolean;
  userInfo?: IUser;
  success?: boolean;
  error?: string;
};

export type userListState = {
  loading?: boolean;
  users: IUser[];
  error?: string;
};

export type adminAddState = {
  loading?: boolean;
  user?: IUser;
  success?: boolean;
  error?: string;
};
