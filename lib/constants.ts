import { SortOptionProps } from "@/components/Apps/Todos/ListTitle/ListTitle.types";
import {
  IconArrowsDownUp,
  IconBuilding,
  IconCalendarMonth,
  IconCalendarPlus,
  IconCar,
  IconCircles,
  IconHome,
  IconHome2,
  IconPingPong,
  IconStar,
  IconSun,
  TablerIconsProps,
} from "@tabler/icons-react";

export const colors = [
  "grey",
  "red",
  "green",
  "blue",
  "violet",
  "yellow",
  "pink",
  "teal",
  "cyan",
  "grape",
  "indigo",
  "lime",
  "orange",
];

export const sortOptions: SortOptionProps[] = [
  {
    name: "important",
    label: "Importance",
    icon: IconStar,
  },
  {
    name: "date",
    label: "Due date",
    icon: IconCalendarMonth,
  },
  {
    name: "myday",
    label: "Added to My Day",
    icon: IconSun,
  },
  {
    name: "todo",
    label: "Alphabetically",
    icon: IconArrowsDownUp,
  },
  {
    name: "createdAt",
    label: "Creation date",
    icon: IconCalendarPlus,
  },
];

export interface GroupTypeTypes {
  type: "home" | "trip" | "office" | "sports" | "others";
  label: String;
  icon: (props: TablerIconsProps) => JSX.Element;
}

export const groupTypes: GroupTypeTypes[] = [
  { type: "home", label: "Home", icon: IconHome },
  { type: "trip", label: "Trip", icon: IconCar },
  { type: "office", label: "Office", icon: IconBuilding },
  { type: "sports", label: "Sports", icon: IconPingPong },
  { type: "others", label: "Others", icon: IconCircles },
];
