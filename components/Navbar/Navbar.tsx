"use client";
import {
  Affix,
  Burger,
  Drawer,
  Group,
  Text,
  rem,
  useMantineColorScheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import Apps from "../Apps";
import AuthButton from "../AuthButton";
import ColorSchemeToggle from "../ColorSchemeToggle";
import DevLovePer from "../DevLovePer";
import Notifications from "../Notifications";
import ForumSidebar from "./Forum/ForumSidebar";
import classes from "./Navbar.module.css";
import NoteSidebar from "./Notes";
import RobotSidebar from "./Robot";
import SplitSidebar from "./Split";
import TodoSidebar from "./Todos";

const Navbar = () => {
  const [opened, { toggle, close }] = useDisclosure();
  const page = useSelectedLayoutSegments()[1];

  const router = useRouter();

  const navigate = (path: string) => {
    router.push(path);
    close();
  };

  const renderSwitch = (page: string) => {
    switch (page) {
      case "notes":
        return <NoteSidebar navigate={navigate} />;
      case "todos":
        return <TodoSidebar navigate={navigate} />;
      case "split":
        return <SplitSidebar navigate={navigate} />;
      case "forum":
        return <ForumSidebar navigate={navigate} />;
      case "robot":
        return <RobotSidebar navigate={navigate} />;
      default:
        return <Text>Please select app</Text>;
    }
  };
  const { toggleColorScheme, colorScheme } = useMantineColorScheme();

  return (
    <>
      <Affix
        bg={colorScheme === "dark" ? "dark.7" : "white"}
        w="100%"
        position={{ top: 0 }}
      >
        <Group
          className={classes.navbar}
          px="md"
          py="xs"
          justify="space-between"
          wrap="nowrap"
          gap={0}
        >
          <Group gap="xs" wrap="nowrap">
            <Burger
              opened={opened}
              onClick={toggle}
              aria-label="Toggle navigation"
              size="sm"
            />
            <DevLovePer />
          </Group>
          <Group gap="xs" justify="right" wrap="nowrap">
            <Notifications />
            <Apps />
            <ColorSchemeToggle
              toggleColorScheme={toggleColorScheme}
              colorScheme={colorScheme}
            />
            <AuthButton />
          </Group>
        </Group>
        <Drawer
          opened={opened}
          onClose={close}
          size={rem(240)}
          withCloseButton={false}
        >
          <Group
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            <Burger opened={opened} onClick={close} size="sm" />
            <DevLovePer />
            {renderSwitch(page)}
          </Group>
        </Drawer>
      </Affix>
    </>
  );
};

export default Navbar;
