import { colors } from "@/lib/constants";
import {
  getDigitByString,
  getFormattedDateWithTime,
  getInitials,
  timeFromNow,
} from "@/lib/functions";
import { Avatar, Badge, Group, Paper, Stack, Text, rem } from "@mantine/core";
import {
  IconEye,
  IconHeartFilled,
  IconMessageCircle2,
} from "@tabler/icons-react";
import { useRouter } from "next/navigation";

const ForumItem = ({ forum }: any) => {
  const router = useRouter();
  return (
    <>
      <Paper
        shadow="xl"
        p="sm"
        onClick={() => router.push(`/forum/${forum?._id}`)}
        withBorder
      >
        <Group wrap="nowrap" align="baseline">
          <Stack gap="xs">
            <Badge
              size="lg"
              variant="light"
              color="red"
              leftSection={<IconHeartFilled width={16} />}
            >
              {forum?.upvotes.length - forum?.downvotes.length}
            </Badge>
            <Badge size="lg" leftSection={<IconMessageCircle2 width={16} />}>
              {forum?.answers}
            </Badge>
            <Badge
              size="lg"
              variant="light"
              color="gray"
              leftSection={<IconEye width={16} />}
            >
              {forum?.views.length}
            </Badge>
          </Stack>
          <Stack gap="xs">
            <Text
              fw={500}
              dangerouslySetInnerHTML={{ __html: forum?.question }}
            />
            <Group gap="xs" justify="flex-start">
              {forum?.tags?.map((tag: string) => (
                <Badge
                  key={tag}
                  color={colors[getDigitByString(tag)]}
                  tt="lowercase"
                  variant="light"
                  radius="xs"
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </Stack>
        </Group>
        <Group gap={rem(4)} justify="right">
          <Avatar
            size="xs"
            color={colors[getDigitByString(forum.user?.name)]}
            title={forum.user?.name}
          >
            {getInitials(forum.user?.name)}
          </Avatar>
          <Text fz="xs" fw={700}>
            {forum.user?.name}
          </Text>
          <Text fz="xs" title={getFormattedDateWithTime(forum?.createdAt)}>
            asked {timeFromNow(forum?.createdAt)}
          </Text>
        </Group>
      </Paper>
    </>
  );
};

export default ForumItem;
