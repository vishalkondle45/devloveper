import { Types } from "mongoose";

export interface NoteType {
  _id: Types.ObjectId;
  title?: string;
  note: string;
  user: Types.ObjectId;
  color?: string;
  pinned: boolean;
  trashed: boolean;
}

export interface NoteProps {
  note: NoteType;
}
