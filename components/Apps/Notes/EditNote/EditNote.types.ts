import { Types } from "mongoose";

export interface NoteType {
  _id?: Types.ObjectId;
  title?: string;
  note: string;
  user?: Types.ObjectId;
  color?: string;
  pinned?: boolean;
  trashed?: boolean;
  labels?: Types.ObjectId[] | null;
}

export interface Props {
  opened: boolean;
  getNotes: () => void;
  note: NoteType | null;
  editClose: () => void;
}
