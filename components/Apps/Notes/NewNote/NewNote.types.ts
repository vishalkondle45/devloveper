import { Note } from "../Note/Note.types";

export interface Values {
  title: string;
  note: string;
}
export interface Props {
  getNotes: () => void;
}
