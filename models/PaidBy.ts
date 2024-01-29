import { Document, Model, Schema, Types, model, models } from "mongoose";

interface PaidByDocument extends Document {
  group: Types.ObjectId;
  expense: Types.ObjectId;
  user: Types.ObjectId;
  amount: number;
}

const paidBySchema = new Schema<PaidByDocument>(
  {
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    expense: { type: Schema.Types.ObjectId, ref: "Expense" },
    user: { type: Schema.Types.ObjectId, ref: "Expense" },
    amount: { type: Number, default: 0, required: true },
  },
  { timestamps: true }
);

const PaidByModel = models.Paid || model("Paid", paidBySchema);

export default PaidByModel as Model<PaidByDocument>;
