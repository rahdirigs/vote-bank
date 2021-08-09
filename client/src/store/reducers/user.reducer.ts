import {
  adminAddState,
  userDetailsState,
  userListState,
  userLoginState,
  userUpdateProfileState,
} from '../../custom/types/user.types';
import { userActionTypes } from '../action-types/user.action.types';
import {
  AdminAddAction,
  DeputyAddAction,
  UserDetailsAction,
  UserListAction,
  UserLoginAction,
  UserRegisterAction,
  UserUpdateProfileAction,
} from '../actions/user.actions';

export const userLoginReducer = (
  state: userLoginState = {},
  action: UserLoginAction
): userLoginState => {
  switch (action.type) {
    case userActionTypes.USER_LOGIN_REQUEST:
      return { loading: true };
    case userActionTypes.USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case userActionTypes.USER_LOGIN_FAIL:
      return { loading: false, error: action.payload };
    case userActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userRegisterReducer = (
  state: userLoginState = {},
  action: UserRegisterAction
): userLoginState => {
  switch (action.type) {
    case userActionTypes.USER_REGISTER_REQUEST:
      return { loading: true };
    case userActionTypes.USER_REGISTER_SUCCESS:
      return { loading: false, userInfo: action.payload };
    case userActionTypes.USER_REGISTER_FAIL:
      return { loading: false, error: action.payload };
    case userActionTypes.USER_LOGOUT:
      return {};
    default:
      return state;
  }
};

export const userDetailsReducer = (
  state: userDetailsState = { user: {} },
  action: UserDetailsAction
): userDetailsState => {
  switch (action.type) {
    case userActionTypes.USER_DETAILS_REQUEST:
      return { ...state, loading: true };
    case userActionTypes.USER_DETAILS_SUCCESS:
      return { loading: false, user: action.payload };
    case userActionTypes.USER_DETAILS_FAIL:
      return { loading: false, error: action.payload };
    case userActionTypes.USER_DETAILS_RESET:
      return { user: {} };
    default:
      return state;
  }
};

export const userUpdateProfileReducer = (
  state: userUpdateProfileState = {},
  action: UserUpdateProfileAction
) => {
  switch (action.type) {
    case userActionTypes.USER_UPDATE_PROFILE_REQUEST:
      return { loading: true };
    case userActionTypes.USER_UPDATE_PROFILE_SUCCESS:
      return { loading: false, success: true, userInfo: action.payload };
    case userActionTypes.USER_UPDATE_PROFILE_FAIL:
      return { loading: false, error: action.payload };
    case userActionTypes.USER_UPDATE_PROFILE_RESET:
      return {};
    default:
      return state;
  }
};

export const userListReducer = (
  state: userListState = { users: [] },
  action: UserListAction
): userListState => {
  switch (action.type) {
    case userActionTypes.USER_LIST_REQUEST:
      return { loading: true, ...state };
    case userActionTypes.USER_LIST_SUCCESS:
      return { loading: false, users: action.payload };
    case userActionTypes.USER_LIST_FAIL:
      return { loading: false, error: action.payload, ...state };
    default:
      return state;
  }
};

export const adminAddReducer = (
  state: adminAddState = {},
  action: AdminAddAction
): adminAddState => {
  switch (action.type) {
    case userActionTypes.ADMIN_ADD_REQUEST:
      return { loading: true };
    case userActionTypes.ADMIN_ADD_SUCCESS:
      return { loading: false, success: true, user: action.payload };
    case userActionTypes.ADMIN_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const deputyAddReducer = (
  state: adminAddState = {},
  action: DeputyAddAction
): adminAddState => {
  switch (action.type) {
    case userActionTypes.DEPUTY_ADD_REQUEST:
      return { loading: true };
    case userActionTypes.DEPUTY_ADD_SUCCESS:
      return { loading: false, success: true, user: action.payload };
    case userActionTypes.DEPUTY_ADD_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
