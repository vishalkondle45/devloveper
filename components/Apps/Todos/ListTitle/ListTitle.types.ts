import { IconProps } from "@tabler/icons-react";
import { Types } from "mongoose";
import {
  Dispatch,
  ForwardRefExoticComponent,
  RefAttributes,
  SetStateAction,
} from "react";

export interface SortTypes {
  sort: "asc" | "desc";
  by: "important" | "date" | "todo" | "createdAt" | "myday" | "";
}

export interface Props {
  title: string;
  color: string;
  icon?: ForwardRefExoticComponent<
    Omit<IconProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  getTodos: (list?: string, sort?: string, way?: string) => Promise<void>;
  setSort: Dispatch<SetStateAction<SortTypes>>;
  sort: SortTypes;
  getTodoLists?: () => Promise<void>;
}

export interface SortOptionProps {
  name: "important" | "date" | "todo" | "createdAt" | "myday" | "";
  label: string;
  icon: ForwardRefExoticComponent<
    Omit<IconProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
}

export interface ListUpdateTypes {
  _id?: string;
  title?: string;
  color?: string;
  user?: Types.ObjectId;
}
