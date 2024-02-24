import { Document, Model, Schema, Types, model, models } from "mongoose";

interface UpVoteDocument extends Document {
  forum?: Types.ObjectId;
  user?: Types.ObjectId;
}

const forumSchema = new Schema<UpVoteDocument>(
  {
    forum: {
      type: Types.ObjectId,
      required: true,
      trim: true,
      ref: "Forum" || "Answer",
    },
    user: { type: Types.ObjectId, required: false, ref: "User" },
  },
  { timestamps: true }
);

const UpVoteModel = models.UpVote || model("UpVote", forumSchema);

export default UpVoteModel as Model<UpVoteDocument>;
