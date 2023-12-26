export interface ColorSwatcherProps {
  color: string;
  selected: boolean;
  updateColor: (color: string) => void;
}
