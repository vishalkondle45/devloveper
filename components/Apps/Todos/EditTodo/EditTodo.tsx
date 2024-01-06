import { formatDate, getDueDate, removeSpaces } from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Popover,
  PopoverTarget,
  Stack,
  Text,
  Textarea,
  rem,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useHover } from "@mantine/hooks";
import {
  IconCalendarMonth,
  IconLayoutSidebarRightCollapse,
  IconStar,
  IconStarFilled,
  IconSun,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import { Types } from "mongoose";
import { useEffect, useState } from "react";
import { EditTodoProps, TodoUpdateTypes } from "../Todo.types";
import Category from "../Todo/Category";

const EditTodo = ({ close, form, update, todo }: EditTodoProps) => {
  const [opened1, setOpened1] = useState(false);
  const [value, setValue] = useState<Date | null>(null);
  const { hovered, ref } = useHover();

  const onTitleBlur = async () => {
    if (!form.values.todo) {
      update(form.values._id, {
        todo: removeSpaces(todo?.todo),
      }).then(() => form.setFieldValue("todo", removeSpaces(todo?.todo)));
    } else {
      if (form.values.todo !== todo?.todo) {
        update(form.values._id, { todo: removeSpaces(form.values.todo) }).then(
          () => form.setFieldValue("todo", removeSpaces(form.values.todo))
        );
      }
    }
  };

  const onUpdate = async (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => {
    update(todo?._id, object).then(() =>
      form.setValues({ ...form.values, ...object })
    );
  };

  useEffect(() => {
    if (form.values.todo.includes("  ")) {
      form.setFieldValue(
        "todo",
        form.values.todo.split("  ").join(" ").trim() + " "
      );
    }
  }, [form.values.todo]);

  return (
    <>
      <Stack justify="space-between" h={rem("95vh")}>
        <Stack>
          <Group align="center" gap={0} wrap="nowrap">
            <Checkbox
              {...form.getInputProps("completedOn", { type: "checkbox" })}
              onChange={() =>
                onUpdate(todo?._id, {
                  completedOn: Boolean(form.values?.completedOn)
                    ? ""
                    : formatDate(),
                })
              }
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
              autosize
              minRows={1}
              {...form.getInputProps("todo")}
              onBlur={onTitleBlur}
            />
            <ActionIcon
              size="sm"
              variant="transparent"
              onClick={() =>
                onUpdate(todo?._id, { favorite: !form.values?.favorite })
              }
            >
              {form.values.favorite ? (
                <IconStarFilled stroke={1.5} />
              ) : (
                <IconStar stroke={1.5} />
              )}
            </ActionIcon>
          </Group>
          <Group wrap="nowrap" justify="space-between" ref={ref}>
            <Button
              variant="transparent"
              justify="left"
              leftSection={
                <IconSun style={{ width: rem(18), height: rem(18) }} />
              }
              px={0}
              fullWidth
              onClick={() => onUpdate(todo?._id, { myday: true })}
              style={{ cursor: form.values.myday && "default" }}
            >
              {Boolean(form.values.myday) ? "Remove from" : "Add to"} My Day
            </Button>
            {Boolean(form.values.myday) && hovered && (
              <ActionIcon
                variant="transparent"
                onClick={() => onUpdate(todo?._id, { myday: false })}
              >
                <IconX />
              </ActionIcon>
            )}
          </Group>
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
