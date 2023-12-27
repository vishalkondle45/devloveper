export interface Values {
  title: string;
  note: string;
}
export interface Props {
  getNotes: () => void;
  labels?: any[];
}
