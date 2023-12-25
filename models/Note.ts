import { Document, Model, Schema, Types, model, models } from "mongoose";

interface NoteDocument extends Document {
  title?: string;
  note: string;
  user?: Types.ObjectId;
  color?: string;
}

const noteSchema = new Schema<NoteDocument>({
  title: { type: String, required: false, trim: true },
  note: { type: String, required: true, trim: true },
  color: { type: String, required: false },
  user: { type: Types.ObjectId, required: false },
});

const NoteModel = models.Note || model("Note", noteSchema);

export default NoteModel as Model<NoteDocument>;
