import {
  ActionIcon,
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

  return (
    <>
      <Paper p="lg" radius="xs" withBorder>
        <Group justify="space-between">
          <Group>
            <Checkbox
              checked={Boolean(todo?.completedOn)}
              onChange={() =>
                update({
                  completedOn: Boolean(todo?.completedOn) ? "" : "02-01-2024",
                })
              }
            />
            <Text>{todo?.todo}</Text>
          </Group>
          <Group>
            <ActionIcon variant="transparent">
              {Boolean(todo?.completedOn) ? (
                <IconStar style={{ width: rem(20), height: rem(20) }} />
              ) : (
                <IconStarFilled style={{ width: rem(20), height: rem(20) }} />
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
                >
                  Add to My Day
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconStar style={{ width: rem(16), height: rem(16) }} />
                  }
                >
                  Mark as important
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
                >
                  Due today
                </MenuItem>
                <MenuItem
                  leftSection={
                    <IconCalendarMonth
                      style={{ width: rem(16), height: rem(16) }}
                    />
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
