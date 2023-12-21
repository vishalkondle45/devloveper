"use client";

import { useLoaded } from "@/hooks/useLoaded";
import { ActionIcon, useMantineColorScheme } from "@mantine/core";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ColorSchemeToggle() {
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();
  const loaded = useLoaded();

  if (loaded) {
    return (
      <ActionIcon color="grey" variant="outline" onClick={toggleColorScheme}>
        {colorScheme === "dark" ? (
          <IconMoon size={18} />
        ) : (
          <IconSun size={18} />
        )}
      </ActionIcon>
    );
  }
}
