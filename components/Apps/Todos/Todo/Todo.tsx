import { getDueDate } from "@/lib/functions";
import {
  ActionIcon,
  Badge,
  Checkbox,
  Group,
  Menu,
  MenuDivider,
  MenuItem,
  MenuTarget,
  Paper,
  Stack,
  Text,
  getThemeColor,
  rem,
  useMantineTheme,
} from "@mantine/core";
import {
  IconCalendarMonth,
  IconCalendarUp,
  IconCalendarX,
  IconCircleCheck,
  IconDotsVertical,
  IconListNumbers,
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
import { useState } from "react";
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

  return (
    <>
      <Paper
        shadow="xl"
        px="xs"
        radius="xs"
        withBorder
        onClick={() => editTodo(todo)}
      >
        <Group justify="space-between" align="center" h={rem(60)} wrap="nowrap">
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
              <Group gap="xs" wrap="nowrap">
                {todo?.myday && withMyDay && (
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
                {todo?.list && withListName && (
                  <Badge
                    size="xs"
                    variant="outline"
                    color={
                      todoLists?.find(({ _id }) => _id === todo?.list)?.color
                    }
                  >
                    {todoLists?.find(({ _id }) => _id === todo?.list)?.title}
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
              onClick={() => update(todo?._id, { favorite: !todo?.favorite })}
              color={color}
            >
              {Boolean(todo?.favorite) ? (
                <IconStarFilled style={{ width: rem(20), height: rem(20) }} />
              ) : (
                <IconStar style={{ width: rem(20), height: rem(20) }} />
              )}
            </ActionIcon>
            <Menu radius="xs" opened={opened} onChange={setOpened}>
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
                    todo?.favorite ? (
                      <IconStarOff
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    ) : (
                      <IconStar style={{ width: rem(20), height: rem(20) }} />
                    )
                  }
                  onClick={() =>
                    update(todo?._id, { favorite: !todo?.favorite })
                  }
                >
                  {todo?.favorite ? "Remove from" : "Add to"} favorites
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
                    <IconListNumbers
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() => createNewTodoList(todo?._id)}
                >
                  Create new list from this todo
                </MenuItem>
                <Menu.Divider />
                <MenuItem
                  color="red"
                  leftSection={
                    <IconTrash style={{ width: rem(20), height: rem(20) }} />
                  }
                  onClick={() => remove(todo?._id)}
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
