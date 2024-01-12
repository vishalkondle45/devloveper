import { getDueDate } from "@/lib/functions";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Menu,
  MenuDivider,
  MenuItem,
  MenuTarget,
  Paper,
  Popover,
  PopoverDropdown,
  PopoverTarget,
  Stack,
  Text,
  ThemeIcon,
  getThemeColor,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconArrowRight,
  IconCalendarMonth,
  IconCalendarUp,
  IconCalendarX,
  IconChevronRight,
  IconCircle,
  IconCircleCheck,
  IconCopy,
  IconDotsVertical,
  IconList,
  IconPlaylistAdd,
  IconStar,
  IconStarFilled,
  IconStarOff,
  IconSun,
  IconSunOff,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import { Types } from "mongoose";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { TodoProps } from "./Todo.types";
const Todo = ({
  todo,
  withMyDay = true,
  withDueDate = true,
  withListName = true,
  editTodo,
  update,
  remove,
  todoLists,
  color,
}: TodoProps) => {
  const [opened, setOpened] = useState(false);
  const theme = useMantineTheme();
  const router = useRouter();

  const createNewTodoList = async (_id?: Types.ObjectId) => {
    const { data } = await axios.post("/api/todos/lists");
    await axios.put(`/api/todos?_id=${_id}`, { list: data });
    router.push(`/todos/${data}`);
  };

  const copyToTodoList = async (list: string) => {
    await axios.post(`/api/todos`, { ...todo, list, _id: undefined });
    update(todo._id, {});
  };

  const [opened1, { close, open }] = useDisclosure(false);
  const [opened2, { close: close2, open: open2 }] = useDisclosure(false);

  const removeTodo = () => {
    setOpened(false);
    remove(todo);
  };

  useEffect(() => {
    close();
    close2();
    setOpened(false);
  }, [todo]);

  return (
    <>
      <Paper
        shadow="xl"
        px="xs"
        withBorder
        onClick={() => editTodo(todo)}
        py={"xs"}
      >
        <Group
          justify="space-between"
          align="center"
          mih={rem(30)}
          wrap="nowrap"
        >
          <Group wrap="nowrap" gap="xs">
            <Checkbox
              checked={Boolean(todo?.completedOn)}
              onChange={() =>
                update(todo?._id, {
                  completedOn: Boolean(todo?.completedOn)
                    ? ""
                    : dayjs().toISOString(),
                })
              }
              color={color}
              onClick={(e) => e.stopPropagation()}
              styles={{ input: { borderColor: getThemeColor(color, theme) } }}
            />
            <Stack gap={0}>
              <Text>{todo?.todo}</Text>
              <Group gap="xs">
                {todo?.list && withListName && (
                  <>
                    <Badge
                      size="xs"
                      variant="outline"
                      color={
                        todoLists?.find(({ _id }) => _id === todo?.list)?.color
                      }
                    >
                      {todoLists?.find(({ _id }) => _id === todo?.list)?.title}
                    </Badge>
                    <ThemeIcon size={rem(4)}>
                      <IconCircle />
                    </ThemeIcon>
                  </>
                )}
                {todo?.myday && withMyDay && (
                  <>
                    <Badge
                      size="xs"
                      p={0}
                      variant="transparent"
                      c="gray"
                      leftSection={
                        <IconSun style={{ width: rem(20), height: rem(20) }} />
                      }
                    >
                      My Day
                    </Badge>
                    <ThemeIcon size={rem(4)}>
                      <IconCircle />
                    </ThemeIcon>
                  </>
                )}
                {todo?.date && withDueDate && (
                  <Badge
                    size="xs"
                    p={0}
                    variant="transparent"
                    leftSection={
                      <IconCalendarMonth
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    }
                    c={dayjs(todo?.date).isToday() ? "" : "grey"}
                  >
                    Due {getDueDate(todo?.date)}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Group>
          <Group
            justify="right"
            wrap="nowrap"
            gap={0}
            onClick={(e) => e.stopPropagation()}
          >
            <ActionIcon
              variant="transparent"
              onClick={() => update(todo?._id, { important: !todo?.important })}
              color={color}
            >
              {Boolean(todo?.important) ? (
                <IconStarFilled style={{ width: rem(20), height: rem(20) }} />
              ) : (
                <IconStar style={{ width: rem(20), height: rem(20) }} />
              )}
            </ActionIcon>
            <Menu opened={opened} onChange={setOpened} closeOnItemClick={false}>
              <MenuTarget>
                <ActionIcon
                  variant="transparent"
                  onClick={() => setOpened((o) => !o)}
                  color={color}
                >
                  <IconDotsVertical
                    style={{ width: rem(20), height: rem(20) }}
                  />
                </ActionIcon>
              </MenuTarget>
              <Menu.Dropdown>
                <MenuItem
                  leftSection={
                    todo?.myday ? (
                      <IconSunOff style={{ width: rem(20), height: rem(20) }} />
                    ) : (
                      <IconSun style={{ width: rem(20), height: rem(20) }} />
                    )
                  }
                  onClick={() => update(todo?._id, { myday: !todo?.myday })}
                >
                  {todo?.myday ? "Remove from" : "Add to"} My Day
                </MenuItem>
                <MenuItem
                  leftSection={
                    todo?.important ? (
                      <IconStarOff
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    ) : (
                      <IconStar style={{ width: rem(20), height: rem(20) }} />
                    )
                  }
                  onClick={() =>
                    update(todo?._id, { important: !todo?.important })
                  }
                >
                  {todo?.important ? "Remove importance" : "Mark as important"}
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCircleCheck
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() =>
                    update(todo?._id, {
                      completedOn: Boolean(todo?.completedOn)
                        ? ""
                        : dayjs().toISOString(),
                    })
                  }
                >
                  Mark as {Boolean(todo?.completedOn) && "not"} completed
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  leftSection={
                    <IconCalendarUp
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() =>
                    update(todo?._id, { date: dayjs().toISOString() })
                  }
                >
                  Due today
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCalendarMonth
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() =>
                    update(todo?._id, {
                      date: dayjs().add(1, "day").toISOString(),
                    })
                  }
                >
                  Due tomorrow
                </MenuItem>
                {todo?.date && (
                  <MenuItem
                    leftSection={
                      <IconCalendarX
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    }
                    onClick={() => update(todo?._id, { date: "" })}
                  >
                    Remove due date
                  </MenuItem>
                )}
                <Menu.Divider />
                <MenuItem
                  leftSection={
                    <IconPlaylistAdd
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() => createNewTodoList(todo?._id)}
                >
                  Create new list from this todo
                </MenuItem>
                <Popover position="right" opened={opened1} offset={0}>
                  <PopoverTarget>
                    <MenuItem
                      leftSection={
                        <IconArrowRight
                          style={{ width: rem(20), height: rem(20) }}
                        />
                      }
                      rightSection={
                        <IconChevronRight
                          style={{ width: rem(20), height: rem(20) }}
                        />
                      }
                      onMouseEnter={open}
                      onMouseLeave={close}
                    >
                      Move task to...
                    </MenuItem>
                  </PopoverTarget>
                  <PopoverDropdown
                    p={0}
                    onMouseEnter={open}
                    onMouseLeave={close}
                  >
                    <Stack gap={0}>
                      {todoLists?.map((item) => (
                        <Button
                          variant="subtle"
                          justify="left"
                          color="gray"
                          onClick={() => update(todo?._id, { list: item._id })}
                          leftSection={
                            <IconList
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                          key={String(item._id)}
                        >
                          {item?.title}
                        </Button>
                      ))}
                    </Stack>
                  </PopoverDropdown>
                </Popover>
                <Popover position="right" opened={opened2} offset={0}>
                  <PopoverTarget>
                    <MenuItem
                      leftSection={
                        <IconCopy style={{ width: rem(20), height: rem(20) }} />
                      }
                      rightSection={
                        <IconChevronRight
                          style={{ width: rem(20), height: rem(20) }}
                        />
                      }
                      onMouseEnter={open2}
                      onMouseLeave={close2}
                    >
                      Copy task to...
                    </MenuItem>
                  </PopoverTarget>
                  <PopoverDropdown
                    p={0}
                    onMouseEnter={open2}
                    onMouseLeave={close2}
                  >
                    <Stack gap={0}>
                      {todoLists?.map((item) => (
                        <Button
                          variant="subtle"
                          justify="left"
                          color="gray"
                          onClick={() => copyToTodoList(item._id)}
                          leftSection={
                            <IconList
                              style={{ width: rem(14), height: rem(14) }}
                            />
                          }
                          key={String(item._id)}
                        >
                          {item?.title}
                        </Button>
                      ))}
                    </Stack>
                  </PopoverDropdown>
                </Popover>
                <Menu.Divider />
                <MenuItem
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(20), height: rem(20) }} />
                  }
                  onClick={removeTodo}
                >
                  Delete task
                </MenuItem>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Paper>
    </>
  );
};

export default Todo;
