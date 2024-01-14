import { GroupTypeTypes, groupTypes } from "@/lib/constants";
import { Group, Paper, Stack, Text, ThemeIcon, rem } from "@mantine/core";
import { GroupProps } from "./Group.Types";

const GroupItem = ({ group }: GroupProps) => {
  const groupType = groupTypes.find(({ type }) => type === group.type);
  return (
    <Paper p="xs" shadow="xl" withBorder>
      <Group wrap="nowrap" justify="space-between">
        <Group>
          <ThemeIcon variant="light" radius="xl" size="xl">
            {groupType && <groupType.icon />}
          </ThemeIcon>
          <Stack gap={0}>
            <Text>{group.title}</Text>
            <Stack gap={0}>
              <Text size="xs">Someone will pay you $100</Text>
              <Text size="xs">Someone will pay you $90</Text>
            </Stack>
          </Stack>
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
