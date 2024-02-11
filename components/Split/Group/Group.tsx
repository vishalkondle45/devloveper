import { colors, groupTypes } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  Avatar,
  Group,
  Paper,
  Text,
  ThemeIcon,
  Tooltip,
  rem,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { GroupProps } from "./Group.Types";

const GroupItem = ({ group }: GroupProps) => {
  const groupType = groupTypes.find(({ type }) => type === group.type);
  const router = useRouter();
  const goToGroup = () => router.push(`/split/groups/${group._id}`);

  return (
    <Paper
      p="xs"
      shadow="xl"
      style={{ cursor: "pointer" }}
      onClick={goToGroup}
      withBorder
    >
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap" gap="xs">
          <ThemeIcon variant="light" radius="xl" size="xl">
            {groupType && <groupType.icon />}
          </ThemeIcon>
          <Text fw={700}>{group.title}</Text>
        </Group>
        <Group wrap="nowrap" gap={0}>
          <Avatar.Group>
            {group?.users.slice(0, 5)?.map((user: any) => (
              <Tooltip key={user._id} label={user?.name} withArrow>
                <Avatar
                  size={rem(36)}
                  radius="xl"
                  color={colors[getDigitByString(String(user?.name))]}
                  variant="filled"
                >
                  {getInitials(user?.name)}
                </Avatar>
              </Tooltip>
            ))}
            {group?.users?.length > 5 && (
              <Tooltip
                label={group?.users
                  .slice(5)
                  .map(({ name }: { name: any }) => name)
                  .join(", ")}
                withArrow
              >
                <Avatar
                  size={rem(36)}
                  color="cyan"
                  radius="xl"
                  variant="filled"
                >
                  +{group?.users?.length - 5}
                </Avatar>
              </Tooltip>
            )}
          </Avatar.Group>
        </Group>
      </Group>
    </Paper>
  );
};

export default GroupItem;
