import { Types } from "mongoose";

export interface GroupProps {
  group: GroupType;
}

export interface GroupType {
  _id: Types.ObjectId;
  title: String;
  type: "home" | "trip" | "office" | "sports" | "others";
  simplify: Boolean;
  user: Types.ObjectId;
  users: Types.ObjectId[];
  createdAt: String;
}
