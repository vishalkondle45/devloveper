import {
  ActionIcon,
  Button,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import ForumUser from "../ForumUser/ForumUser";

const Answer = ({ answer, getForum, handlers }: any) => {
  const { data } = useSession();
  const userId = data?.user?._id;

  const upVote = async () => {
    if (!userId) return;
    const data = {
      upvotes: [...answer.upvotes, userId],
      downvotes: answer.downvotes?.filter((u: Types.ObjectId) => u !== userId),
    };
    if (answer.upvotes?.find((u: Types.ObjectId) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already upvoted",
      });
      return;
    }
    if (answer.downvotes?.find((u: Types.ObjectId) => u === userId)) {
      data.upvotes = answer.upvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum/${String(answer._id)}/answer`, data)
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

  const downVote = async () => {
    if (!userId) return;
    const data = {
      upvotes: answer.upvotes.filter((u: Types.ObjectId) => u !== userId),
      downvotes: [...answer.downvotes, userId],
    };
    if (answer.downvotes.find((u: Types.ObjectId) => u === userId)) {
      notifications.show({
        icon: <IconX />,
        color: "red",
        message: "Already downvoted",
      });
      return;
    }
    if (answer.upvotes?.find((u: Types.ObjectId) => u === userId)) {
      data.downvotes = answer.downvotes;
    }
    handlers.open();
    await axios
      .put(`/api/forum/${String(answer._id)}/answer`, data)
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

  const deleteAnswer = async () => {
    await axios.delete(`/api/forum/${answer?.forum}/answer?_id=${answer?._id}`);
    getForum();
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
      onConfirm: deleteAnswer,
    });

  const isCreator = String(userId) === answer?.user?._id;

  return (
    <>
      <Group wrap="nowrap" align="flex-start">
        <Stack align="center">
          <ActionIcon radius="xl" variant="filled" onClick={upVote}>
            <IconCaretUpFilled />
          </ActionIcon>
          <Text fw={700}>
            {answer?.upvotes?.length - answer?.downvotes?.length}
          </Text>
          <ActionIcon radius="xl" variant="filled" onClick={downVote}>
            <IconCaretDownFilled />
          </ActionIcon>
        </Stack>
        <Stack justify="space-between">
          <ScrollArea>
            <Text
              mt="-md"
              style={{ whiteSpace: "wrap", pointerEvents: "none" }}
              dangerouslySetInnerHTML={{ __html: answer?.answer || "" }}
            ></Text>
          </ScrollArea>
        </Stack>
      </Group>
      <Group ml={rem(42)} justify="space-between">
        {isCreator && (
          <Button
            mt="md"
            variant="subtle"
            size="compact-sm"
            w="min-content"
            color="gray"
            leftSection={
              <IconTrash style={{ width: rem(16), height: rem(16) }} />
            }
            onClick={openModal}
          >
            Delete
          </Button>
        )}
        <ForumUser createdAt={answer.createdAt} name={answer.user.name} />
      </Group>
      <Divider my="xl" />
    </>
  );
};

export default Answer;
