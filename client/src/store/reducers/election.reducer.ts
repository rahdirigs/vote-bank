import {
  electionCreateState,
  electionListState,
} from '../../custom/types/election.types';
import { electionActionTypes } from '../action-types/election.action.types';
import {
  ElectionCreateAction,
  ElectionEndAction,
  ElectionListAction,
} from '../actions/election.actions';

export const electionListReducer = (
  state: electionListState = { elections: [] },
  action: ElectionListAction
): electionListState => {
  switch (action.type) {
    case electionActionTypes.ELECTION_LIST_REQUEST:
      return { loading: true, elections: [] };
    case electionActionTypes.ELECTION_LIST_SUCCESS:
      return { loading: false, elections: action.payload };
    case electionActionTypes.ELECTION_LIST_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};

export const electionCreateReducer = (
  state: electionCreateState = {},
  action: ElectionCreateAction
): electionCreateState => {
  switch (action.type) {
    case electionActionTypes.ELECTION_CREATE_REQUEST:
      return { loading: true };
    case electionActionTypes.ELECTION_CREATE_SUCCESS:
      return { loading: false, success: true, election: action.payload };
    case electionActionTypes.ELECTION_CREATE_FAIL:
      return { loading: false, error: action.payload };
    case electionActionTypes.ELECTION_CREATE_RESET:
      return {};
    default:
      return state;
  }
};

export const electionEndReducer = (
  state: electionCreateState = {},
  action: ElectionEndAction
): electionCreateState => {
  switch (action.type) {
    case electionActionTypes.ELECTION_END_REQUEST:
      return { loading: true };
    case electionActionTypes.ELECTION_END_SUCCESS:
      return { loading: false, election: action.payload, success: true };
    case electionActionTypes.ELECTION_END_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
