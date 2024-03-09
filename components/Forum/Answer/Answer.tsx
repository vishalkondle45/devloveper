import {
  ActionIcon,
  Divider,
  Group,
  ScrollArea,
  Stack,
  Text,
} from "@mantine/core";
import { IconCaretDownFilled, IconCaretUpFilled } from "@tabler/icons-react";

const Answer = ({ answer, upVote, downVote }: any) => {
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
        <ScrollArea>
          <Text
            style={{ whiteSpace: "wrap", pointerEvents: "none" }}
            dangerouslySetInnerHTML={{ __html: answer?.answer || "" }}
          ></Text>
        </ScrollArea>
      </Group>
      <Divider my="xl" />
    </>
  );
};

export default Answer;
