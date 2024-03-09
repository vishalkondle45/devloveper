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
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconBookmark,
  IconBookmarkFilled,
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconShare,
  IconTrash,
  IconUserPlus,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface Arguments {
  _id: Types.ObjectId;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
}

const Page = () => {
  const { status, data } = useSession();
  const userId = data?.user?._id;
  const params = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);
  const [answers, setAnswers] = useState<AnswerTypes | null>(null);
  const router = useRouter();
  const [opened, handlers] = useDisclosure(true);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
    { title: forum?.question || "", href: `/forum/${forum?._id}` },
  ];

  const getForum = async () => {
    handlers.open();
    await axios
      .get(`/api/forum/${params?.forum_id}`)
      .then(({ data }) => setForum(data))
      .catch(() => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: "Forum not found.",
        });
        router.push("/forum");
      });
    await axios
      .get(`/api/forum/${params?.forum_id}/answer`)
      .then(({ data }) => setAnswers(data))
      .catch(() => router.push("/forum"));
    handlers.close();
  };

  const upVote = async (
    _id: Types.ObjectId,
    upvotes: Types.ObjectId[],
    downvotes: Types.ObjectId[]
  ) => {
    if (!userId) return;
    const data = {
      upvotes: [...upvotes, userId],
      downvotes: downvotes?.filter((u) => u !== userId),
    };
    if (upvotes?.find((u) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already upvoted",
      });
      return;
    }
    if (downvotes?.find((u) => u === userId)) {
      data.upvotes = upvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum?_id=${_id}`, data)
      .then(() => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum upvoted successfully.",
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
    handlers.close();
  };

  const downVote = async (
    _id: Types.ObjectId,
    upvotes: Types.ObjectId[],
    downvotes: Types.ObjectId[]
  ) => {
    if (!userId) return;
    const data = {
      upvotes: upvotes.filter((u) => u !== userId),
      downvotes: [...downvotes, userId],
    };
    if (downvotes.find((u) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already downvoted",
      });
      return;
    }
    if (upvotes?.find((u) => u === userId)) {
      data.downvotes = downvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum?_id=${_id}`, data)
      .then(async () => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum downvoted successfully.",
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
    handlers.close();
  };

  const upVoteAnswer = async (
    _id: Types.ObjectId,
    upvotes: Types.ObjectId[],
    downvotes: Types.ObjectId[]
  ) => {
    if (!userId) return;
    const data = {
      upvotes: [...upvotes, userId],
      downvotes: downvotes?.filter((u) => u !== userId),
    };
    if (upvotes?.find((u) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already upvoted",
      });
      return;
    }
    if (downvotes?.find((u) => u === userId)) {
      data.upvotes = upvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum/${String(_id)}/answer`, data)
      .then(() => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum upvoted successfully.",
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
    handlers.close();
  };

  const downVoteAnswer = async (
    _id: Types.ObjectId,
    upvotes: Types.ObjectId[],
    downvotes: Types.ObjectId[]
  ) => {
    if (!userId) return;
    const data = {
      upvotes: upvotes.filter((u) => u !== userId),
      downvotes: [...downvotes, userId],
    };
    if (downvotes.find((u) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already downvoted",
      });
      return;
    }
    if (upvotes?.find((u) => u === userId)) {
      data.downvotes = downvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum/${String(_id)}/answer`, data)
      .then(async () => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum downvoted successfully.",
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
    handlers.close();
  };

  const saveForum = async () => {
    handlers.open();
    let saved = null;
    if (forum?.saved.find((u) => u === userId)) {
      saved = forum?.saved.filter((u) => u !== userId);
    } else {
      saved = forum?.saved && [...forum?.saved, userId];
    }
    await axios
      .put(`/api/forum?_id=${params?.forum_id}`, { saved })
      .then(() => getForum())
      .catch((error) => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: error.response.data.error,
        });
      });
    handlers.close();
  };

  const isCreator = userId === forum?.user?._id;

  const deleteForum = async () => {
    handlers.open();
    axios
      .delete(`/api/forum/${params?.forum_id}`)
      .then(() => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Forum deleted successfully.",
        });
        router.push("/forum");
      })
      .catch(() => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: "Something went wrong.",
        });
      });
    handlers.close();
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: (
        <Text size="sm">This forum will be deleted with the answers.</Text>
      ),
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: deleteForum,
    });

  useEffect(() => {
    getForum();
  }, []);

  if (status === "loading" || !forum || opened) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      {forum && (
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
                <NumberFormatter value={forum?.views?.length} /> times
              </Text>
            </Group>
          </Group>
          <Divider variant="solid" mt="xs" />
          <Group wrap="nowrap" align="flex-start">
            <Stack align="center" mt="lg">
              <ActionIcon
                radius="xl"
                variant="filled"
                onClick={() =>
                  upVote(forum?._id, forum.upvotes, forum.downvotes)
                }
              >
                <IconCaretUpFilled />
              </ActionIcon>
              <Text fw={700}>
                {forum?.upvotes?.length - forum?.downvotes?.length}
              </Text>
              <ActionIcon
                radius="xl"
                variant="filled"
                onClick={() =>
                  downVote(forum?._id, forum.upvotes, forum.downvotes)
                }
              >
                <IconCaretDownFilled />
              </ActionIcon>
              <ActionIcon variant="transparent" onClick={saveForum}>
                {forum?.saved.find((u) => u === userId) ? (
                  <IconBookmarkFilled />
                ) : (
                  <IconBookmark />
                )}
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
              <Group gap="xs">
                <CopyButton
                  value={`https://devloveper.vercel.app/forum/${forum?._id}`}
                >
                  {({ copied, copy }) => (
                    <Button
                      color={copied ? "blue" : "gray"}
                      onClick={copy}
                      variant="subtle"
                      size="compact-sm"
                      leftSection={
                        <IconShare
                          style={{ width: rem(16), height: rem(16) }}
                        />
                      }
                    >
                      {copied ? "Url Copied" : "Share"}
                    </Button>
                  )}
                </CopyButton>
                <Button
                  variant="subtle"
                  size="compact-sm"
                  color="gray"
                  leftSection={
                    <IconUserPlus style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Follow
                </Button>
                {isCreator && (
                  <Button
                    variant="subtle"
                    size="compact-sm"
                    color="gray"
                    leftSection={
                      <IconTrash style={{ width: rem(16), height: rem(16) }} />
                    }
                    onClick={openModal}
                  >
                    Delete
                  </Button>
                )}
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
      )}
      <Divider my="xl" />
      {answers?.map((answer) => (
        <Answer
          answer={answer}
          getForum={getForum}
          upVote={upVoteAnswer}
          downvotes={downVoteAnswer}
        />
      ))}
      <YourAnswer getForum={getForum} handlers={handlers} />
    </Container>
  );
};

export default Page;
