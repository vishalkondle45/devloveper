import { Document, Model, Schema, Types, model, models } from "mongoose";

interface NotificationDocument extends Document {
  message: string;
  link?: string;
  type: string;
  user: Types.ObjectId;
}

const noteSchema = new Schema<NotificationDocument>(
  {
    message: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    link: { type: String, required: false, trim: true },
    user: { type: "ObjectID", required: true },
  },
  { timestamps: true }
);

const NotificationModel =
  models.Notification || model("Notification", noteSchema);

export default NotificationModel as Model<NotificationDocument>;
