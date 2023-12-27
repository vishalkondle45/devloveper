import { Types } from "mongoose";

export interface Label {
  _id: Types.ObjectId;
  title: string;
}

export interface Props {
  labels?: Label[];
  label?: Types.ObjectId;
  updateLabel: (_id: Types.ObjectId | undefined) => void;
}
