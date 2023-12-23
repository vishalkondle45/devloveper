"use client";
import {
  Anchor,
  Button,
  Container,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./Register.module.css";

export default function Register() {
  const router = useRouter();
  const [loading, loadingHandlers] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: {
      name: (value) =>
        value.length > 2 ? null : "Please enter atleast 3 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 2 ? null : "Password must be atleast 8 characters",
    },
  });

  const handleRegister = async (values: Values) => {
    loadingHandlers.open();
    axios
      .post("/api/auth/users", values)
      .then((res) => {
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          title: "Account created",
          message: "Please check your email.",
        });
        router.push("/auth/login");
      })
      .catch((error) =>
        notifications.show({
          icon: <IconX />,
          color: "red",
          title: "Error",
          message: error.response.data.error,
        })
      )
      .finally(() => loadingHandlers.close());
  };

  return (
    <Container size={420} pt={40}>
      <Title ta="center" className={classes.title}>
        Welcome!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Already have an account?{" "}
        <Anchor component={Link} href="/auth/login">
          Login
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30}>
        <form onSubmit={form.onSubmit(handleRegister)}>
          <Stack gap="xs">
            <TextInput
              label="Name"
              type="text"
              placeholder="Your name"
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Email"
              type="email"
              placeholder="Your email"
              required
              {...form.getInputProps("email")}
            />
            <PasswordInput
              label="Password"
              placeholder="Your password"
              required
              {...form.getInputProps("password")}
            />
          </Stack>
          <Button type="submit" loading={loading} fullWidth mt="xl">
            Register
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
