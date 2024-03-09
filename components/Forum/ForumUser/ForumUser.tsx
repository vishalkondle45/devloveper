import { colors } from "@/lib/constants";
import {
  getDigitByString,
  getFormattedDateWithTime,
  getInitials,
} from "@/lib/functions";
import { Avatar, Group, Paper, Stack, Text, rem } from "@mantine/core";

interface Props {
  name: string;
  createdAt: string;
  isAnswer?: boolean;
}

const ForumUser = ({ name, createdAt, isAnswer = false }: Props) => {
  return (
    <Group justify="right">
      <Paper p="sm" withBorder>
        <Stack gap={rem(4)}>
          <Text fz="sm">
            {isAnswer ? "answered" : "asked"}
            {" on "}
            {getFormattedDateWithTime(createdAt)}
          </Text>
          <Group gap="xs">
            <Avatar size="sm" color={colors[getDigitByString(name)]}>
              {getInitials(name)}
            </Avatar>
            <Text fz="sm">{name}</Text>
          </Group>
        </Stack>
      </Paper>
    </Group>
  );
};

export default ForumUser;
