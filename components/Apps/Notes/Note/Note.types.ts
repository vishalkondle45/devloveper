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
  updateNote?: (_id: Types.ObjectId, values: any) => Promise<void>;
  cloneNote?: (values: any) => Promise<void>;
  deleteNote: (_id: Types.ObjectId) => Promise<void>;
  recoverNote?: (_id: Types.ObjectId) => Promise<void>;
  editNote?: (note: NoteType) => void;
}
