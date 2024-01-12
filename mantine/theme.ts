"use client";
import { Loader, createTheme } from "@mantine/core";

const theme = createTheme({
  primaryColor: "teal",
  defaultRadius: "xs",
  components: {
    Loader: Loader.extend({
      defaultProps: {
        type: "bars",
      },
    }),
  },
});
export default theme;
