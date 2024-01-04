"use client";
import EditTodo from "@/components/Apps/Todos/EditTodo/EditTodo";
import NewTodo from "@/components/Apps/Todos/NewTodo";
import Todo from "@/components/Apps/Todos/Todo";
import { TodoType, TodoUpdateTypes } from "@/components/Apps/Todos/Todo.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Center,
  Container,
  Drawer,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { showNotification } from "@mantine/notifications";
import { IconNote } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [todos, setTodos] = useState<any[] | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      todo: "",
      favorite: false,
      myday: false,
      completedOn: "",
      date: "",
      createdAt: "",
    },
  });

  const getTodos = async () => {
    const res = await axios.get("/api/todos");
    setTodos(res.data);
  };

  const editTodo = (todo: TodoType) => {
    open();
    form.setValues(todo);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Todos", href: "/todos" },
  ];

  const update = async (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => {
    await axios
      .put(`/api/todos?_id=${_id}`, object)
      .then((res) => {
        showNotification({
          message: "Updated Successfully",
        });
        getTodos();
      })
      .catch((error) => {});
  };

  if (status === "loading" || !todos) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Todos
        </Text>
      </Group>
      <NewTodo getTodos={getTodos} />
      {!todos?.length ? (
        <Center h={500}>
          <Stack align="center">
            <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
              <IconNote style={{ width: rem(100), height: rem(100) }} />
            </ThemeIcon>
            <Text size="xl">No todos created yet.</Text>
          </Stack>
        </Center>
      ) : (
        <>
          <Stack my="md">
            {todos?.map((todo) => (
              <Todo
                todo={todo}
                getTodos={getTodos}
                key={todo.todo}
                editTodo={editTodo}
                update={update}
              />
            ))}
          </Stack>
        </>
      )}
      <Drawer
        py={0}
        withCloseButton={false}
        opened={opened}
        onClose={close}
        position="right"
      >
        <EditTodo close={close} form={form} update={update} />
      </Drawer>
    </Container>
  );
};

export default Page;
