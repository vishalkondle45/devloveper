import { Types } from "mongoose";

export interface LabelType {
  _id?: Types.ObjectId;
  title?: string;
}

export interface Props {
  opened: boolean;
  getLabels: () => void;
  label: LabelType | null;
  editClose: () => void;
}
