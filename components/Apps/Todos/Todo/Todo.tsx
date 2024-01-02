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
import { useState } from "react";
import { TodoType } from "../Todo.types";

const Todo = ({ todo }: { todo: TodoType }) => {
  const [opened, setOpened] = useState(false);
  const [opened2, setOpened2] = useState(false);

  return (
    <>
      <Paper p="lg" radius="xs" withBorder>
        <Group justify="space-between">
          <Group>
            <Checkbox checked={Boolean(todo?.completedOn)} />
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
