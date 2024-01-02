import { Document, Model, Schema, Types, model, models } from "mongoose";

interface TodoDocument extends Document {
  todo: string;
  user?: Types.ObjectId;
  completed: string;
  favorite: boolean;
  myday: boolean;
  completedOn: string;
  date: string;
}

const todoSchema = new Schema<TodoDocument>(
  {
    todo: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: true },
    completed: { type: String, default: "" },
    favorite: { type: Boolean, default: false },
    myday: { type: Boolean, default: false },
    date: { type: String, default: "" },
  },
  { timestamps: true }
);

const TodoModel = models.Todo || model("Todo", todoSchema);

export default TodoModel as Model<TodoDocument>;
