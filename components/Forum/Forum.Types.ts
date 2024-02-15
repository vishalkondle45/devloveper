import { Types } from "mongoose";

export type ForumTypes = ForumType[];

export interface ForumType {
  _id: Types.ObjectId;
  question: string;
  description: string;
  user: User;
  tags: string[];
  likes: number;
  views: number;
  answers: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
}
