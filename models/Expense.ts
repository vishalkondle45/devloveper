import { Document, Model, Schema, Types, model, models } from "mongoose";

interface ExpenseDocument extends Document {
  description: String;
  category: "food" | "drink" | "fuel" | "rent" | "transportation" | "general";
  date: Date;
  group: Types.ObjectId;
  user: Types.ObjectId;
  isMultiPayer: Boolean;
  isSettelment: Boolean;
  amount: Number;
}

const groupSchema = new Schema<ExpenseDocument>(
  {
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ["food", "drink", "fuel", "rent", "transportation", "general"],
      default: "food",
    },
    date: { type: Date, default: new Date() },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isMultiPayer: { type: Boolean, default: false },
    isSettelment: { type: Boolean, default: false },
    amount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ExpenseModel = models.Expense || model("Expense", groupSchema);

export default ExpenseModel as Model<ExpenseDocument>;
