import { SortOptionProps } from "@/components/Apps/Todos/ListTitle/ListTitle.types";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { DefaultMantineColor, rem } from "@mantine/core";
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

import {
  IconCalendar,
  IconCircleCheck,
  IconCloudRain,
  IconCoinRupee,
  IconFileText,
  IconMessageCircle2,
  IconMusic,
  IconNote,
  IconUserCircle,
} from "@tabler/icons-react";

import { ReactNode } from "react";

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

export interface AppTypes {
  type:
    | "notes"
    | "todos"
    | "split"
    | "calendar"
    | "weather"
    | "music"
    | "blog"
    | "forum"
    | "profile";
  icon: ReactNode;
}

export const appTypes: AppTypes[] = [
  { type: "notes", icon: <IconNote /> },
  { type: "todos", icon: <IconCircleCheck /> },
  { type: "split", icon: <IconCoinRupee /> },
  { type: "calendar", icon: <IconCalendar /> },
  { type: "weather", icon: <IconCloudRain /> },
  { type: "music", icon: <IconMusic /> },
  { type: "blog", icon: <IconFileText /> },
  { type: "forum", icon: <IconMessageCircle2 /> },
  { type: "profile", icon: <IconUserCircle /> },
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
  label: string;
  icon: ReactNode;
  color: DefaultMantineColor;
}

export const expenseCategories: ExpenseCategoryTypes[] = [
  {
    category: "food",
    label: "Food",
    icon: <IconToolsKitchen2 style={{ width: rem(18), height: rem(18) }} />,
    color: "yellow",
  },
  {
    category: "drinks",
    label: "Drinks",
    icon: <IconMilkshake style={{ width: rem(18), height: rem(18) }} />,
    color: "orange",
  },
  {
    category: "groceries",
    label: "Groceries",
    icon: <IconBasket style={{ width: rem(18), height: rem(18) }} />,
    color: "red",
  },
  {
    category: "bills",
    label: "Bills",
    icon: <IconReceipt style={{ width: rem(18), height: rem(18) }} />,
    color: "grape",
  },
  {
    category: "shopping",
    label: "Shopping",
    icon: (
      <IconShoppingCartFilled style={{ width: rem(18), height: rem(18) }} />
    ),
    color: "cyan",
  },
  {
    category: "entertainment",
    label: "Entertainment",
    icon: <IconTicket style={{ width: rem(18), height: rem(18) }} />,
    color: "teal",
  },
  {
    category: "transfer",
    label: "Transfer",
    icon: <IconArrowsLeftRight style={{ width: rem(18), height: rem(18) }} />,
    color: "green",
  },
  {
    category: "travel",
    label: "Travel",
    icon: <IconBriefcaseFilled style={{ width: rem(18), height: rem(18) }} />,
    color: "blue",
  },
  {
    category: "fuel",
    label: "Fuel",
    icon: <IconGasStation style={{ width: rem(18), height: rem(18) }} />,
    color: "lime",
  },
  {
    category: "health",
    label: "Health",
    icon: <IconHeartbeat style={{ width: rem(18), height: rem(18) }} />,
    color: "pink",
  },
  {
    category: "emi",
    label: "EMI",
    icon: <IconChartPie style={{ width: rem(18), height: rem(18) }} />,
    color: "violet",
  },
  {
    category: "investment",
    label: "Investment",
    icon: <IconPigMoney style={{ width: rem(18), height: rem(18) }} />,
    color: "dark",
  },
  {
    category: "general",
    label: "General",
    icon: <IconDots style={{ width: rem(18), height: rem(18) }} />,
    color: "dark",
  },
];

export const geminiModelConfig = {
  model: "gemini-pro",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
};
