import { Model, Schema, model, models } from "mongoose";

interface VerificationDocument extends Document {
  user: Schema.Types.ObjectId;
  pin: number;
  chance: number;
}

const verificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  pin: {
    type: Number,
    required: true,
  },
  chance: {
    type: Number,
    default: 1,
  },
});

const VerificationModel =
  models.Verification || model("Verification", verificationSchema);

export default VerificationModel as Model<VerificationDocument>;
