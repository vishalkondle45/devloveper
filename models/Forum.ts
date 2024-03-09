import { Document, Model, Schema, Types, model, models } from "mongoose";

interface ForumDocument extends Document {
  question?: string;
  description?: string;
  user?: Types.ObjectId;
  tags: string[];
  upvotes?: Types.ObjectId[];
  downvotes?: Types.ObjectId[];
  views?: Types.ObjectId[];
  saved?: Types.ObjectId[];
  answers?: number;
}

const forumSchema = new Schema<ForumDocument>(
  {
    question: { type: String, required: true, trim: true },
    description: { type: String, required: false, trim: true },
    user: { type: Types.ObjectId, required: false, ref: "User" },
    tags: [{ type: String }],
    views: { type: [Types.ObjectId], default: [] },
    upvotes: { type: [Types.ObjectId], default: [] },
    downvotes: { type: [Types.ObjectId], default: [] },
    saved: { type: [Types.ObjectId], default: [] },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ForumModel = models.Forum || model("Forum", forumSchema);

export default ForumModel as Model<ForumDocument>;
