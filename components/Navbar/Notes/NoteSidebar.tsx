import { Button, Group } from "@mantine/core";
import { IconNote, IconTrash } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { NoteSidebarProps } from "./NoteSidebar.types";

const NoteSidebar = ({ navigate }: NoteSidebarProps) => {
  const pathname = usePathname();
  const list = [
    { path: "/notes", icon: IconNote, title: "Notes" },
    { path: "/notes/trash", icon: IconTrash, title: "Trash" },
  ];

  return (
    <Group mt="xs" gap="xs">
      {list.map((item) => (
        <Button
          key={item.path}
          variant={pathname === item.path ? "filled" : "outline"}
          leftSection={<item.icon />}
          onClick={() => navigate(item.path)}
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default NoteSidebar;
