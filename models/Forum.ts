import { Document, Model, Schema, Types, model, models } from "mongoose";

interface ForumDocument extends Document {
  question?: string;
  description?: string;
  user?: Types.ObjectId;
  tags: string[];
  likes?: number;
  views?: number;
  answers?: number;
}

const forumSchema = new Schema<ForumDocument>(
  {
    question: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false, ref: "User" },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ForumModel = models.Forum || model("Forum", forumSchema);

export default ForumModel as Model<ForumDocument>;
