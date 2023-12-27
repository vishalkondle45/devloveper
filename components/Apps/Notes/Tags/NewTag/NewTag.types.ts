import { Types } from "mongoose";

export interface Values {
  _id?: Types.ObjectId;
  title: string;
}
export interface Props {
  getTags: () => void;
}
