"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { PlayerType } from "@/components/Scorer/Scorer.Types";
import { roles } from "@/lib/constants";
import { errorNotification } from "@/lib/functions";
import {
  ActionIcon,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useValidatedState } from "@mantine/hooks";
import {
  IconAt,
  IconPlus,
  IconStar,
  IconStarFilled,
  IconTrash,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  const [{ value: email, valid }, setEmail] = useValidatedState(
    "",
    (val) => /^\S+@\S+$/.test(val),
    false
  );

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Teams", href: "/teams" },
    { title: "Create", href: "/create" },
  ];

  const form = useForm({
    initialValues: {
      name: "",
      shortName: "",
      players: [] as PlayerType[],
      captain: "",
    },
    validate: {
      name: (value) => (value ? null : "This field is required"),
    },
  });

  const addPlayer = async () => {
    try {
      const isAlreadyAdded = form.values.players.some(
        (player) => player.user.email === email
      );
      if (isAlreadyAdded) {
        errorNotification("Player is already added");
        return;
      }
      const { data }: { data: PlayerType } = await axios.get(
        `/api/scorer/find-player?email=${email}`
      );
      if (data) {
        if (!form.values.players.length) {
          form.setFieldValue("captain", data._id);
        }
        form.setFieldValue("players", [...form.values.players, data]);
        setEmail("");
      }
    } catch (error: any) {
      errorNotification(error.response.data.error);
    }
  };

  const makeCaptain = async (_id: string) => {
    form.setFieldValue("captain", _id);
  };

  const removePlayer = async (_id: string) => {
    form.setValues({
      players: form.values.players.filter((player) => player._id !== _id),
      captain: form.values.players[0]._id,
    });
  };

  const resetForm = () => {
    form.reset();
    setEmail("");
  };

  const createTeam = async () => {
    try {
      await axios.post("/api/scorer/teams", {
        ...form.values,
        players: form.values.players.map(({ _id }) => _id),
      });
      resetForm();
    } catch (error: any) {
      errorNotification(error.response.data.error);
    }
  };

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(30)} fw={700}>
          New Team
        </Text>
      </Group>
      <Container px={0} size="xs">
        <form onSubmit={form.onSubmit(createTeam)}>
          <Stack>
            <Group justify="space-between" wrap="nowrap">
              <TextInput
                w="180%"
                label="Name"
                placeholder="Mumbai Indians"
                {...form.getInputProps("name")}
              />
              <TextInput
                w="100%"
                label="Short name"
                placeholder="MI"
                {...form.getInputProps("shortName")}
              />
            </Group>
            <Group gap={0} wrap="nowrap">
              <TextInput
                type="email"
                w="100%"
                placeholder="Search with email address"
                leftSection={<IconAt size={18} />}
                onChange={(e) => setEmail(e.currentTarget.value)}
                value={email}
              />
              <ActionIcon onClick={addPlayer} disabled={!valid} size="lg">
                <IconPlus />
              </ActionIcon>
            </Group>
            <Stack>
              {form.values.players.map((player) => (
                <Paper key={player?._id} p="xs" withBorder>
                  <Group justify="space-between">
                    <Group>
                      <ThemeIcon variant="transparent">
                        {roles.find((role) => role.role === player?.role)?.icon}
                      </ThemeIcon>
                      <Text fw={700}>{player?.user?.name}</Text>
                    </Group>
                    <Group>
                      <ActionIcon
                        color="blue"
                        variant="transparent"
                        onClick={() => makeCaptain(player._id)}
                      >
                        {form.values.captain === player._id ? (
                          <IconStarFilled size={20} />
                        ) : (
                          <IconStar size={20} />
                        )}
                      </ActionIcon>
                      <ActionIcon
                        onClick={() => removePlayer(player._id)}
                        color="red"
                        variant="transparent"
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </Group>
                </Paper>
              ))}
            </Stack>
            <Group justify="space-between" wrap="nowrap">
              <Button type="reset" onClick={resetForm} color="red" fullWidth>
                Reset
              </Button>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Container>
    </Container>
  );
};

export default Page;
