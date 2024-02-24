import {
  ActionIcon,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import {
  IconCaretDownFilled,
  IconCaretUpFilled,
  IconCheck,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";

const Answer = ({ answer, getForum }: any) => {
  const upVote = async () => {
    await axios
      .put(`/api/forum/upvote`, { _id: answer._id })
      .then(() => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Answer liked successfully.",
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
      .put(`/api/forum/downvote`, { _id: answer._id })
      .then(async () => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          message: "Answer disliked successfully.",
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

  return (
    <>
      <Group wrap="nowrap" align="flex-start">
        <Stack align="center">
          <ActionIcon radius="xl" variant="filled" onClick={upVote}>
            <IconCaretUpFilled />
          </ActionIcon>
          <Text fw={700}>{answer?.votes}</Text>
          <ActionIcon radius="xl" variant="filled" onClick={downVote}>
            <IconCaretDownFilled />
          </ActionIcon>
        </Stack>
        <ScrollArea>
          <Text
            style={{ whiteSpace: "wrap" }}
            dangerouslySetInnerHTML={{ __html: answer?.answer || "" }}
          ></Text>
        </ScrollArea>
      </Group>
      <Divider my="xl" />
    </>
  );
};

export default Answer;
