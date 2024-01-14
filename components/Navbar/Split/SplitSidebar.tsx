import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconActivity,
  IconCoinRupee,
  IconList,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import axios from "axios";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { SplitSidebarProps } from "./SplitSidebar.types";

const SplitSidebar = ({ navigate }: SplitSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/split", icon: IconCoinRupee, title: "Home" },
    { path: "/split/groups", icon: IconUsersGroup, title: "Groups" },
    { path: "/split/friends", icon: IconUsers, title: "Friends" },
    { path: "/split/activity", icon: IconActivity, title: "Activities" },
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

export default SplitSidebar;
