import { Types } from "mongoose";

export interface GroupProps {
  group: GroupType;
}

export interface GroupUserType {
  _id: Types.ObjectId;
  name: string;
  email: string;
}

export interface GroupType {
  _id: Types.ObjectId;
  title: string;
  type: "home" | "trip" | "office" | "sports" | "others";
  simplify: Boolean;
  user: GroupUserType;
  users: GroupUserType[] | any;
  createdAt: string;
}

export interface ExpenseUser {
  user: Types.ObjectId;
  amount?: number;
  active?: boolean;
}
