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
  Popover,
  PopoverDropdown,
  PopoverTarget,
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
  IconList,
  IconPlaylistAdd,
  IconStar,
  IconStarFilled,
  IconSun,
} from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { TodoUpdateTypes } from "../Todo.types";
import { TodoProps } from "./Todo.types";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isTomorrow from "dayjs/plugin/isTomorrow";
import { formatDate } from "@/lib/functions";
dayjs.extend(isToday);
dayjs.extend(isTomorrow);

const Todo = ({ todo, getTodos }: TodoProps) => {
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

  const getDueDate = (date: any) => {
    if (dayjs(date).isToday()) return "Today";
    if (dayjs(date).isTomorrow()) return "Tomorrow";
    return dayjs(todo.date).format("dddd, MMMM D");
  };

  return (
    <>
      <Paper px="lg" radius="xs" withBorder>
        <Group justify="space-between" align="center" h={rem(60)}>
          <Group>
            <Checkbox
              checked={Boolean(todo?.completedOn)}
              onChange={() =>
                update({
                  completedOn: Boolean(todo?.completedOn) ? "" : "02-01-2024",
                })
              }
            />
            <Stack gap={0}>
              <Text>{todo?.todo}</Text>
              <Group>
                {todo?.myday && (
                  <Badge
                    p={0}
                    variant="transparent"
                    leftSection={
                      <IconSun style={{ width: rem(16), height: rem(16) }} />
                    }
                  >
                    My Day
                  </Badge>
                )}
                {todo?.date && (
                  <Badge
                    p={0}
                    variant="transparent"
                    leftSection={
                      <IconSun style={{ width: rem(16), height: rem(16) }} />
                    }
                  >
                    Due {getDueDate(todo.date)}
                  </Badge>
                )}
              </Group>
            </Stack>
          </Group>
          <Group>
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
                    <IconSun style={{ width: rem(16), height: rem(16) }} />
                  }
                  onClick={() => update({ myday: !todo.myday })}
                >
                  Add to My Day
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconStar style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Mark as favorite
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCircleCheck
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                >
                  Mark as completed
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
                <MenuDivider />
                <MenuItem
                  leftSection={
                    <IconPlaylistAdd
                      style={{ width: rem(16), height: rem(16) }}
                    />
                  }
                >
                  Create new list from this task
                </MenuItem>
                <Popover opened={opened2}>
                  <PopoverTarget>
                    <MenuItem
                      leftSection={
                        <IconList style={{ width: rem(16), height: rem(16) }} />
                      }
                      rightSection={
                        <IconList
                          onChange={() => setOpened2((o) => !o)}
                          style={{ width: rem(16), height: rem(16) }}
                        />
                      }
                    >
                      Move task to...
                    </MenuItem>
                  </PopoverTarget>
                  <PopoverDropdown>Dropdown</PopoverDropdown>
                </Popover>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </Paper>
    </>
  );
};

export default Todo;
