import mongoose, { Types } from "mongoose";

export interface TodoType {
  _id?: mongoose.Types.ObjectId;
  todo: string;
  user?: Types.ObjectId;
  favorite?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
}

export interface TodoUpdateTypes {
  _id?: mongoose.Types.ObjectId;
  todo?: string;
  user?: Types.ObjectId;
  favorite?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
}
