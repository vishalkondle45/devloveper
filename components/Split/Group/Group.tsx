import { groupTypes } from "@/lib/constants";
import { Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
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
        <Group>
          <ThemeIcon variant="light" radius="xl" size="xl">
            {groupType && <groupType.icon />}
          </ThemeIcon>
          <Text>{group.title}</Text>
        </Group>
        <Stack ta="right" gap={0}>
          <Text size="xs">You are owed</Text>
          <Text size="xs" fw={700} c={"green"}>
            $190
          </Text>
        </Stack>
      </Group>
    </Paper>
  );
};

export default GroupItem;
