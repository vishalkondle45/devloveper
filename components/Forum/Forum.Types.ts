import { Types } from "mongoose";

export type ForumTypes = ForumType[];

export interface ForumType {
  _id: Types.ObjectId;
  question: string;
  description: string;
  user: User;
  tags: string[];
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  views: Types.ObjectId[];
  saved: Types.ObjectId[];
  answers: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface User {
  _id: string;
  name: string;
}

export type AnswerTypes = AnswerType[];

export interface AnswerType {
  _id: string;
  answer: string;
  forum: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
