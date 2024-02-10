import { Document, Model, Schema, Types, model, models } from "mongoose";

interface FriendDocument extends Document {
  sender: Types.ObjectId;
  receiver: Types.ObjectId;
  isAccepted: boolean;
}

const userSchema = new Schema<FriendDocument>(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    isAccepted: { type: "Boolean", default: false },
  },
  { timestamps: true }
);

const FriendModel = models.Friend || model("Friend", userSchema);

export default FriendModel as Model<FriendDocument>;
