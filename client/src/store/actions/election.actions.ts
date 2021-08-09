import { IElection } from '../../custom/interfaces/election.interface';
import { electionActionTypes } from '../action-types/election.action.types';

interface ElectionListRequestAction {
  type: electionActionTypes.ELECTION_LIST_REQUEST;
}

interface ElectionListSuccessAction {
  type: electionActionTypes.ELECTION_LIST_SUCCESS;
  payload: IElection[];
}

interface ElectionListFailAction {
  type: electionActionTypes.ELECTION_LIST_FAIL;
  payload: string;
}

interface ElectionCreateRequestAction {
  type: electionActionTypes.ELECTION_CREATE_REQUEST;
}

interface ElectionCreateSuccessAction {
  type: electionActionTypes.ELECTION_CREATE_SUCCESS;
  payload: IElection;
}

interface ElectionCreateFailAction {
  type: electionActionTypes.ELECTION_CREATE_FAIL;
  payload: string;
}

interface ElectionCreateResetAction {
  type: electionActionTypes.ELECTION_CREATE_RESET;
}

interface ElectionEndRequestAction {
  type: electionActionTypes.ELECTION_END_REQUEST;
}

interface ElectionEndSuccessAction {
  type: electionActionTypes.ELECTION_END_SUCCESS;
  payload: IElection;
}

interface ElectionEndFailAction {
  type: electionActionTypes.ELECTION_END_FAIL;
  payload: string;
}

export type ElectionEndAction =
  | ElectionEndRequestAction
  | ElectionEndSuccessAction
  | ElectionEndFailAction;

export type ElectionListAction =
  | ElectionListRequestAction
  | ElectionListSuccessAction
  | ElectionListFailAction;

export type ElectionCreateAction =
  | ElectionCreateRequestAction
  | ElectionCreateSuccessAction
  | ElectionCreateFailAction
  | ElectionCreateResetAction;
