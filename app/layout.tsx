import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/Providers/AuthProvider";
import theme from "@/mantine/theme";
import "@mantine/carousel/styles.css";
import "@mantine/code-highlight/styles.css";
import { Box, ColorSchemeScript, MantineProvider, rem } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";

export const metadata = {
  title: "Devloveper",
  description: "The developer who loves to develop web applications.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <html lang="en">
        <head>
          <link
            rel="icon"
            href="/devloveper-small.svg"
            type="image/*"
            sizes="any"
          />
          <ColorSchemeScript />
        </head>
        <body>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications />
              <Navbar />
              <Box pt={rem(60)}>{children}</Box>
            </ModalsProvider>
          </MantineProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
