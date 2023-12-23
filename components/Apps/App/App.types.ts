import { ReactNode } from "react";

export interface Props {
  icon: ReactNode;
  text: string;
  setOpened: (a: boolean) => void;
}
