import { IElection } from '../interfaces/election.interface';

export type electionListState = {
  elections?: IElection[];
  loading?: boolean;
  error?: string;
};

export type electionCreateState = {
  election?: IElection;
  loading?: boolean;
  error?: string;
  success?: boolean;
};
