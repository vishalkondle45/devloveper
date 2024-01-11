export interface Props {
  getTodos: () => Promise<void>;
  color?: string;
  isMyDayPage?: boolean;
  isPlannedPage?: boolean;
  list?: string;
}
