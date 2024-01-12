import { SortOptionProps } from "@/components/Apps/Todos/ListTitle/ListTitle.types";
import {
  IconArrowsDownUp,
  IconCalendarMonth,
  IconCalendarPlus,
  IconStar,
  IconSun,
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
