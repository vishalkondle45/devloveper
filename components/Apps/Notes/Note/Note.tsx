import ColorSwatcher from "@/components/Color/ColorSwatcher";
import { colors } from "@/lib/constants";
import {
  ActionIcon,
  Divider,
  Group,
  Paper,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Text,
  parseThemeColor,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconColorSwatch,
  IconCopy,
  IconPencil,
  IconPinned,
  IconPinnedFilled,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import { NoteProps } from "./Note.types";

const Note = ({
  note,
  updateNote,
  cloneNote,
  deleteNote,
  editNote,
}: NoteProps) => {
  const [opened, setOpened] = useState(false);
  const { hovered, ref } = useHover();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const parsedColor = parseThemeColor({ color: note.color, theme });
  const pin = () => updateNote(note._id, { pinned: !note.pinned });
  const clone = () =>
    cloneNote({ title: note.title, note: note.note, color: note.color });
  const remove = () => deleteNote(note._id);
  const updateColor = (color: string) => updateNote(note._id, { color });

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
            <ActionIcon
              color={textColor}
              variant="transparent"
              onClick={() => editNote(note)}
            >
              <IconPencil />
            </ActionIcon>
            <ActionIcon
              color={textColor}
              onClick={remove}
              variant="transparent"
            >
              <IconTrash />
            </ActionIcon>
            <Popover
              width={330}
              position="top-end"
              opened={opened}
              onChange={setOpened}
            >
              <PopoverTarget>
                <ActionIcon
                  color={textColor}
                  variant="transparent"
                  onClick={() => setOpened((o) => !o)}
                >
                  <IconColorSwatch />
                </ActionIcon>
              </PopoverTarget>
              <PopoverDropdown>
                <Group wrap="wrap">
                  {colors.map((color) => (
                    <ColorSwatcher
                      key={color}
                      selected={color == note.color}
                      color={color}
                      updateColor={updateColor}
                    />
                  ))}
                  <ColorSwatcher
                    selected={note.color == ""}
                    color=""
                    updateColor={updateColor}
                  />
                </Group>
              </PopoverDropdown>
            </Popover>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Note;
