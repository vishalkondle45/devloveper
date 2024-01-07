import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCalendarMonth,
  IconCircleCheck,
  IconNote,
  IconStar,
  IconSun,
  IconTag,
  IconTags,
  IconTrash,
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
    { path: "/todos/favorites", icon: IconStar, title: "Favorites" },
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
    // getTodoLists();
  }, []);

  return (
    <Group mt="xs" gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "filled" : "outline"}
          leftSection={
            item.icon ? (
              <item.icon style={{ width: rem(20), height: rem(20) }} />
            ) : (
              <IconTag />
            )
          }
          onClick={() => navigate(item.path)}
          fullWidth
          justify="left"
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default TodoSidebar;
