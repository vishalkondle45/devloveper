import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconBookmark,
  IconHome,
  IconList,
  IconMessageCircleQuestion,
  IconTags,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { ForumSidebarProps } from "./ForumSidebar.types";

const ForumSidebar = ({ navigate }: ForumSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/forum", icon: IconHome, title: "Home" },
    {
      path: "/forum/questions",
      icon: IconMessageCircleQuestion,
      title: "Questions",
    },
    { path: "/forum/tags", icon: IconTags, title: "Tags" },
    { path: "/forum/saved", icon: IconBookmark, title: "Saved" },
  ]);

  return (
    <Group gap="xs">
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
          fullWidth
        >
          {item.title}
        </Button>
      ))}
    </Group>
  );
};

export default ForumSidebar;
