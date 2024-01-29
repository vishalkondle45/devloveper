import { SortOptionProps } from "@/components/Apps/Todos/ListTitle/ListTitle.types";
import { DefaultMantineColor } from "@mantine/core";
import {
  IconArrowsDownUp,
  IconArrowsLeftRight,
  IconBasket,
  IconBriefcaseFilled,
  IconBuilding,
  IconCalendarMonth,
  IconCalendarPlus,
  IconCar,
  IconChartPie,
  IconCircles,
  IconDots,
  IconGasStation,
  IconHeartbeat,
  IconHome,
  IconMilkshake,
  IconPigMoney,
  IconPingPong,
  IconReceipt,
  IconShoppingCartFilled,
  IconStar,
  IconSun,
  IconTicket,
  IconToolsKitchen2,
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

export interface ExpenseCategoryTypes {
  category:
    | "food"
    | "drinks"
    | "groceries"
    | "bills"
    | "shopping"
    | "entertainment"
    | "transfer"
    | "travel"
    | "fuel"
    | "health"
    | "emi"
    | "investment"
    | "general";
  label: String;
  icon: (props: TablerIconsProps) => JSX.Element;
  color: DefaultMantineColor;
}

export const expenseCategories: ExpenseCategoryTypes[] = [
  { category: "food", label: "Food", icon: IconToolsKitchen2, color: "yellow" },
  { category: "drinks", label: "Drinks", icon: IconMilkshake, color: "orange" },
  { category: "groceries", label: "Groceries", icon: IconBasket, color: "red" },
  { category: "bills", label: "Bills", icon: IconReceipt, color: "grape" },
  {
    category: "shopping",
    label: "Shopping",
    icon: IconShoppingCartFilled,
    color: "cyan",
  },
  {
    category: "entertainment",
    label: "Entertainment",
    icon: IconTicket,
    color: "teal",
  },
  {
    category: "transfer",
    label: "Transfer",
    icon: IconArrowsLeftRight,
    color: "green",
  },
  {
    category: "travel",
    label: "Travel",
    icon: IconBriefcaseFilled,
    color: "blue",
  },
  {
    category: "fuel",
    label: "Fuel",
    icon: IconGasStation,
    color: "lime",
  },
  {
    category: "health",
    label: "Health",
    icon: IconHeartbeat,
    color: "pink",
  },
  {
    category: "emi",
    label: "EMI",
    icon: IconChartPie,
    color: "violet",
  },
  {
    category: "investment",
    label: "Investment",
    icon: IconPigMoney,
    color: "dark",
  },
  {
    category: "general",
    label: "General",
    icon: IconDots,
    color: "dark",
  },
];
