import mongoose, { Types } from "mongoose";

export interface TodoType {
  _id?: mongoose.Types.ObjectId;
  todo: string;
  user?: Types.ObjectId;
  favorite?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
  category?: Array<any | null> | any;
  note?: string;
  list?: Types.ObjectId | any;
}

export interface TodoUpdateTypes {
  _id?: mongoose.Types.ObjectId;
  todo?: string;
  user?: Types.ObjectId;
  favorite?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
  category?: Array<any | null> | any;
  note?: string;
  list?: Types.ObjectId | any;
  createdAt?: string;
  updatedAt?: string;
}
export interface EditTodoProps {
  close: any;
  form: any;
  update: (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => Promise<void>;
  todo: TodoUpdateTypes | null;
  remove: (_id?: Types.ObjectId) => Promise<void> | void;
}
