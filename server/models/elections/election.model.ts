import { model } from "mongoose";
import ElectionSchema from "./election.schema";
import { IElectionDocument } from "./election.types";

export const Election = model<IElectionDocument>("Election", ElectionSchema);
