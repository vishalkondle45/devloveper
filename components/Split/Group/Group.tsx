import { colors, groupTypes } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import { Avatar, Group, Paper, Text, ThemeIcon, rem } from "@mantine/core";
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
          <Text>{group.title}</Text>
        </Group>
        <Group wrap="nowrap" gap={0}>
          <Avatar.Group>
            {group?.users.slice(0, 5)?.map((user) => (
              <Avatar
                size={rem(28)}
                radius="xl"
                title={user?.name}
                color={colors[getDigitByString(String(user?.name))]}
                variant="filled"
              >
                {getInitials(user?.name)}
              </Avatar>
            ))}
            {group?.users?.length > 5 && (
              <Avatar
                size={rem(28)}
                color="cyan"
                radius="xl"
                variant="filled"
                title={group?.users
                  .slice(5)
                  .map(({ name }) => name)
                  .join(",")}
              >
                +{group?.users?.length - 5}
              </Avatar>
            )}
          </Avatar.Group>
        </Group>
      </Group>
    </Paper>
  );
};

export default GroupItem;
