import mongoose from "mongoose";

export interface GroupUserType {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

export interface GroupUserProps {
  user: GroupUserType;
  group: any;
  index: number;
  updateUser: (user: string | null) => Promise<void>;
}

export interface AutoCompleteDataType {
  _id: mongoose.Types.ObjectId;
  name: string;
}
