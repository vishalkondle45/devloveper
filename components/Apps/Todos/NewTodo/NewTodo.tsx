import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Paper,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconBell, IconCalendar, IconRepeat } from "@tabler/icons-react";
import axios from "axios";
import { TodoType } from "../Todo.types";
import classes from "./NewTodo.module.css";

const NewTodo = () => {
  const form = useForm({
    initialValues: {
      todo: "",
    },
    validate: {
      todo: (value) => (value ? null : ""),
    },
  });

  const handleSubmit = async (values: TodoType) => {
    await axios
      .post("/api/todos", values)
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Paper radius="xs" withBorder>
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <TextInput
            radius="xs"
            leftSection={<Checkbox checked={false} readOnly />}
            classNames={{ input: classes.input }}
            placeholder="Add a task"
            {...form.getInputProps("todo")}
          />
          <Group p="xs" justify="space-between">
            <Group>
              <ActionIcon variant="transparent">
                <IconCalendar />
              </ActionIcon>
              <ActionIcon variant="transparent">
                <IconBell />
              </ActionIcon>
              <ActionIcon variant="transparent">
                <IconRepeat />
              </ActionIcon>
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
