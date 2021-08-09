import { IUser } from '../../custom/interfaces/user.interface';
import { userActionTypes } from '../action-types/user.action.types';

interface UserLoginRequestAction {
  type: userActionTypes.USER_LOGIN_REQUEST;
}

interface UserLoginSuccessAction {
  type: userActionTypes.USER_LOGIN_SUCCESS;
  payload: IUser;
}

interface UserLoginFailAction {
  type: userActionTypes.USER_LOGIN_FAIL;
  payload: string;
}

interface UserRegisterRequestAction {
  type: userActionTypes.USER_REGISTER_REQUEST;
}

interface UserRegisterSuccessAction {
  type: userActionTypes.USER_REGISTER_SUCCESS;
  payload: IUser;
}

interface UserRegisterFailAction {
  type: userActionTypes.USER_REGISTER_FAIL;
  payload: string;
}

interface UserLogoutAction {
  type: userActionTypes.USER_LOGOUT;
}

interface UserDetailsRequestAction {
  type: userActionTypes.USER_DETAILS_REQUEST;
}

interface UserDetailsSuccessAction {
  type: userActionTypes.USER_DETAILS_SUCCESS;
  payload: Partial<IUser>;
}

interface UserDetailsFailAction {
  type: userActionTypes.USER_DETAILS_FAIL;
  payload: string;
}

interface UserDetailsResetAction {
  type: userActionTypes.USER_DETAILS_RESET;
}

interface UserUpdateProfileRequestAction {
  type: userActionTypes.USER_UPDATE_PROFILE_REQUEST;
}

interface UserUpdateProfileSuccessAction {
  type: userActionTypes.USER_UPDATE_PROFILE_SUCCESS;
  payload: IUser;
}

interface UserUpdateProfileFailAction {
  type: userActionTypes.USER_UPDATE_PROFILE_FAIL;
  payload: string;
}

interface UserUpdateProfileResetAction {
  type: userActionTypes.USER_UPDATE_PROFILE_RESET;
}

interface UserListRequestAction {
  type: userActionTypes.USER_LIST_REQUEST;
}

interface UserListSuccessAction {
  type: userActionTypes.USER_LIST_SUCCESS;
  payload: IUser[];
}

interface UserListFailAction {
  type: userActionTypes.USER_LIST_FAIL;
  payload: string;
}

interface AdminAddRequestAction {
  type: userActionTypes.ADMIN_ADD_REQUEST;
}

interface AdminAddSuccessAction {
  type: userActionTypes.ADMIN_ADD_SUCCESS;
  payload: IUser;
}

interface AdminAddFailAction {
  type: userActionTypes.ADMIN_ADD_FAIL;
  payload: string;
}

interface DeputyAddRequestAction {
  type: userActionTypes.DEPUTY_ADD_REQUEST;
}

interface DeputyAddSuccessAction {
  type: userActionTypes.DEPUTY_ADD_SUCCESS;
  payload: IUser;
}

interface DeputyAddFailAction {
  type: userActionTypes.DEPUTY_ADD_FAIL;
  payload: string;
}

export type UserLoginAction =
  | UserLoginRequestAction
  | UserLoginSuccessAction
  | UserLoginFailAction
  | UserLogoutAction;

export type UserRegisterAction =
  | UserRegisterRequestAction
  | UserRegisterSuccessAction
  | UserRegisterFailAction
  | UserLogoutAction;

export type UserDetailsAction =
  | UserDetailsRequestAction
  | UserDetailsSuccessAction
  | UserDetailsFailAction
  | UserDetailsResetAction;

export type UserUpdateProfileAction =
  | UserUpdateProfileRequestAction
  | UserUpdateProfileSuccessAction
  | UserUpdateProfileFailAction
  | UserUpdateProfileResetAction;

export type UserListAction =
  | UserListRequestAction
  | UserListSuccessAction
  | UserListFailAction;

export type AdminAddAction =
  | AdminAddRequestAction
  | AdminAddSuccessAction
  | AdminAddFailAction;

export type DeputyAddAction =
  | DeputyAddRequestAction
  | DeputyAddSuccessAction
  | DeputyAddFailAction;
