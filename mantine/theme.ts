"use client";
import { Loader, createTheme, Avatar } from "@mantine/core";

const theme = createTheme({
  primaryColor: "teal",
  defaultRadius: "xs",
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: "bars",
      },
    }),
    Avatar: Avatar.extend({
      defaultProps: {
        variant: "filled",
        radius: "xl",
      },
    }),
  },
});
export default theme;
