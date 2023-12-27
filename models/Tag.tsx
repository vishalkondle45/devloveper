import { Document, Model, Schema, Types, model, models } from "mongoose";

interface TagDocument extends Document {
  title?: string;
  user?: Types.ObjectId;
}

const tagSchema = new Schema<TagDocument>(
  {
    title: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false },
  },
  { timestamps: true }
);

const TagModel = models.Tag || model("Tag", tagSchema);

export default TagModel as Model<TagDocument>;
