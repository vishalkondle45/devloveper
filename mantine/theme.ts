"use client";
import { Loader, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "dark",
  defaultRadius: "xl",
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: "bars",
      },
    }),
  },
});
export default theme;
