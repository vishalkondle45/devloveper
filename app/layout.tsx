import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/code-highlight/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/spotlight/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/dropzone/styles.css";
import "@mantine/nprogress/styles.css";
import "@mantine/tiptap/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import AuthProvider from "@/components/Providers/AuthProvider";
import Navbar from "@/components/Navbar";

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
          <MantineProvider theme={{ primaryColor: "teal" }}>
            <Notifications />
            <Navbar />
            {children}
          </MantineProvider>
        </body>
      </html>
    </AuthProvider>
  );
}
