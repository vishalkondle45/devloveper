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
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";

const Answer = ({ answer, upVote, downVote, getForum }: any) => {
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

  return (
    <>
      <Group wrap="nowrap" align="flex-start">
        <Stack align="center">
          <ActionIcon
            radius="xl"
            variant="filled"
            onClick={() =>
              upVote(answer?._id, answer?.upvotes, answer?.downvotes)
            }
          >
            <IconCaretUpFilled />
          </ActionIcon>
          <Text fw={700}>
            {answer?.upvotes?.length - answer?.downvotes?.length}
          </Text>
          <ActionIcon
            radius="xl"
            variant="filled"
            onClick={() =>
              downVote(answer?._id, answer?.upvotes, answer?.downvotes)
            }
          >
            <IconCaretDownFilled />
          </ActionIcon>
        </Stack>
        <Stack justify="space-between">
          <ScrollArea>
            <Text
              style={{ whiteSpace: "wrap", pointerEvents: "none" }}
              dangerouslySetInnerHTML={{ __html: answer?.answer || "" }}
            ></Text>
          </ScrollArea>
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
        </Stack>
      </Group>
      <Divider my="xl" />
    </>
  );
};

export default Answer;
