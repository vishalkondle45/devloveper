export interface Props {
  getTodos: () => Promise<void>;
  color?: string;
}
