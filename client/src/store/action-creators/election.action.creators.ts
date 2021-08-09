import axios from 'axios';
import { Dispatch } from 'redux';
import { electionActionTypes } from '../action-types/election.action.types';
import {
  ElectionCreateAction,
  ElectionEndAction,
  ElectionListAction,
} from '../actions/election.actions';
import { RootState } from '../root.reducer';

export const listElections =
  () =>
  async (dispatch: Dispatch<ElectionListAction>, getState: () => RootState) => {
    try {
      dispatch({ type: electionActionTypes.ELECTION_LIST_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.get('/api/elections', config);
      dispatch({
        type: electionActionTypes.ELECTION_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: electionActionTypes.ELECTION_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const createElection =
  (owner: string, title: string, description: string) =>
  async (
    dispatch: Dispatch<ElectionCreateAction>,
    getState: () => RootState
  ) => {
    try {
      dispatch({ type: electionActionTypes.ELECTION_CREATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
          'Content-Type': 'application/json',
        },
      };
      const { data } = await axios.post(
        '/api/elections',
        { owner, title, description },
        config
      );
      dispatch({
        type: electionActionTypes.ELECTION_CREATE_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: electionActionTypes.ELECTION_CREATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const endElection =
  (id: string) =>
  async (dispatch: Dispatch<ElectionEndAction>, getState: () => RootState) => {
    try {
      dispatch({ type: electionActionTypes.ELECTION_END_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo?.token}`,
        },
      };
      const { data } = await axios.put(`/api/elections/${id}`, {}, config);
      dispatch({
        type: electionActionTypes.ELECTION_END_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: electionActionTypes.ELECTION_END_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
