import { getDueDate } from "@/lib/functions";
import {
  ActionIcon,
  Badge,
  Button,
  Checkbox,
  Group,
  Paper,
  Popover,
  PopoverTarget,
  TextInput,
  rem,
} from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useFocusTrap } from "@mantine/hooks";
import { IconCalendar, IconSun, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { TodoType } from "../Todo.types";
import classes from "./NewTodo.module.css";

const NewTodo = ({ getTodos }: { getTodos: () => Promise<void> }) => {
  const [opened, setOpened] = useState(false);
  const focusTrapRef = useFocusTrap(true);
  const form = useForm({
    initialValues: {
      todo: "",
      date: "",
      myday: false,
    },
    validate: {
      todo: (value) => (value ? null : ""),
    },
  });

  const handleSubmit = async (values: TodoType) => {
    await axios
      .post("/api/todos", values)
      .then((res) => {
        getTodos();
        form.reset();
        setOpened(false);
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Paper radius="xs" shadow="xl" withBorder>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            radius="xs"
            leftSection={<Checkbox checked={false} readOnly />}
            classNames={{ input: classes.input }}
            placeholder="Add a task"
            {...form.getInputProps("todo")}
            ref={focusTrapRef}
          />
          <Group p="xs" justify="space-between">
            <Group gap={0}>
              {form.values.date ? (
                <Badge
                  variant="light"
                  size="xs"
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={() => form.setFieldValue("date", "")}
                    >
                      <IconX />
                    </ActionIcon>
                  }
                >
                  {getDueDate(form.values.date)}
                </Badge>
              ) : (
                <Popover
                  radius="xs"
                  position="bottom"
                  withArrow
                  shadow="md"
                  opened={opened}
                  onChange={setOpened}
                >
                  <PopoverTarget>
                    <ActionIcon
                      variant="transparent"
                      onClick={() => setOpened((o) => !o)}
                    >
                      <IconCalendar
                        style={{ width: rem(20), height: rem(20) }}
                      />
                    </ActionIcon>
                  </PopoverTarget>
                  <Popover.Dropdown>
                    <DatePicker {...form.getInputProps("date")} />
                  </Popover.Dropdown>
                </Popover>
              )}
              {form.values.myday ? (
                <Badge
                  variant="light"
                  size="xs"
                  rightSection={
                    <ActionIcon
                      size="xs"
                      variant="transparent"
                      onClick={() => form.setFieldValue("myday", false)}
                    >
                      <IconX />
                    </ActionIcon>
                  }
                >
                  My day
                </Badge>
              ) : (
                <ActionIcon
                  variant="transparent"
                  onClick={() => form.setFieldValue("myday", true)}
                >
                  <IconSun style={{ width: rem(20), height: rem(20) }} />
                </ActionIcon>
              )}
            </Group>
            <Button type="submit" radius="xs" size="compact-md">
              Add
            </Button>
          </Group>
        </form>
      </Paper>
    </>
  );
};

export default NewTodo;
