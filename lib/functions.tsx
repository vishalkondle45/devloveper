import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { expenseCategories } from "./constants";
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

export const getInitials = (name: string | undefined | null) => {
  if (name) {
    let nameArray = name.trim()?.split(" ");
    return nameArray?.length < 2
      ? nameArray[0][0]
      : nameArray[0][0] + nameArray[nameArray.length - 1][0];
  }
};

function isPrime(n: number) {
  if (n == 0 || n == 1) return false;
  for (let i = 2; i * i <= n; i++) if (n % i == 0) return false;

  return true;
}

function getSum(n: number) {
  let sum = 0;
  while (n > 0 || sum > 9) {
    if (n == 0) {
      n = sum;
      sum = 0;
    }
    sum = sum + (n % 10);
    n = Math.floor(n / 10);
  }
  return sum;
}

export function getDigitByString(str: string | undefined | null) {
  if (!str) return 0;
  let sum = 0;
  for (let i = 0; i < str?.length; i++) {
    if (isPrime(i + 1)) sum += str.charCodeAt(i);
  }
  return getSum(sum);
}

export const getDueDate = (date: any) => {
  if (dayjs(date).isToday()) return "Today";
  if (dayjs(date).isTomorrow()) return "Tomorrow";
  return dayjs(date).format("ddd, MMM D");
};

export const removeSpaces = (string: string | undefined) =>
  string?.split("\n").join(" ").trim();

export const convertToSingleSpace = (string: string | undefined) =>
  string?.split("  ").join(" ").trim();

export const displayUserFirstName = (string: string) => string.split(" ")[0];

export const getCategoryIcon = (string: string) =>
  expenseCategories.find((item) => item.category === string)?.icon;
