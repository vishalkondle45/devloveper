import {
  convertToSingleSpace,
  getDueDate,
  removeSpaces,
} from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  MultiSelect,
  Paper,
  Stack,
  Text,
  Textarea,
  rem,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import {
  IconLayoutSidebarRightCollapse,
  IconStar,
  IconStarFilled,
  IconSun,
  IconTag,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Types } from "mongoose";
import { useEffect } from "react";
import { EditTodoProps, TodoUpdateTypes } from "../Todo.types";
import DueDate from "../Todo/DueDate/DueDate";
dayjs.extend(relativeTime);

const EditTodo = ({ close, form, update, todo, remove }: EditTodoProps) => {
  const { hovered, ref } = useHover();
  const categories = [
    {
      value: "blue",
      label: "🔵 Blue category",
    },
    {
      value: "green",
      label: "🟢 Green category",
    },
    {
      value: "red",
      label: "🔴 Red category",
    },
    {
      value: "purple",
      label: "🟣 Purple category",
    },
    {
      value: "orange",
      label: "🟠 Orange category",
    },
    {
      value: "yellow",
      label: "🟡 Yellow category",
    },
  ];

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
    if (form.values.todo?.includes("  ")) {
      form.setFieldValue("todo", convertToSingleSpace(form.values.todo) + " ");
    }
  }, [form.values.todo]);

  return (
    <>
      <Stack gap="xs">
        <Group mb="xs" justify="space-between">
          <ActionIcon variant="transparent" onClick={close}>
            <IconLayoutSidebarRightCollapse />
          </ActionIcon>
          <Text size="sm">Created - {getDueDate(todo?.createdAt)}</Text>
          <ActionIcon
            color="red"
            variant="transparent"
            onClick={() => remove(todo?._id)}
          >
            <IconTrash />
          </ActionIcon>
        </Group>
        <Paper p="xs" withBorder>
          <Group align="center" gap={0} wrap="nowrap">
            <Checkbox
              {...form.getInputProps("completedOn", { type: "checkbox" })}
              onChange={() =>
                onUpdate(todo?._id, {
                  completedOn: Boolean(form.values?.completedOn)
                    ? ""
                    : dayjs().toISOString(),
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
        </Paper>
        <Paper p="xs" withBorder>
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
              color={form.values.myday ? undefined : "gray"}
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
        </Paper>
        <Paper p="xs" withBorder>
          <DueDate todo={todo} update={update} />
        </Paper>
        <Paper p="xs" withBorder>
          <MultiSelect
            data={categories}
            variant="transparent"
            placeholder="Pick a category"
            leftSection={
              <IconTag style={{ width: rem(18), height: rem(18) }} />
            }
            styles={{
              section: {
                justifyContent: "left",
                maxWidth: "fit-content",
              },
            }}
            {...form.getInputProps("category")}
            onChange={(values) => onUpdate(todo?._id, { category: values })}
          />
        </Paper>
        <Paper p="xs" withBorder>
          <Textarea
            placeholder="Add note"
            radius="xs"
            styles={{
              input: { border: "none", backgroundColor: "transparent" },
            }}
          />
          <Text c="gray" fz="sm" px="sm">
            Updated {dayjs(todo?.updatedAt).fromNow()}
          </Text>
        </Paper>
      </Stack>
    </>
  );
};

export default EditTodo;
