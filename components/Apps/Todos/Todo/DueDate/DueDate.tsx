import { getDueDate } from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Group,
  Menu,
  MenuTarget,
  Text,
  rem,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useHover } from "@mantine/hooks";
import {
  IconCalendarDown,
  IconCalendarMonth,
  IconCalendarShare,
  IconCalendarTime,
  IconCalendarUp,
  IconX,
} from "@tabler/icons-react";
import dayjs, { Dayjs } from "dayjs";
import weekday from "dayjs/plugin/weekday";
import { useState } from "react";
import { DueDateProps } from "./DueDate.types";
dayjs.extend(weekday);

const DueDate = ({ update, todo }: DueDateProps) => {
  const { hovered, ref } = useHover();
  const [opened, setOpened] = useState(false);
  const [value, setValue] = useState<any>(
    todo?.date ? new Date(todo?.date) : null
  );

  const onUpdate = (value?: string | Date | Dayjs | null) => {
    update(todo?._id, {
      date: value !== null ? dayjs(value).toISOString() : "",
    }).then(() => {
      setValue(value ? dayjs(value) : "");
      setOpened(false);
    });
  };

  return (
    <>
      {todo && (
        <Menu
          opened={opened}
          onChange={setOpened}
          radius="xs"
          shadow="md"
          width={200}
          closeOnItemClick={false}
          position="bottom-start"
        >
          <MenuTarget>
            <Group wrap="nowrap" justify="space-between" ref={ref}>
              <Button
                px={0}
                variant="transparent"
                justify="left"
                leftSection={
                  <IconCalendarMonth
                    style={{ width: rem(18), height: rem(18) }}
                  />
                }
                color={value ? undefined : "gray"}
                fullWidth
              >
                {value ? getDueDate(value) : "Add due date"}
              </Button>
              {Boolean(value) && hovered && (
                <ActionIcon
                  variant="transparent"
                  onClick={() => onUpdate(null)}
                >
                  <IconX />
                </ActionIcon>
              )}
            </Group>
          </MenuTarget>
          <Menu.Dropdown>
            <Menu.Label>
              <Text fw={700} size="md" ta="center">
                Due
              </Text>
            </Menu.Label>
            <Menu.Divider />
            <Menu.Item
              leftSection={
                <IconCalendarUp style={{ width: rem(18), height: rem(18) }} />
              }
              onClick={() => onUpdate(dayjs())}
            >
              Today
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCalendarShare
                  style={{ width: rem(18), height: rem(18) }}
                />
              }
              onClick={() => onUpdate(dayjs().add(1, "day"))}
            >
              Tomorrow
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCalendarDown style={{ width: rem(18), height: rem(18) }} />
              }
              onClick={() => onUpdate(dayjs().weekday(0).add(8, "days"))}
            >
              Next week
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              leftSection={
                <IconCalendarTime style={{ width: rem(18), height: rem(18) }} />
              }
            >
              <DatePickerInput
                placeholder="Pick a date"
                value={value}
                onChange={(value) => {
                  if (value) {
                    update(todo?._id, { date: dayjs(value).toISOString() });
                    setValue(dayjs(value));
                  } else {
                    setValue(null);
                  }
                }}
                styles={{
                  input: {
                    border: "none",
                    padding: 0,
                    backgroundColor: "transparent",
                  },
                }}
                radius="xs"
              />
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      )}
    </>
  );
};

export default DueDate;
