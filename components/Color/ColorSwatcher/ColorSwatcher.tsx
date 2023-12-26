import {
  CheckIcon,
  ColorSwatch,
  parseThemeColor,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { ColorSwatcherProps } from "./ColorSwatcher.types";

const ColorSwatcher = ({
  color,
  selected,
  updateColor,
}: ColorSwatcherProps) => {
  const theme = useMantineTheme();
  const parsedColor = parseThemeColor({ color, theme });
  const bgColor = parsedColor.isThemeColor
    ? `var(${parsedColor.variable})`
    : parsedColor.value;
  const colorUpdate = (): void => updateColor(bgColor);

  return (
    <>
      <ColorSwatch component="button" color={bgColor} onClick={colorUpdate}>
        {selected && <CheckIcon style={{ width: rem(12), height: rem(12) }} />}
      </ColorSwatch>
    </>
  );
};

export default ColorSwatcher;
