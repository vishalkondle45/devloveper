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
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import classes from "./Login.module.css";
import { Values } from "./Login.types";

export default function Login() {
  const router = useRouter();
  const [loading, loadingHandlers] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      email: "",
      password: "",
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
      password: (value) =>
        value.length > 2 ? null : "Password must be atleast 8 characters",
    },
  });

  const handleLogin = async (values: Values): Promise<any> => {
    loadingHandlers.open();
    const res = await signIn("credentials", { ...values, redirect: false });
    loadingHandlers.close();
    if (res?.error) {
      return notifications.show({
        icon: <IconX />,
        color: "red",
        title: "Login failed",
        message: res.error,
      });
    }
    notifications.show({
      icon: <IconCheck />,
      color: "green",
      title: "Login success",
      message: "You logged in successfully.",
    });
    router.push("/profile");
  };

  return (
    <Container size={420} pt={40}>
      <Title ta="center" className={classes.title}>
        Welcome back !
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Don't have an account?{" "}
        <Anchor component={Link} href="/auth/register">
          Register
        </Anchor>
      </Text>
      <Paper withBorder shadow="md" p={30} mt={30}>
        <form onSubmit={form.onSubmit(handleLogin)}>
          <Stack gap="xs">
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
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
