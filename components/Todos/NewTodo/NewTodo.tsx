import {
  ActionIcon,
  Button,
  Checkbox,
  Group,
  Paper,
  TextInput,
} from "@mantine/core";
import { IconBell, IconCalendar, IconRepeat } from "@tabler/icons-react";
import React from "react";
import classes from "./NewTodo.module.css";

const NewTodo = () => {
  return (
    <>
      <Paper radius="xs" withBorder>
        <TextInput
          radius="xs"
          leftSection={<Checkbox checked={false} readOnly />}
          classNames={{ input: classes.input }}
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
          <Button radius="xs" size="compact-md">
            Add
          </Button>
        </Group>
      </Paper>
    </>
  );
};

export default NewTodo;
