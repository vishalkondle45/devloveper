import { Document, Model, Schema, Types, model, models } from "mongoose";

interface AnswerDocument extends Document {
  answer: string;
  forum?: Types.ObjectId;
  user?: Types.ObjectId;
  votes?: number;
}

const forumSchema = new Schema<AnswerDocument>(
  {
    answer: { type: String, required: true },
    forum: { type: Types.ObjectId, required: true, trim: true, ref: "Forum" },
    user: { type: Types.ObjectId, required: false, ref: "User" },
    votes: { type: Number, required: false, default: 0 },
  },
  { timestamps: true }
);

const AnswerModel = models.Answer || model("Answer", forumSchema);

export default AnswerModel as Model<AnswerDocument>;
