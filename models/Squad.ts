import { Document, Model, Schema, Types, model, models } from "mongoose";

interface SquadDocument extends Document {
  squad: Types.ObjectId[];
  captain?: Types.ObjectId;
  match?: Types.ObjectId;
  team?: Types.ObjectId;
}

const squadSchema = new Schema<SquadDocument>(
  {
    squad: { type: [Types.ObjectId], ref: "Player", trim: true, default: [] },
    captain: {
      type: Types.ObjectId,
      ref: "Player",
      required: true,
    },
    match: { type: Types.ObjectId, ref: "Match", required: true },
    team: { type: Types.ObjectId, ref: "Team", required: true },
  },
  { timestamps: true }
);

const SquadModel = models.Squad || model("Squad", squadSchema);

export default SquadModel as Model<SquadDocument>;
