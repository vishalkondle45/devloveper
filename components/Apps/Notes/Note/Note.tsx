import ColorSwatcher from "@/components/Color/ColorSwatcher";
import { colors } from "@/lib/constants";
import {
  ActionIcon,
  Badge,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
  ThemeIcon,
  parseThemeColor,
  rem,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import {
  IconArrowBackUp,
  IconColorSwatch,
  IconCopy,
  IconPencil,
  IconPinned,
  IconPinnedFilled,
  IconTags,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useEffect, useState } from "react";
import { NoteProps } from "./Note.types";
const Note = ({
  note,
  labels,
  updateNote,
  cloneNote,
  deleteNote,
  editNote,
  recoverNote,
  getNotes,
}: NoteProps) => {
  const [opened, setOpened] = useState(false);
  const [opened1, setOpened1] = useState(false);
  const [opened2, handlers] = useDisclosure();
  const { hovered, ref } = useHover();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const parsedColor = parseThemeColor({ color: note.color, theme });
  const pin = () =>
    updateNote && updateNote(note._id, { pinned: !note.pinned });
  const clone = () =>
    cloneNote &&
    cloneNote({ title: note.title, note: note.note, color: note.color });
  const remove = () => deleteNote(note._id);
  const updateColor = (color: string) =>
    updateNote && updateNote(note._id, { color });
  const recover = () => recoverNote && recoverNote(note._id);

  const textColor = colorScheme === "dark" ? "white" : "dark";
  const bgColor = parsedColor.isThemeColor
    ? `var(${parsedColor.variable})`
    : parsedColor.value;

  const updateLabel = async (_id: Types.ObjectId | undefined) => {
    handlers.open();
    await axios
      .put(`/api/notes/${note._id}/update-label/${_id}`)
      .then((res) => {
        if (getNotes) {
          getNotes();
          handlers.close();
        }
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    setOpened(false);
    setOpened1(false);
  }, [note]);

  return (
    <>
      <LoadingOverlay visible={opened2} />
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
        {labels && (
          <Group gap="xs" mb="xs">
            {note?.labels?.map((label) => (
              <Badge
                variant="default"
                rightSection={
                  <IconX
                    style={{ width: rem(16), height: rem(16) }}
                    onClick={() => updateLabel(label)}
                  />
                }
                ref={ref}
              >
                {labels?.find((item) => item?._id === label)?.title}
              </Badge>
            ))}
          </Group>
        )}
        {hovered && (
          <Group justify="space-between" ref={ref}>
            {note.trashed ? (
              <>
                <ActionIcon
                  color={textColor}
                  onClick={recover}
                  variant="transparent"
                  title="Recover note"
                >
                  <IconArrowBackUp />
                </ActionIcon>
              </>
            ) : (
              <>
                <ActionIcon
                  color={textColor}
                  onClick={pin}
                  variant="transparent"
                  title={note.pinned ? "Unpin" : "Pin" + " note"}
                >
                  {note.pinned ? <IconPinnedFilled /> : <IconPinned />}
                </ActionIcon>
                <ActionIcon
                  color={textColor}
                  onClick={clone}
                  variant="transparent"
                  title="Clone note"
                >
                  <IconCopy />
                </ActionIcon>
                <ActionIcon
                  color={textColor}
                  variant="transparent"
                  onClick={() => editNote && editNote(note)}
                  title="Edit note"
                >
                  <IconPencil />
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
                      title="Change theme"
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
                <Popover
                  width={250}
                  position="top-end"
                  opened={opened1}
                  onChange={setOpened1}
                >
                  <PopoverTarget>
                    <ActionIcon
                      color={textColor}
                      variant="transparent"
                      onClick={() => setOpened1((o) => !o)}
                      title="Update Labels"
                    >
                      <IconTags />
                    </ActionIcon>
                  </PopoverTarget>
                  <PopoverDropdown>
                    <Stack gap="xs">
                      {labels?.length ? (
                        labels?.map((label) => (
                          <Group
                            key={String(label._id)}
                            onClick={() => updateLabel(label?._id)}
                          >
                            <Checkbox
                              checked={Boolean(
                                note.labels.find((i) => i === label._id)
                              )}
                            />
                            <Text>{label?.title}</Text>
                          </Group>
                        ))
                      ) : (
                        <Badge
                          variant="transparent"
                          leftSection={
                            <ThemeIcon radius="xl" size="xs" color="red">
                              <IconX />
                            </ThemeIcon>
                          }
                        >
                          No labels found
                        </Badge>
                      )}
                    </Stack>
                  </PopoverDropdown>
                </Popover>
              </>
            )}
            <ActionIcon
              color={textColor}
              onClick={remove}
              variant="transparent"
              title={note.trashed ? "Delete forever" : "Move to trash"}
            >
              <IconTrash />
            </ActionIcon>
          </Group>
        )}
      </Paper>
    </>
  );
};

export default Note;
