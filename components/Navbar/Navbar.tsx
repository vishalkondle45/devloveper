"use client";
import { Burger, Drawer, Group, rem } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import AuthButton from "../AuthButton";
import ColorSchemeToggle from "../ColorSchemeToggle";
import classes from "./Navbar.module.css";
import DevLovePer from "../DevLovePer";
import Apps from "../Apps";

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
          <Apps />
          <ColorSchemeToggle />
          <AuthButton />
        </Group>
      </Group>
      <Drawer
        opened={opened}
        onClose={close}
        size={rem(300)}
        mt={rem(100)}
        withCloseButton={false}
      >
        <Group justify="">
          <Burger opened={opened} onClick={close} />
          <DevLovePer />
          {/* ToDo: Component according to path */}
        </Group>
      </Drawer>
    </>
  );
};

export default Navbar;
