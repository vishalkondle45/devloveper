import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/Providers/AuthProvider";
import theme from "@/mantine/theme";
import "@mantine/carousel/styles.css";
import "@mantine/charts/styles.css";
import { Box, ColorSchemeScript, MantineProvider, rem } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/core/styles/Pagination.css";
import "@mantine/dates/styles.css";
import "@mantine/dropzone/styles.css";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/tiptap/styles.css";
import "@mantine/code-highlight/styles.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Viewport } from "next";

export const metadata = {
  title: "Devloveper",
  description: "The developer who loves to develop web applications.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
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
          <Analytics />
          <SpeedInsights />
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <Notifications autoClose={2000} />
              <Navbar />
              <Box pt={rem(60)} pb={rem(4)}>
                {children}
              </Box>
            </ModalsProvider>
          </MantineProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
