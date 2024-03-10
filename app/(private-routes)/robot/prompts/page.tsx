"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
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
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface PromptType {
  _id: string;
  prompt: string;
}

const Page = () => {
  const { status } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [prompts, setPrompts] = useState<PromptType[]>([]);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
  ];

  const getPromptsList = async () => {
    open();
    await axios.get("/api/robot/prompts/list").then((res) => {
      setPrompts(res.data);
    });
    close();
  };

  useEffect(() => {
    getPromptsList();
  }, []);

  const deletePrompt = async (_id: string) => {
    open();
    axios
      .delete(`/api/robot/prompts/${_id}`)
      .then(() => {
        getPromptsList();
      })
      .catch(() => {
        errorNotification("Failed to delete prompt");
      })
      .finally(() => close());
  };

  const deleteAllPrompts = async () => {
    open();
    axios
      .delete(`/api/robot`)
      .then(() => {
        setPrompts([]);
      })
      .catch(() => {
        errorNotification("Failed to delete prompt");
      })
      .finally(() => close());
  };

  const openModal = () =>
    modals.openConfirmModal({
      title: "Please confirm your action",
      children: <Text size="sm">All the prompts history will be deleted.</Text>,
      labels: { confirm: "Confirm", cancel: "Cancel" },
      confirmProps: { color: "red" },
      onCancel: () => {},
      onConfirm: deleteAllPrompts,
    });

  if (status === "loading" || opened) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Prompts
        </Text>
        <Button leftSection={<IconTrash />} onClick={openModal}>
          Delete All
        </Button>
      </Group>
      <Stack>
        {prompts.map((prompt) => (
          <Paper withBorder p="md" key={prompt?._id}>
            <Group justify="space-between" wrap="nowrap">
              <Text>{prompt?.prompt}</Text>
              <ActionIcon
                color="red"
                variant="transparent"
                onClick={() => deletePrompt(prompt?._id)}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Paper>
        ))}
      </Stack>
    </Container>
  );
};

export default Page;
