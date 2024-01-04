import { getDueDate } from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Popover,
  PopoverTarget,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useDebouncedValue } from "@mantine/hooks";
import {
  IconCalendarMonth,
  IconLayoutSidebarRightCollapse,
  IconStar,
  IconStarFilled,
  IconSun,
  IconTrash,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { EditTodoProps } from "../Todo.types";
import Category from "../Todo/Category";

const EditTodo = ({ close, form, update }: EditTodoProps) => {
  const [opened1, setOpened1] = useState(false);
  const [value, setValue] = useState<Date | null>(null);
  const [todo] = useDebouncedValue(form.values.todo, 200);

  useEffect(() => {
    update(form.values._id, { todo });
  }, [form.values.todo]);

  return (
    <>
      <Stack justify="space-between" h={rem("95vh")}>
        <Stack>
          <Group align="center" gap={0} wrap="nowrap">
            <Checkbox
              {...form.getInputProps("completedOn", { type: "checkbox" })}
            />
            <Textarea
              styles={{
                root: { width: "100%" },
                input: {
                  backgroundColor: "transparent",
                  border: "none",
                  fontWeight: 700,
                },
              }}
              {...form.getInputProps("todo")}
            />
            <ActionIcon size="sm" variant="transparent">
              {form.values.favorite ? (
                <IconStarFilled stroke={1.5} />
              ) : (
                <IconStar stroke={1.5} />
              )}
            </ActionIcon>
          </Group>
          <Button
            variant="transparent"
            justify="left"
            leftSection={
              <IconSun style={{ width: rem(18), height: rem(18) }} />
            }
            px={0}
            fullWidth
          >
            Add to My Day
          </Button>
          <Popover
            opened={opened1}
            onChange={setOpened1}
            position="bottom-start"
          >
            <PopoverTarget>
              <Button
                variant="transparent"
                justify="left"
                leftSection={
                  <IconCalendarMonth
                    style={{ width: rem(18), height: rem(18) }}
                  />
                }
                px={0}
                onClick={() => setOpened1((o) => !o)}
                fullWidth
              >
                Add due date
              </Button>
            </PopoverTarget>
            <Popover.Dropdown>
              <DatePicker value={value} onChange={setValue} />
            </Popover.Dropdown>
          </Popover>
          <Category update={update} />
          <Textarea
            placeholder="Add note"
            radius="xs"
            styles={{ input: { border: "none" } }}
          />
        </Stack>
        <Group justify="space-between">
          <ActionIcon variant="transparent" onClick={close}>
            <IconLayoutSidebarRightCollapse />
          </ActionIcon>
          <Text size="sm">Created {getDueDate(form.values.date)}</Text>
          <ActionIcon color="red" variant="transparent">
            <IconTrash />
          </ActionIcon>
        </Group>
      </Stack>
    </>
  );
};

export default EditTodo;
