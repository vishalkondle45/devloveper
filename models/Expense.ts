import { ExpenseCategoryTypes } from "@/lib/constants";
import { Document, Model, Schema, Types, model, models } from "mongoose";

interface ExpenseDocument extends Document {
  description: String;
  category:
    | "food"
    | "drinks"
    | "groceries"
    | "bills"
    | "shopping"
    | "entertainment"
    | "transfer"
    | "travel"
    | "fuel"
    | "health"
    | "emi"
    | "investment"
    | "general";
  date: Date;
  group: Types.ObjectId;
  user: Types.ObjectId;
  isSettelment: Boolean;
  price: Number;
}

const groupSchema = new Schema<ExpenseDocument>(
  {
    description: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        "food",
        "drinks",
        "groceries",
        "bills",
        "shopping",
        "entertainment",
        "transfer",
        "travel",
        "fuel",
        "health",
        "emi",
        "investment",
        "general",
      ],
      default: "general",
    },
    date: { type: Date, default: new Date() },
    group: { type: Schema.Types.ObjectId, ref: "Group" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    isSettelment: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ExpenseModel = models.Expense || model("Expense", groupSchema);

export default ExpenseModel as Model<ExpenseDocument>;
