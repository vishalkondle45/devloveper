import { Document, Model, Schema, Types, model, models } from "mongoose";

interface SavedDocument extends Document {
  forum?: string;
  user?: Types.ObjectId;
}

const forumSchema = new Schema<SavedDocument>(
  {
    forum: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false, ref: "User" },
  },
  { timestamps: true }
);

const SavedModel = models.Saved || model("Saved", forumSchema);

export default SavedModel as Model<SavedDocument>;
