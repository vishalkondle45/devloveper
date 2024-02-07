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
  group: any;
  index: number;
  updateUser: (user: string | null) => Promise<void>;
}

export interface AutoCompleteDataType {
  _id: mongoose.Types.ObjectId;
  name: string;
}
