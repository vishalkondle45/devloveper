import {
  ActionIcon,
  Divider,
  Group,
  Paper,
  Text,
  parseThemeColor,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
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
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const parsedColor = parseThemeColor({ color: note.color, theme });
  const pin = () => updateNote(note._id, { pinned: !note.pinned });
  const clone = () =>
    cloneNote({ title: note.title, note: note.note, color: note.color });
  const textColor = colorScheme === "dark" ? "white" : "dark";
  const bgColor = parsedColor.isThemeColor
    ? `var(${parsedColor.variable})`
    : parsedColor.value;

  return (
    <>
      <Paper
        ref={ref}
        px="md"
        bg={bgColor}
        c={textColor}
        shadow="xl"
        withBorder
        pb="md"
      >
        {note.title && (
          <>
            <Text dangerouslySetInnerHTML={{ __html: note?.title }}></Text>
            <Divider color={textColor} />
          </>
        )}
        {note.note && (
          <Text dangerouslySetInnerHTML={{ __html: note?.note }}></Text>
        )}
        {hovered && (
          <Group justify="space-around" ref={ref}>
            <ActionIcon color={textColor} onClick={pin} variant="transparent">
              {note.pinned ? <IconPinnedFilled /> : <IconPinned />}
            </ActionIcon>
            <ActionIcon color={textColor} onClick={clone} variant="transparent">
              <IconCopy />
            </ActionIcon>
            <ActionIcon color={textColor} variant="transparent">
              <IconTrash />
            </ActionIcon>
            <ActionIcon color={textColor} variant="transparent">
              <IconColorSwatch />
            </ActionIcon>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Note;
