import { Document, Model, Schema, Types, model, models } from "mongoose";

interface AnswerDocument extends Document {
  answer: string;
  forum?: Types.ObjectId;
  user?: Types.ObjectId;
  upvotes?: Types.ObjectId[];
  downvotes?: Types.ObjectId[];
}

const forumSchema = new Schema<AnswerDocument>(
  {
    answer: { type: String, required: true },
    forum: { type: Types.ObjectId, required: true, trim: true, ref: "Forum" },
    user: { type: Types.ObjectId, required: false, ref: "User" },
    upvotes: { type: [Types.ObjectId], default: [] },
    downvotes: { type: [Types.ObjectId], default: [] },
  },
  { timestamps: true }
);

const AnswerModel = models.Answer || model("Answer", forumSchema);

export default AnswerModel as Model<AnswerDocument>;
