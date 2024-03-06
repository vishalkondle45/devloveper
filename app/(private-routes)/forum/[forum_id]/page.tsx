"use client";
import Answer from "@/components/Forum/Answer";
import { AnswerTypes, ForumType } from "@/components/Forum/Forum.Types";
import YourAnswer from "@/components/Forum/YourAnswer";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { colors } from "@/lib/constants";
import {
  getDigitByString,
  getFormattedDate,
  getFormattedDateWithTime,
  getInitials,
  timeFromNow,
} from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Container,
  CopyButton,
  Divider,
  Group,
  LoadingOverlay,
  NumberFormatter,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title,
  rem,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconShare,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);
  const [saved, setSaved] = useState<boolean>(false);
  const [answers, setAnswers] = useState<AnswerTypes | null>(null);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
    { title: forum?.question || "", href: `/forum/${forum?._id}` },
  ];

  const getForum = async () => {
    await axios.get(`/api/forum/${params?.forum_id}`).then(({ data }) => {
      setForum(data);
    });
    await axios
      .get(`/api/forum/${params?.forum_id}/saved`)
      .then(({ data }) => setSaved(data));
    await axios
      .get(`/api/forum/${params?.forum_id}/answer`)
      .then(({ data }) => {
        setAnswers(data);
      });
  };

  const upVote = async () => {
    await axios
      .put(`/api/forum/upvote`, { _id: params?.forum_id })
      .then(() => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum liked successfully.",
        });
        getForum();
      })
      .catch((error) => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: error.response.data.error,
        });
      });
  };

  const downVote = async () => {
    await axios
      .put(`/api/forum/downvote`, { _id: params?.forum_id })
      .then(async () => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum disliked successfully.",
        });
        getForum();
      })
      .catch((error) => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: error.response.data.error,
        });
      });
  };

  const saveForum = async () => {
    await axios
      .post(`/api/forum/${params?.forum_id}/saved`)
      .then(() => getForum())
      .catch((error) => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: error.response.data.error,
        });
      });
  };

  useEffect(() => {
    getForum();
  }, []);

  if (status === "loading" || !forum) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Paper w="100%" mt="xl" radius="md">
        <Title order={1}>{forum?.question}</Title>
        <Group gap={4}>
          <Group gap={rem(4)} wrap="nowrap">
            <Text fz={rem(14)} c="gray">
              Asked
            </Text>
            <Text fz={rem(14)}>{timeFromNow(forum?.createdAt)},</Text>
          </Group>
          <Group gap={rem(4)} wrap="nowrap">
            <Text fz={rem(14)} c="gray">
              Modified
            </Text>
            <Text fz={rem(14)}>{getFormattedDate(forum?.updatedAt)},</Text>
          </Group>
          <Group gap={rem(4)} wrap="nowrap">
            <Text fz={rem(14)} c="gray">
              Viewed
            </Text>
            <Text fz={rem(14)}>
              <NumberFormatter value={forum?.views} /> times
            </Text>
          </Group>
        </Group>
        <Divider variant="solid" mt="xs" />
        <Group wrap="nowrap" align="flex-start">
          <Stack align="center" mt="lg">
            <ActionIcon radius="xl" variant="filled" onClick={upVote}>
              <IconCaretUpFilled />
            </ActionIcon>
            <Text fw={700}>{forum?.votes}</Text>
            <ActionIcon radius="xl" variant="filled" onClick={downVote}>
              <IconCaretDownFilled />
            </ActionIcon>
            <ActionIcon variant="transparent" onClick={saveForum}>
              {saved ? <IconBookmarkFilled /> : <IconBookmark />}
            </ActionIcon>
          </Stack>
          <ScrollArea>
            <Text
              style={{ whiteSpace: "wrap" }}
              dangerouslySetInnerHTML={{ __html: forum?.description || "" }}
            />
          </ScrollArea>
        </Group>
        <Stack ml={rem(42)}>
          <Group gap="xs" justify="flex-start">
            {forum?.tags?.map((tag: string) => (
              <Badge
                key={tag}
                color={colors[getDigitByString(tag)]}
                tt="lowercase"
                variant="light"
                radius="xs"
              >
                #{tag}
              </Badge>
            ))}
          </Group>
          <Group align="start" justify="space-between">
            <Group>
              <CopyButton
                value={`https://devloveper.vercel.app/forum/${forum?._id}`}
              >
                {({ copied, copy }) => (
                  <Button
                    color={copied ? "blue" : "gray"}
                    onClick={copy}
                    variant="transparent"
                    size="compact-sm"
                    leftSection={
                      <IconShare style={{ width: rem(16), height: rem(16) }} />
                    }
                  >
                    {copied ? "Url Copied" : "Share"}
                  </Button>
                )}
              </CopyButton>
              <Button
                variant="transparent"
                size="compact-sm"
                color="gray"
                leftSection={
                  <IconUserPlus style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Follow
              </Button>
            </Group>
            <Group justify="right">
              <Paper p="sm" withBorder>
                <Stack gap={rem(4)}>
                  <Text fz="sm">
                    asked {getFormattedDateWithTime(forum?.createdAt)}
                  </Text>
                  <Group gap="xs">
                    <Avatar
                      size="sm"
                      color={colors[getDigitByString(forum?.user?.name)]}
                    >
                      {getInitials(forum?.user?.name)}
                    </Avatar>
                    <Text fz="sm">{forum?.user?.name}</Text>
                  </Group>
                </Stack>
              </Paper>
            </Group>
          </Group>
        </Stack>
      </Paper>
      <Divider my="xl" />
      {answers?.map((answer) => (
        <Answer answer={answer} getForum={getForum} />
      ))}
      <YourAnswer getForum={getForum} />
    </Container>
  );
};

export default Page;