import mongoose from "mongoose";

export interface Types {
  amount: number;
  user: mongoose.Types.ObjectId;
}
