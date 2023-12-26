import { ActionIcon, Divider, Group, Paper, Text } from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconColorSwatch,
  IconCopy,
  IconPinned,
  IconPinnedFilled,
  IconTrash,
} from "@tabler/icons-react";
import { NoteProps } from "./Note.types";

const Note = ({ note, updateNote, cloneNote }: NoteProps) => {
  const { hovered, ref } = useHover();
  const pin = () => updateNote(note._id, { pinned: !note.pinned });
  const clone = () =>
    cloneNote({ title: note.title, note: note.note, color: note.color });

  return (
    <>
      <Paper
        ref={ref}
        px="md"
        bg={note.color}
        c="white"
        shadow="xl"
        withBorder
        pb="md"
      >
        {note.title && (
          <>
            <Text dangerouslySetInnerHTML={{ __html: note?.title }}></Text>
            <Divider c={"white"} />
          </>
        )}
        {note.note && (
          <Text dangerouslySetInnerHTML={{ __html: note?.note }}></Text>
        )}
        {hovered && (
          <Group justify="space-around" ref={ref}>
            <ActionIcon color="white" onClick={pin} variant="transparent">
              {note.pinned ? <IconPinnedFilled /> : <IconPinned />}
            </ActionIcon>
            <ActionIcon color="white" onClick={clone} variant="transparent">
              <IconCopy />
            </ActionIcon>
            <ActionIcon color="white" variant="transparent">
              <IconTrash />
            </ActionIcon>
            <ActionIcon color="white" variant="transparent">
              <IconColorSwatch />
            </ActionIcon>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Note;
