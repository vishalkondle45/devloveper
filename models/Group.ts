import { Document, Model, Schema, Types, model, models } from "mongoose";

interface GroupDocument extends Document {
  title: String;
  type: "home" | "trip" | "office" | "sports" | "others";
  simplify: Boolean;
  user: Types.ObjectId;
  users: Types.ObjectId[];
}

const groupSchema = new Schema<GroupDocument>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ["home", "trip", "office", "sports", "others"],
      default: "home",
    },
    simplify: { type: Boolean, default: false },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    users: [{ type: Schema.Types.ObjectId, default: [], ref: "User" }],
  },
  { timestamps: true }
);

const GroupModel = models.Group || model("Group", groupSchema);

export default GroupModel as Model<GroupDocument>;
