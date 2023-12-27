import { Types } from "mongoose";

export interface TagType {
  _id?: Types.ObjectId;
  title?: string;
}

export interface Props {
  opened: boolean;
  getTags: () => void;
  tag: TagType | null;
  editClose: () => void;
}
