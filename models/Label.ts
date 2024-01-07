import { Document, Model, Schema, Types, model, models } from "mongoose";

interface LabelDocument extends Document {
  title?: string;
  user?: Types.ObjectId;
}

const labelSchema = new Schema<LabelDocument>(
  {
    title: { type: String, required: true, trim: true },
    user: { type: "ObjectId", required: false },
  },
  { timestamps: true }
);

const LabelModel = models.Label || model("Label", labelSchema);

export default LabelModel as Model<LabelDocument>;
