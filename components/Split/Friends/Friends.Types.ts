import { ObjectId } from "mongoose";

export type FriendsTypes = FriendType[];

export interface FriendType {
  _id: string;
  sender: Sender;
  receiver: Receiver;
  isAccepted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Sender {
  _id: string;
  email: string;
  name: string;
}

export interface Receiver {
  _id: string;
  email: string;
  name: string;
}

export interface FriendProps {
  friend: FriendType;
  acceptFriendship: (_id: string) => Promise<void>;
  rejectFriendship: (_id: string) => Promise<void>;
}
