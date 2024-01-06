import { Types } from "mongoose";
import { TodoUpdateTypes } from "../../Todo.types";

export interface DueDateProps {
  update: (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => Promise<void>;
  todo: TodoUpdateTypes | null;
}
