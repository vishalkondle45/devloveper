import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCalendarMonth,
  IconCircleCheck,
  IconList,
  IconStar,
  IconSun,
} from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { TodoSidebarProps } from "./TodoSidebar.types";

const TodoSidebar = ({ navigate }: TodoSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/todos", icon: IconCircleCheck, title: "Todos" },
    { path: "/todos/myday", icon: IconSun, title: "My Day" },
    { path: "/todos/planned", icon: IconCalendarMonth, title: "Planned" },
    { path: "/todos/important", icon: IconStar, title: "Important" },
  ]);

  const getTodoLists = async () => {
    await axios.get("/api/todos/lists").then((res) => {
      let labels = res.data.map(({ _id, title }: any) => ({
        path: "/todos/" + _id,
        title,
      }));
      handlers.append(...labels);
    });
  };

  useEffect(() => {
    getTodoLists();
  }, []);

  return (
    <Group gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "filled" : "outline"}
          leftSection={
            item.icon ? (
              <item.icon style={{ width: rem(20), height: rem(20) }} />
            ) : (
              <IconList />
            )
          }
          onClick={() => navigate(item.path)}
          justify="left"
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default TodoSidebar;
