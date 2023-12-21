import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";

import { ColorSchemeScript, Group, MantineProvider } from "@mantine/core";
import ColorSchemeToggle from "@/components/ColorSchemeToggle";

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
    <html lang="en">
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider>
          <Notifications />
          <Group p="xs" justify="right">
            <ColorSchemeToggle />
          </Group>
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
