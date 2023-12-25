import { Types } from "mongoose";
import { DefaultUser } from "next-auth";

interface IUser extends DefaultUser {
  _id?: Types.ObjectId;
  isAdmin?: boolean;
}

declare module "next-auth" {
  interface User extends IUser {}
  interface Session {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends IUser {}
}
