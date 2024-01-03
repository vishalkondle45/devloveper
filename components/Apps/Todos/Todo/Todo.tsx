import { formatDate, getDueDate } from "@/lib/functions";
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
import { showNotification } from "@mantine/notifications";
import {
  IconCalendarMonth,
  IconCalendarUp,
  IconCircleCheck,
  IconDotsVertical,
  IconStar,
  IconStarFilled,
  IconStarOff,
  IconSun,
  IconSunOff,
} from "@tabler/icons-react";
import axios from "axios";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { useState } from "react";
import { TodoUpdateTypes } from "../Todo.types";
import { TodoProps } from "./Todo.types";
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const Todo = ({
  todo,
  getTodos,
  withMyDay = true,
  withDueDate = true,
  withListName = true,
}: TodoProps) => {
  const [opened, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);

  const update = async (object: TodoUpdateTypes) => {
    await axios
      .put(`/api/todos?_id=${todo._id}`, object)
      .then((res) => {
        showNotification({
          message: "Updated Successfully",
        });
        getTodos();
      })
      .catch((error) => {});
  };

  return (
    <>
      <Paper shadow="xl" px="xs" radius="xs" withBorder>
        <Group justify="space-between" align="center" h={rem(60)} wrap="nowrap">
          <Group wrap="nowrap" gap="xs">
            <Checkbox
              checked={Boolean(todo?.completedOn)}
              onChange={() =>
                update({
                  completedOn: Boolean(todo?.completedOn) ? "" : formatDate(),
                })
              }
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
                      <IconSun style={{ width: rem(16), height: rem(16) }} />
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
                        style={{ width: rem(16), height: rem(16) }}
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
          <Group justify="right" wrap="nowrap" gap={0}>
            <ActionIcon
              variant="transparent"
              onClick={() => update({ favorite: !todo.favorite })}
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
                      <IconSunOff style={{ width: rem(16), height: rem(16) }} />
                    ) : (
                      <IconSun style={{ width: rem(16), height: rem(16) }} />
                    )
                  }
                  onClick={() => update({ myday: !todo.myday })}
                >
                  {todo.myday ? "Remove from" : "Add to"} My Day
                </MenuItem>
                <MenuItem
                  leftSection={
                    todo.favorite ? (
                      <IconStarOff
                        style={{ width: rem(16), height: rem(16) }}
                      />
                    ) : (
                      <IconStar style={{ width: rem(16), height: rem(16) }} />
                    )
                  }
                  onClick={() => update({ favorite: !todo.favorite })}
                >
                  {todo.favorite ? "Remove from" : "Add to"} favorites
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                  onClick={() =>
                    update({
                      completedOn: Boolean(todo?.completedOn)
                        ? ""
                        : formatDate(),
                    })
                  }
                >
                  Mark as {Boolean(todo?.completedOn) && "not"} completed
                </MenuItem>
                <MenuDivider />
                <MenuItem
                  leftSection={
                    <IconCalendarUp
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                  onClick={() => update({ date: formatDate() })}
                >
                  Due today
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCalendarMonth
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                  onClick={() =>
                    update({ date: formatDate(String(dayjs().add(1, "day"))) })
                  }
                >
                  Due tomorrow
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
