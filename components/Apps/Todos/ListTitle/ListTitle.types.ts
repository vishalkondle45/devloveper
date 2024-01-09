import { TablerIconsProps } from "@tabler/icons-react";
import { Dispatch, SetStateAction } from "react";

export interface SortTypes {
  sort: "asc" | "desc";
  by: "favorite" | "date" | "todo" | "createdAt" | "myday" | "";
}

export interface Props {
  title: string;
  icon?: (props: TablerIconsProps) => JSX.Element;
  getTodos: (list?: string, sort?: string, way?: string) => Promise<void>;
  setSort: Dispatch<SetStateAction<SortTypes>>;
  sort: SortTypes;
}

export interface SortOptionProps {
  name: "favorite" | "date" | "todo" | "createdAt" | "myday" | "";
  label: string;
  icon: (props: TablerIconsProps) => JSX.Element;
}
