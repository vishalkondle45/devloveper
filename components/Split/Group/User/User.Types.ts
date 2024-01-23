import { UseFormReturnType } from "@mantine/form";
import mongoose from "mongoose";

export interface GroupUserType {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
}

export interface GroupUserProps {
  user: GroupUserType;
  form: UseFormReturnType<
    {
      title: string;
      type: string;
      users: never[];
      user: mongoose.Types.ObjectId;
    },
    (values: {
      title: string;
      type: string;
      users: never[];
      user: mongoose.Types.ObjectId;
    }) => {
      title: string;
      type: string;
      users: never[];
      user: mongoose.Types.ObjectId;
    }
  >;
  update: (
    property: "title" | "type" | "users",
    value: string | never[]
  ) => Promise<void>;
  index: number;
}
