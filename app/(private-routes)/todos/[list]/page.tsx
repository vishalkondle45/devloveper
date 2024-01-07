"use client";
import EditTodo from "@/components/Apps/Todos/EditTodo/EditTodo";
import NewTodo from "@/components/Apps/Todos/NewTodo";
import Todo from "@/components/Apps/Todos/Todo";
import { TodoType, TodoUpdateTypes } from "@/components/Apps/Todos/Todo.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ActionIcon,
  Center,
  Container,
  Drawer,
  Group,
  LoadingOverlay,
  Menu,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import {
  IconArrowsSort,
  IconCalendarMonth,
  IconCalendarPlus,
  IconChevronRight,
  IconCursorText,
  IconDots,
  IconList,
  IconNote,
  IconPrinter,
  IconStar,
  IconSun,
  IconTrash,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [todos, setTodos] = useState<any[] | null>(null);
  const [todoLists, setTodoLists] = useState<any[] | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [todo, setTodo] = useState<TodoUpdateTypes | null>(null);
  const params = useParams();
  const router = useRouter();

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
    const res = await axios.get(`/api/todos?list=${params.list}`);
    setTodos(res.data);
  };

  const getTodoLists = async () => {
    const res = await axios.get("/api/todos/lists");
    setTodoLists(res.data);
  };

  const editTodo = (todo: TodoType) => {
    open();
    form.setValues(todo);
    setTodo(todo);
  };

  useEffect(() => {
    getTodos();
    getTodoLists();
  }, []);

  const selected = todoLists?.find(({ _id }) => _id === params.list);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Todos", href: "/todos" },
    { title: selected?.title, href: `/todos/${selected?._id}` },
  ];

  const update = async (
    _id: Types.ObjectId | undefined,
    object: TodoUpdateTypes
  ) => {
    await axios
      .put(`/api/todos?_id=${_id}`, object)
      .then((res) => {
        getTodos();
      })
      .catch((error) => {});
  };

  const remove = (_id?: Types.ObjectId) => {
    if (_id) {
      modals.openConfirmModal({
        title: (
          <Text fw={700}>"{todo?.todo}" will be permanently deleted.</Text>
        ),
        centered: true,
        children: <Text size="sm">You won't be able to undo this action.</Text>,
        labels: { confirm: "Delete task", cancel: "Cancel" },
        confirmProps: { color: "red" },
        radius: "xs",
        onConfirm: async () =>
          await axios.delete(`/api/todos?_id=${_id}`).then(() => {
            getTodos();
            close();
            form.reset();
          }),
      });
    }
  };

  useEffect(() => {
    if (selected?.title) {
      document.title = selected?.title;
    }
  }, [selected]);

  if (status === "loading" || !todos) {
    return <LoadingOverlay visible />;
  }

  if (todoLists && !selected) {
    showNotification({
      message: "Please select valid List",
      color: "red",
      icon: <IconX />,
    });
    router.push("/todos");
    return <LoadingOverlay visible />;
  }
  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group wrap="nowrap" my="sm" justify="space-between">
        <Group wrap="nowrap" justify="left" gap="xs">
          <ThemeIcon variant="transparent">
            <IconList />
          </ThemeIcon>
          <Text maw={rem("60vw")} fz={rem(24)} fw={700} truncate="end">
            {selected?.title}
          </Text>
          <Menu radius="xs" shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon color="gray" variant="transparent">
                <IconDots stroke={1} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Label ta="center">List options</Menu.Label>
              <Menu.Item
                leftSection={
                  <IconCursorText style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Rename list
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconPrinter style={{ width: rem(16), height: rem(16) }} />
                }
              >
                Print list
              </Menu.Item>
              <Menu.Item
                leftSection={
                  <IconSun style={{ width: rem(16), height: rem(16) }} />
                }
                rightSection={
                  <IconChevronRight
                    style={{ width: rem(16), height: rem(16) }}
                  />
                }
              >
                Change theme
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={
                  <IconTrash style={{ width: rem(16), height: rem(16) }} />
                }
                color="red"
              >
                Delete list
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Menu radius="xs" shadow="md" width={200}>
          <Menu.Target>
            <ActionIcon color="gray" variant="transparent">
              <IconArrowsSort stroke={1} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label ta="center">Sort by</Menu.Label>
            <Menu.Item
              leftSection={
                <IconStar style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Importance
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCalendarMonth
                  style={{ width: rem(16), height: rem(16) }}
                />
              }
            >
              Due date
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconSun style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Added to My Day
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconArrowsSort style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Alphabetically
            </Menu.Item>
            <Menu.Item
              leftSection={
                <IconCalendarPlus style={{ width: rem(16), height: rem(16) }} />
              }
            >
              Creation date
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
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
                remove={remove}
                todoLists={todoLists}
                withListName={false}
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
        <EditTodo
          close={close}
          form={form}
          update={update}
          todo={todo}
          remove={remove}
        />
      </Drawer>
    </Container>
  );
};

export default Page;
