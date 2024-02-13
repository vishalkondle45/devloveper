import { Document, Model, Schema, Types, model, models } from "mongoose";

interface SplitAmongDocument extends Document {
  group: Types.ObjectId;
  expense: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
}

const splitAmongSchema = new Schema<SplitAmongDocument>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    expense: { type: Schema.Types.ObjectId, ref: "Expense" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const SplitAmongModel = models.Split || model("Split", splitAmongSchema);

export default SplitAmongModel as Model<SplitAmongDocument>;
