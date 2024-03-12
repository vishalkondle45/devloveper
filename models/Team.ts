import { Model, Schema, model, models } from "mongoose";

interface TeamDocument extends Document {
  name: string;
  shortName: string;
  players: Schema.Types.ObjectId[];
  captain: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
}

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  shortName: {
    type: String,
    required: true,
    unique: true,
  },
  players: [
    {
      type: Schema.Types.ObjectId,
      ref: "Player",
    },
  ],
  captain: {
    type: Schema.Types.ObjectId,
    ref: "Player",
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

const TeamModel = models.Team || model("Team", teamSchema);

export default TeamModel as Model<TeamDocument>;
