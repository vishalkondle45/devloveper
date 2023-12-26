import { ActionIcon, Group, Paper, Text } from "@mantine/core";
import {
  IconColorSwatch,
  IconCopy,
  IconPinned,
  IconPinnedFilled,
  IconTrash,
} from "@tabler/icons-react";
import { NoteProps } from "./Note.types";
import { useHover } from "@mantine/hooks";

const Note = ({ note }: NoteProps) => {
  const { hovered, ref } = useHover();
  return (
    <>
      <Paper ref={ref} p="md" color={note.color} shadow="xl" withBorder>
        {note.title && (
          <Text dangerouslySetInnerHTML={{ __html: note?.title }}></Text>
        )}
        {note.note && (
          <Text dangerouslySetInnerHTML={{ __html: note?.note }}></Text>
        )}
        {hovered && (
          <Group justify="space-around" ref={ref}>
            <ActionIcon variant="transparent">
              {note.pinned ? <IconPinnedFilled /> : <IconPinned />}
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconCopy />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconTrash />
            </ActionIcon>
            <ActionIcon variant="transparent">
              <IconColorSwatch />
            </ActionIcon>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Note;
