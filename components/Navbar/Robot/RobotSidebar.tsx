import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconHome,
  IconList,
  IconLoader,
  IconPrompt,
} from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Breadcrumbs, RobotSidebarProps } from "./RobotSidebar.types";

const RobotSidebar = ({ navigate }: RobotSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/robot", icon: IconHome, title: "Home" },
    { path: "/robot/prompts", icon: IconList, title: "Prompts" },
    { path: "", icon: IconLoader, title: "" },
  ]);

  const getPromptsList = async () => {
    await axios.get("/api/robot/prompts/list").then((res) => {
      let labels = res.data.map(({ _id, prompt }: Breadcrumbs) => ({
        path: `/robot/prompts/${_id}`,
        title: prompt,
      }));
      handlers.append(...labels);
      handlers.remove(2);
    });
  };

  useEffect(() => {
    getPromptsList();
  }, []);

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
              <IconPrompt />
            )
          }
          onClick={() => navigate(item.path)}
          justify={item.path ? "left" : "center"}
          style={{
            pointerEvents: item.path ? "auto" : "none",
          }}
          w="100%"
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default RobotSidebar;
