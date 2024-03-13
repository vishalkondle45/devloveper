import { Document, Model, Schema, Types, model, models } from "mongoose";

interface MatchDocument extends Document {
  home?: Types.ObjectId;
  away?: Types.ObjectId;
  toss?: Types.ObjectId;
  choosen?: "Bat" | "Bowl";
  overs?: number;
  city?: string;
  user?: Types.ObjectId;
}

const matchSchema = new Schema<MatchDocument>(
  {
    home: { type: Types.ObjectId, ref: "Team", required: true },
    away: { type: Types.ObjectId, ref: "Team", required: true },
    toss: { type: Types.ObjectId, ref: "Team", required: true },
    choosen: {
      enum: ["Bat", "Bowl"],
      type: String,
      required: true,
      default: "Bat",
    },
    overs: { type: Number, required: true, min: 1 },
    city: { type: String, required: false },
    user: { type: Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const MatchModel = models.Match || model("Match", matchSchema);

export default MatchModel as Model<MatchDocument>;
