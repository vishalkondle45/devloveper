import { Document, Model, Schema, Types, model, models } from "mongoose";

interface TodoDocument extends Document {
  todo: string;
  user?: Types.ObjectId;
  important: boolean;
  myday: boolean;
  completedOn: string;
  date: string;
  category: Array<any | null> | any;
  note: string;
  list: string;
}

const todoSchema = new Schema<TodoDocument>(
  {
    todo: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: true },
    completedOn: { type: String, default: "" },
    important: { type: Boolean, default: false },
    myday: { type: Boolean, default: false },
    date: { type: String, default: "" },
    category: { type: Array, default: [] },
    note: { type: String, default: "" },
    list: { type: String, default: "" },
  },
  { timestamps: true }
);

const TodoModel = models.Todo || model("Todo", todoSchema);

export default TodoModel as Model<TodoDocument>;
