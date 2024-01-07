import { Document, Model, Schema, Types, model, models } from "mongoose";

interface TodoListDocument extends Document {
  title: string;
  color?: string;
  user: Types.ObjectId;
}

const todoListSchema = new Schema<TodoListDocument>(
  {
    title: { type: String, required: true, trim: true },
    color: { type: String, required: false, trim: true },
    user: { type: "ObjectId", required: true },
  },
  { timestamps: true }
);

const TodoListModel = models.TodoList || model("TodoList", todoListSchema);

export default TodoListModel as Model<TodoListDocument>;
