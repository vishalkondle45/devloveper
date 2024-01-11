export interface Props {
  getTodos: () => Promise<void>;
  color?: string;
  isMyDayPage?: boolean;
  list?: string;
}
