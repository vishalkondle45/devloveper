import { colors, sortOptions } from "@/lib/constants";
import {
  ActionIcon,
  ColorSwatch,
  Group,
  Menu,
  Popover,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure, useFocusTrap } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import {
  IconArrowsSort,
  IconChevronDown,
  IconChevronRight,
  IconChevronUp,
  IconCursorText,
  IconDots,
  IconList,
  IconPrinter,
  IconSun,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { KeyboardEvent, useState } from "react";
import { ListUpdateTypes, Props, SortOptionProps } from "./ListTitle.types";

const ListTitle = (props: Props) => {
  const [opened, setOpened] = useState(false);
  const [openEdit, { open, close }] = useDisclosure(false);
  const [title, setTitle] = useState("");
  const params = useParams();
  const theme = useMantineTheme();
  const focusTrapRef = useFocusTrap(true);
  const router = useRouter();

  const openEditHandler = () => {
    open();
    setTitle(props.title);
    setOpened(false);
  };

  const closeEditHandler = () => {
    if (title && props.title !== title) {
      update({ title: title });
    }
    close();
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      closeEditHandler();
    }
  };

  const update = async (object: ListUpdateTypes) => {
    if (props?.getTodoLists) {
      await axios
        .put(`/api/todos/lists?_id=${params.list}`, object)
        .then((res) => {
          props?.getTodoLists?.();
        })
        .catch((error) => {});
    }
  };

  const remove = () => {
    setOpened(false);
    if (!!params.list) {
      modals.openConfirmModal({
        title: (
          <Text fw={700}>"{props.title}" will be permanently deleted.</Text>
        ),
        centered: true,
        children: (
          <Text fw={700}>All the todos added to list will be deleted.</Text>
        ),
        labels: { confirm: "Delete list", cancel: "Cancel" },
        confirmProps: { color: "red" },
        radius: "xs",
        onConfirm: async () =>
          await axios
            .delete(`/api/todos/lists?_id=${String(params.list)}`)
            .then(() => {
              router.push("/todos");
            }),
      });
    }
  };

  return (
    <Stack gap="xs" my="sm">
      <Group wrap="nowrap" justify="space-between">
        <Group wrap="nowrap" justify="left" gap="xs">
          {openEdit && !!props?.getTodoLists ? (
            <TextInput
              value={title}
              onChange={(e) => setTitle(e.currentTarget.value)}
              onBlur={closeEditHandler}
              ref={focusTrapRef}
              onKeyDown={handleKeyPress}
            />
          ) : (
            <>
              <ThemeIcon color={props.color} variant="transparent">
                {props.icon ? <props.icon /> : <IconList />}
              </ThemeIcon>
              <Text
                c={props.color || theme.primaryColor}
                maw={rem("60vw")}
                fz={rem(24)}
                fw={700}
                truncate="end"
                onClick={openEditHandler}
              >
                {props.title}
              </Text>
            </>
          )}
          <Menu
            closeOnItemClick={false}
            opened={opened}
            onChange={setOpened}
            shadow="md"
            width={200}
          >
            <Menu.Target>
              <ActionIcon color="gray" variant="transparent">
                <IconDots stroke={1} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label ta="center">List options</Menu.Label>
              {!!props?.getTodoLists && (
                <>
                  <Menu.Item
                    leftSection={
                      <IconCursorText
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    }
                    onClick={openEditHandler}
                  >
                    Rename list
                  </Menu.Item>
                  <Popover width={330} offset={4} position="bottom">
                    <Popover.Target>
                      <Menu.Item
                        leftSection={
                          <IconSun
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        }
                        rightSection={
                          <IconChevronRight
                            style={{ width: rem(16), height: rem(16) }}
                          />
                        }
                      >
                        Change theme
                      </Menu.Item>
                    </Popover.Target>
                    <Popover.Dropdown>
                      <Group wrap="wrap">
                        {colors.map((color) => (
                          <ColorSwatch
                            key={color}
                            style={{ cursor: "pointer" }}
                            color={color}
                            onClick={() => update({ color })}
                          />
                        ))}
                      </Group>
                    </Popover.Dropdown>
                  </Popover>
                </>
              )}
              <Menu.Item
                leftSection={
                  <IconPrinter style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Print list
              </Menu.Item>
              {!!props?.getTodoLists && (
                <>
                  <Menu.Divider />
                  <Menu.Item
                    leftSection={
                      <IconTrash style={{ width: rem(16), height: rem(16) }} />
                    }
                    color="red"
                    onClick={remove}
                  >
                    Delete list
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon color={props.color} variant="transparent">
              <IconArrowsSort stroke={1} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label ta="center">Sort by</Menu.Label>
            {sortOptions.map((item: SortOptionProps) => (
              <Menu.Item
                key={item.name}
                leftSection={
                  <item.icon style={{ width: rem(16), height: rem(16) }} />
                }
                onClick={() =>
                  props.setSort(() => ({ sort: "asc", by: item.name }))
                }
              >
                {item.label}
              </Menu.Item>
            ))}
          </Menu.Dropdown>
        </Menu>
      </Group>
      {props.sort.by && (
        <Group gap="xs" justify="right">
          <ActionIcon
            color="gray"
            variant="transparent"
            size="sm"
            onClick={() =>
              props.setSort((old) => ({
                ...old,
                sort: old.sort === "asc" ? "desc" : "asc",
              }))
            }
          >
            {props.sort.sort === "asc" ? (
              <IconChevronUp />
            ) : (
              <IconChevronDown />
            )}
          </ActionIcon>
          <Text fz="sm" fw={700}>
            {sortOptions.find((item) => item.name === props.sort.by)?.label}
          </Text>
          <ActionIcon
            color="gray"
            variant="transparent"
            size="sm"
            onClick={() =>
              props.setSort((old) => ({ ...old, sort: "asc", by: "" }))
            }
          >
            <IconX />
          </ActionIcon>
        </Group>
      )}
    </Stack>
  );
};

export default ListTitle;
