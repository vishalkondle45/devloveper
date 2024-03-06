import { Button, Group } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { IconNote, IconTag, IconTags, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { NoteSidebarProps } from "./NoteSidebar.types";

const NoteSidebar = ({ navigate }: NoteSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/notes", icon: IconNote, title: "Notes" },
    { path: "/notes/trash", icon: IconTrash, title: "Trash" },
    { path: "/notes/labels", icon: IconTags, title: "Labels" },
  ]);

  const getLabels = async () => {
    await axios.get("/api/notes/labels").then((res) => {
      let labels = res.data.map(({ _id, title }: any) => ({
        path: "/notes/labels/" + _id,
        title,
      }));
      handlers.append(...labels);
    });
  };

  useEffect(() => {
    getLabels();
  }, []);

  return (
    <Group gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "light" : "transparent"}
          leftSection={item.icon ? <item.icon /> : <IconTag />}
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

export default NoteSidebar;
