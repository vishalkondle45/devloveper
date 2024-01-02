import { TodoType } from "../Todo.types";

export interface TodoProps {
  todo: TodoType;
  getTodos: () => Promise<void>;
}
