import axios from 'axios';
import { Dispatch } from 'redux';
import { IUserUpdate } from '../../custom/interfaces/user.interface';
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
import { RootState } from '../root.reducer';

export const login =
  (username: string, password: string) =>
  async (dispatch: Dispatch<UserLoginAction>) => {
    try {
      dispatch({ type: userActionTypes.USER_LOGIN_REQUEST });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users/login',
        { username, password },
        config
      );
      dispatch({ type: userActionTypes.USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: userActionTypes.USER_LOGIN_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const logout =
  () =>
  async (
    dispatch: Dispatch<
      | UserLoginAction
      | UserRegisterAction
      | UserDetailsAction
      | UserUpdateProfileAction
    >
  ) => {
    dispatch({ type: userActionTypes.USER_LOGOUT });
    dispatch({ type: userActionTypes.USER_DETAILS_RESET });
    dispatch({ type: userActionTypes.USER_UPDATE_PROFILE_RESET });
    localStorage.removeItem('userInfo');
    document.location.href = '/login';
  };

export const register =
  (
    name: string,
    username: string,
    password: string,
    contact: string,
    pincode: string
  ) =>
  async (dispatch: Dispatch<UserRegisterAction | UserLoginAction>) => {
    try {
      dispatch({ type: userActionTypes.USER_REGISTER_REQUEST });
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/users',
        { name, username, password, contact, pincode },
        config
      );
      dispatch({ type: userActionTypes.USER_REGISTER_SUCCESS, payload: data });
      dispatch({ type: userActionTypes.USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: userActionTypes.USER_REGISTER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getUserDetails =
  (id: string) =>
  async (dispatch: Dispatch<UserDetailsAction>, getState: () => RootState) => {
    try {
      dispatch({ type: userActionTypes.USER_DETAILS_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get(`/api/users/${id}`, config);
      dispatch({ type: userActionTypes.USER_DETAILS_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: userActionTypes.USER_DETAILS_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateUserProfile =
  (user: IUserUpdate) =>
  async (
    dispatch: Dispatch<UserUpdateProfileAction | UserLoginAction>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: userActionTypes.USER_UPDATE_PROFILE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.put('/api/users/profile', user, config);
      dispatch({
        type: userActionTypes.USER_UPDATE_PROFILE_SUCCESS,
        payload: data,
      });
      dispatch({ type: userActionTypes.USER_LOGIN_SUCCESS, payload: data });
      localStorage.setItem('userInfo', JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: userActionTypes.USER_UPDATE_PROFILE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listUsers =
  () =>
  async (dispatch: Dispatch<UserListAction>, getState: () => RootState) => {
    try {
      dispatch({ type: userActionTypes.USER_LIST_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.get('/api/users', config);
      dispatch({ type: userActionTypes.USER_LIST_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: userActionTypes.USER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addAdmin =
  (
    name: string,
    username: string,
    password: string,
    contact: string,
    pincode: string,
    isAdmin: boolean
  ) =>
  async (dispatch: Dispatch<AdminAddAction>, getState: () => RootState) => {
    try {
      dispatch({ type: userActionTypes.ADMIN_ADD_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/users/admin',
        { name, username, password, contact, pincode, isAdmin },
        config
      );

      dispatch({ type: userActionTypes.ADMIN_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: userActionTypes.ADMIN_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const addDeputy =
  (
    name: string,
    username: string,
    password: string,
    contact: string,
    pincode: string,
    isDeputy: boolean
  ) =>
  async (dispatch: Dispatch<DeputyAddAction>, getState: () => RootState) => {
    try {
      dispatch({ type: userActionTypes.DEPUTY_ADD_REQUEST });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/users/deputy',
        { name, username, password, contact, pincode, isDeputy },
        config
      );

      dispatch({ type: userActionTypes.DEPUTY_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: userActionTypes.DEPUTY_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
