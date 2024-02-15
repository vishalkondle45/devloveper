import { Document, Model, Schema, Types, model, models } from "mongoose";

interface UpVoteDocument extends Document {
  forum?: string;
  user?: Types.ObjectId;
}

const forumSchema = new Schema<UpVoteDocument>(
  {
    forum: { type: String, required: true, trim: true },
    user: { type: Types.ObjectId, required: false, ref: "User" },
  },
  { timestamps: true }
);

const UpVoteModel = models.UpVote || model("UpVote", forumSchema);

export default UpVoteModel as Model<UpVoteDocument>;
