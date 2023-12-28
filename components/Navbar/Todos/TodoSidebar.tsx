import { Button, Group } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconNote, IconTag, IconTags, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { TodoSidebarProps } from "./TodoSidebar.types";

const TodoSidebar = ({ navigate }: TodoSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/todos", icon: IconNote, title: "Todos" },
    { path: "/todos/trash", icon: IconTrash, title: "Trash" },
    { path: "/todos/labels", icon: IconTags, title: "Labels" },
  ]);

  const getLabels = async () => {
    await axios.get("/api/todos/labels").then((res) => {
      let labels = res.data.map(({ _id, title }: any) => ({
        path: "/todos/labels/" + _id,
        title,
      }));
      handlers.append(...labels);
    });
  };

  useEffect(() => {
    // getLabels();
  }, []);

  return (
    <Group mt="xs" gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "filled" : "outline"}
          leftSection={item.icon ? <item.icon /> : <IconTag />}
          onClick={() => navigate(item.path)}
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default TodoSidebar;
