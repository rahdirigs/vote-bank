import { Schema } from "mongoose";
import { IElectionDocument, IElectionModel } from "./election.types";

const ElectionSchema = new Schema<IElectionDocument, IElectionModel>(
  {
    owner: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    ongoing: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export default ElectionSchema;
