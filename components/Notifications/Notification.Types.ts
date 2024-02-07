import { Types } from "mongoose";

export interface NotificationsTypes {
  _id: Types.ObjectId;
  message: string;
  link: string;
  type: string;
  user: Types.ObjectId;
  createdAt: string;
}
