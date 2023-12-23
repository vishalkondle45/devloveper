"use client";
import { colors } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  Avatar,
  Button,
  Container,
  LoadingOverlay,
  Paper,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import classes from "./Profile.module.css";
import { Values } from "./Profile.types";

export default function Profile() {
  const [loading, loadingHandlers] = useDisclosure(false);
  const [loadingProfile, loadingProfileHandlers] = useDisclosure(true);
  const { update } = useSession();
  const router = useRouter();

  const form = useForm({
    initialValues: {
      name: "",
      email: "",
    },
    validate: {
      name: (value) =>
        value.length > 2 ? null : "Please enter atleast 3 characters",
      email: (value) => (/^\S+@\S+$/.test(value) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    const getProfile = async () => {
      loadingProfileHandlers.open();
      axios
        .get("/api/auth/users/profile")
        .then((res) => {
          form.setValues({ email: res.data.email, name: res.data.name });
          form.resetDirty({ email: res.data.email, name: res.data.name });
        })
        .catch((error) => {
          notifications.show({
            icon: <IconX />,
            color: "red",
            title: "Profile loading failed",
            message: error.response.data.error,
          });
          router.replace("/auth/login");
        })
        .finally(() => {
          loadingProfileHandlers.close();
        });
    };
    getProfile();
  }, []);

  const updateProfile = async (values: Values) => {
    loadingHandlers.open();
    axios
      .put("/api/auth/users/profile", values)
      .then((res) => {
        update(values);
        notifications.show({
          icon: <IconCheck />,
          color: "green",
          title: "Profile updated",
          message: "Profile updated successfully",
        });
        form.setValues(values);
        form.resetDirty(values);
      })
      .catch((error) =>
        notifications.show({
          icon: <IconX />,
          color: "red",
          title: "Error",
          message: error.response.data.error,
        })
      )
      .finally(() => {
        loadingHandlers.close();
      });
  };

  return (
    <Container size={420} pt={40}>
      <Title ta="center" className={classes.title}>
        My Profile
      </Title>
      <Paper withBorder p={30} mt={30} radius="md">
        <LoadingOverlay
          visible={loadingProfile}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
        />
        <form onSubmit={form.onSubmit(updateProfile)}>
          <Stack gap="xs">
            <Avatar
              size="xl"
              color={colors[getDigitByString(form.values.name)]}
              className={classes.avatar}
            >
              {getInitials(form.values.name)}
            </Avatar>
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
          </Stack>
          <Button
            type="submit"
            loading={loading}
            disabled={!form.isDirty()}
            fullWidth
            mt="md"
          >
            Update
          </Button>
        </form>
      </Paper>
    </Container>
  );
}
