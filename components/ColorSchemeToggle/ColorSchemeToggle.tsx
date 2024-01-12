"use client";

import { useLoaded } from "@/hooks/useLoaded";
import { ActionIcon } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ColorSchemeToggle({
  colorScheme,
  toggleColorScheme,
}: {
  toggleColorScheme: () => void;
  colorScheme: "dark" | "light" | "auto";
}) {
  const loaded = useLoaded();

  if (loaded) {
    return (
      <ActionIcon
        color="grey"
        variant="outline"
        onClick={toggleColorScheme}
        size="lg"
        radius="xl"
      >
        {colorScheme === "dark" ? (
          <IconMoon size={18} />
        ) : (
          <IconSun size={18} />
        )}
      </ActionIcon>
    );
  }
}
