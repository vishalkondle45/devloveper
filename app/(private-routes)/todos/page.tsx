"use client";
import NewTodo from "@/components/Apps/Todos/NewTodo";
import Todo from "@/components/Apps/Todos/Todo";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Center,
  Container,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { IconNote } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [todos, setTodos] = useState<any[] | null>(null);

  const getTodos = async () => {
    const res = await axios.get("/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    getTodos();
  }, []);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Todos", href: "/todos" },
  ];

  if (status === "loading" || !todos) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Todos
        </Text>
      </Group>
      <NewTodo />
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
          <Stack mt="md">
            {todos?.map((todo) => (
              <Todo todo={todo} getTodos={getTodos} key={todo.todo} />
            ))}
          </Stack>
        </>
      )}
    </Container>
  );
};

export default Page;
