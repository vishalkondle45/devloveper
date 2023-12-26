import { ActionIcon, Group, Paper, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconColorSwatch,
  IconCopy,
  IconPinned,
  IconPinnedFilled,
  IconTrash,
} from "@tabler/icons-react";
import { NoteProps } from "./Note.types";

const Note = ({ note, updateNote }: NoteProps) => {
  const { hovered, ref } = useHover();
  const pin = () => updateNote(note._id, { pinned: !note.pinned });

  return (
    <>
      <Paper
        ref={ref}
        px="md"
        color={note.color}
        shadow="xl"
        withBorder
        pb="md"
      >
        {note.title && (
          <Text dangerouslySetInnerHTML={{ __html: note?.title }}></Text>
        )}
        {note.note && (
          <Text dangerouslySetInnerHTML={{ __html: note?.note }}></Text>
        )}
        {hovered && (
          <Group justify="space-around" ref={ref}>
            <ActionIcon onClick={pin} variant="transparent">
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
