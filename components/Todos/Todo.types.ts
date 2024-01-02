import { Types } from "mongoose";

export interface TodoType {
  todo: string;
  user?: Types.ObjectId;
  completed?: boolean;
  favorite?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
}
