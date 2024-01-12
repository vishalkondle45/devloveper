import mongoose, { Types } from "mongoose";

export interface TodoType {
  _id?: mongoose.Types.ObjectId;
  todo: string;
  user?: Types.ObjectId;
  important?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
  category?: Array<any | null> | any;
  note?: string;
  list?: string;
}

export interface TodoUpdateTypes {
  _id?: mongoose.Types.ObjectId;
  todo?: string;
  user?: Types.ObjectId;
  important?: boolean;
  myday?: boolean;
  completedOn?: string;
  date?: string;
  category?: Array<any | null> | any;
  note?: string;
  list?: string;
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
  remove: (object: TodoUpdateTypes | null) => Promise<void> | void;
}
