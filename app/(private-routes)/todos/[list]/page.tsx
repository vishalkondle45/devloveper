"use client";
import EditTodo from "@/components/Apps/Todos/EditTodo/EditTodo";
import ListTitle from "@/components/Apps/Todos/ListTitle/ListTitle";
import { SortTypes } from "@/components/Apps/Todos/ListTitle/ListTitle.types";
import NewTodo from "@/components/Apps/Todos/NewTodo";
import Todo from "@/components/Apps/Todos/Todo";
import { TodoType, TodoUpdateTypes } from "@/components/Apps/Todos/Todo.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Center,
  Container,
  Drawer,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { showNotification } from "@mantine/notifications";
import { IconNote, IconX } from "@tabler/icons-react";
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
  const [sort, setSort] = useState<SortTypes>({ sort: "asc", by: "" });

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

  useEffect(() => {
    if (todos) {
      let by = sort.by || "createdAt";
      const updatedTodod = todos?.sort((a: any, b: any) =>
        sort.sort === "asc"
          ? String(a[by])?.localeCompare(String(b[by]))
          : String(b[by])?.localeCompare(String(a[by]))
      );
      setTodos(() => [...updatedTodod]);
    }
  }, [sort.by, sort.sort]);

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
      <ListTitle
        title={selected?.title}
        getTodos={getTodos}
        color={selected?.color}
        setSort={setSort}
        sort={sort}
        getTodoLists={getTodoLists}
      />
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
                key={todo?.todo}
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
