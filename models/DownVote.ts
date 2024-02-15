import { Document, Model, Schema, Types, model, models } from "mongoose";

interface DownVoteDocument extends Document {
  forum?: string;
  user?: Types.ObjectId;
}

const forumSchema = new Schema<DownVoteDocument>(
  {
    forum: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false, ref: "User" },
  },
  { timestamps: true }
);

const DownVoteModel = models.DownVote || model("DownVote", forumSchema);

export default DownVoteModel as Model<DownVoteDocument>;
