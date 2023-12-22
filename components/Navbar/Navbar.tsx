"use client";
import { Badge, Burger, Button, Group, Text, ThemeIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBraces, IconCode, IconCodeCircle2 } from "@tabler/icons-react";
import AuthButton from "../AuthButton";
import ColorSchemeToggle from "../ColorSchemeToggle";
import Simple from "../Sidebars/Simple/Simple";
import classes from "./Navbar.module.css";
import Link from "next/link";
import DevLovePer from "../DevLovePer";

const Navbar = () => {
  const [opened, { toggle, close }] = useDisclosure();
  return (
    <>
      <Group className={classes.navbar} px="md" py="xs" justify="space-between">
        <Group>
          <Burger
            opened={opened}
            onClick={toggle}
            aria-label="Toggle navigation"
          />
          <DevLovePer />
        </Group>
        <Group gap="xs" justify="right">
          <ColorSchemeToggle />
          <AuthButton />
        </Group>
      </Group>
      <Simple close={close} opened={opened} />
    </>
  );
};

export default Navbar;
