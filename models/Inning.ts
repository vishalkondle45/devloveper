import { Document, Model, Schema, Types, model, models } from "mongoose";

interface InningDocument extends Document {
  match?: Types.ObjectId;
  batting?: Types.ObjectId;
  bowling?: Types.ObjectId;
  striker?: Types.ObjectId;
  nonStriker?: Types.ObjectId;
  bowler?: Types.ObjectId;
  isCompleted: boolean;
}

const inningSchema = new Schema<InningDocument>(
  {
    match: { type: Types.ObjectId, ref: "Match", trim: true },
    batting: { type: Types.ObjectId, ref: "Squad", required: true },
    bowling: { type: Types.ObjectId, ref: "Squad", required: true },
    striker: { type: Types.ObjectId, ref: "Player", required: true },
    nonStriker: { type: Types.ObjectId, ref: "Player", required: true },
    bowler: { type: Types.ObjectId, ref: "Player", required: true },
    isCompleted: { type: Boolean, required: false, default: false },
  },
  { timestamps: true }
);

const InningModel = models.Inning || model("Inning", inningSchema);

export default InningModel as Model<InningDocument>;
