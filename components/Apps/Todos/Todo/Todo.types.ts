import { Types } from "mongoose";
import { TodoType, TodoUpdateTypes } from "../Todo.types";

export interface TodoProps {
  todo: TodoType;
  getTodos: () => Promise<void>;
  editTodo: (todo: TodoType) => void;
  update: (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => Promise<void>;
  withMyDay?: boolean;
  withDueDate?: boolean;
  withListName?: boolean;
}
