import { Model, Schema, model, models } from "mongoose";

interface PlayerDocument extends Document {
  user: Schema.Types.ObjectId;
  bat: string;
  bowl: string;
  bowlingType: string;
  role: string;
}

const playerSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  bat: {
    type: String,
    enum: ["Right", "Left"],
    default: "Right",
  },
  bowl: {
    type: String,
    enum: ["Right", "Left"],
    default: "Right",
  },
  bowlingType: {
    type: String,
    enum: ["Fast", "Medium", "Spin"],
    default: "Fast",
  },
  role: {
    type: String,
    enum: ["Batsman", "Bowler", "Wicket Keeper", "Allrounder"],
    default: "Batsman",
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const PlayerModel = models.Player || model("Player", playerSchema);

export default PlayerModel as Model<PlayerDocument>;
