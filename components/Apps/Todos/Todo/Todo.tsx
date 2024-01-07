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
  rem,
} from "@mantine/core";
import {
  IconCalendarMonth,
  IconCalendarUp,
  IconCalendarX,
  IconCircleCheck,
  IconDotsVertical,
  IconStar,
  IconStarFilled,
  IconStarOff,
  IconSun,
  IconSunOff,
  IconTrash,
} from "@tabler/icons-react";
import dayjs from "dayjs";
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
}: TodoProps) => {
  const [opened, setOpened] = useState(false);

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
                update(todo._id, {
                  completedOn: Boolean(todo?.completedOn)
                    ? ""
                    : dayjs().toISOString(),
                })
              }
              onClick={(e) => e.stopPropagation()}
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
                    c={dayjs(todo.date).isToday() ? "" : "grey"}
                  >
                    Due {getDueDate(todo.date)}
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
              onClick={() => update(todo._id, { favorite: !todo.favorite })}
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
                >
                  <IconDotsVertical
                    style={{ width: rem(20), height: rem(20) }}
                  />
                </ActionIcon>
              </MenuTarget>
              <Menu.Dropdown>
                <MenuItem
                  leftSection={
                    todo.myday ? (
                      <IconSunOff style={{ width: rem(20), height: rem(20) }} />
                    ) : (
                      <IconSun style={{ width: rem(20), height: rem(20) }} />
                    )
                  }
                  onClick={() => update(todo._id, { myday: !todo.myday })}
                >
                  {todo.myday ? "Remove from" : "Add to"} My Day
                </MenuItem>
                <MenuItem
                  leftSection={
                    todo.favorite ? (
                      <IconStarOff
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    ) : (
                      <IconStar style={{ width: rem(20), height: rem(20) }} />
                    )
                  }
                  onClick={() => update(todo._id, { favorite: !todo.favorite })}
                >
                  {todo.favorite ? "Remove from" : "Add to"} favorites
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCircleCheck
                      style={{ width: rem(20), height: rem(20) }}
                    />
                  }
                  onClick={() =>
                    update(todo._id, {
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
                    update(todo._id, { date: dayjs().toISOString() })
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
                    update(todo._id, {
                      date: dayjs().add(1, "day").toISOString(),
                    })
                  }
                >
                  Due tomorrow
                </MenuItem>
                {todo.date && (
                  <MenuItem
                    leftSection={
                      <IconCalendarX
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    }
                    onClick={() => update(todo._id, { date: "" })}
                  >
                    Remove due date
                  </MenuItem>
                )}
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
