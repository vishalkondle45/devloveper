import { Button, Group, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import {
  IconCoinRupee,
  IconList,
  IconUsers,
  IconUsersGroup,
} from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { SplitSidebarProps } from "./SplitSidebar.types";

const SplitSidebar = ({ navigate }: SplitSidebarProps) => {
  const pathname = usePathname();
  const [list, handlers] = useListState([
    { path: "/split", icon: IconCoinRupee, title: "Home" },
    { path: "/split/groups", icon: IconUsersGroup, title: "Groups" },
    { path: "/split/friends", icon: IconUsers, title: "Friends" },
    // { path: "/split/activity", icon: IconActivity, title: "Activities" },
  ]);

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
