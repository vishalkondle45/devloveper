import { Button, Center, Group, Loader, rem } from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import { IconHome, IconList } from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs, RobotSidebarProps } from "./RobotSidebar.types";

const TodoSidebar = ({ navigate }: RobotSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/robot", icon: IconHome, title: "Home" },
  ]);
  const [opened, { open, close }] = useDisclosure(false);

  const getPromptsList = async () => {
    open();
    await axios.get("/api/robot/prompts/list").then((res) => {
      let labels = res.data.map(({ _id, prompt }: Breadcrumbs) => ({
        path: "/robot/" + _id,
        title: prompt,
      }));
      handlers.append(...labels);
    });
    close();
  };

  useEffect(() => {
    getPromptsList();
  }, []);

  if (opened) {
    return (
      <Center w="100%">
        <Loader />
      </Center>
    );
  }
  return (
    <Group w="100%" gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "light" : "transparent"}
          leftSection={
            item.icon ? (
              <item.icon style={{ width: rem(20), height: rem(20) }} />
            ) : (
              <IconList />
            )
          }
          onClick={() => navigate(item.path)}
          justify="left"
          w="100%"
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default TodoSidebar;
