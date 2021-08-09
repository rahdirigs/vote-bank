import { Document, Model } from "mongoose";

interface IElection {
  owner: string;
  title: string;
  description: string;
  ongoing: boolean;
}

export interface IElectionDocument extends IElection, Document {}
export interface IElectionModel extends Model<IElectionDocument> {}
