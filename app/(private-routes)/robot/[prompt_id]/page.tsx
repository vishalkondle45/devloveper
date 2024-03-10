"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import NewPrompt from "@/components/Robot/NewPrompt";
import { Prompt } from "@/components/Robot/Prompt.types";
import { textToSpeech } from "@/lib/functions";
import {
  ActionIcon,
  Container,
  CopyButton,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import {
  IconCheck,
  IconClipboard,
  IconPencil,
  IconPlayerStopFilled,
  IconReload,
  IconVolume,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [response, setResponse] = useState<Prompt | null>(null);
  const router = useRouter();
  const [opened, handlers] = useDisclosure(false);
  const [speaking, { open, close }] = useDisclosure(false);
  const [active, focusHandlers] = useDisclosure(false);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
    {
      title: String(response?.prompt) || String(params?.prompt_id),
      href: String(params?.prompt_id),
    },
  ];

  const form = useForm({
    initialValues: {
      prompt: "",
    },
    validate: {
      prompt: (value) => (value ? null : "This field is required."),
    },
  });

  const getPrompt = async () => {
    speechSynthesis.cancel();
    handlers.open();
    await axios
      .get(`/api/robot/prompts/${params.prompt_id}`)
      .then((response) => {
        setResponse(response.data);
      })
      .catch((error) => {
        setResponse(error.response.data.error);
      })
      .finally(() => {
        handlers.close();
      });
  };

  useEffect(() => {
    getPrompt();
  }, []);

  useEffect(() => {
    return () => {
      speechSynthesis.cancel();
      close();
    };
  }, []);

  const sendMessage = async (prompt: string) => {
    if (prompt === "") {
      form.setFieldError("prompt", "This field is required.");
      return;
    }
    handlers.open();
    await axios
      .post(`/api/robot`, { prompt })
      .then((response) => {
        router.push(`/robot/${response.data._id}`);
      })
      .catch((error) => {
        router.push(`/robot`);
      });
  };

  const editPrompt = (prompt: string) => {
    focusHandlers.open();
    form.setFieldValue("prompt", prompt);
  };

  if (status === "loading" || opened) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Robot
        </Text>
      </Group>
      <NewPrompt
        sendMessage={sendMessage}
        form={form}
        active={active}
        handlers={handlers}
      />
      {response && (
        <Paper key={String(response?._id)} p="xs" mt="xl" withBorder>
          <Stack gap="xs">
            <Text
              style={{ whiteSpace: "pre-wrap" }}
              fw={700}
              dangerouslySetInnerHTML={{ __html: response?.prompt }}
            />
            <Group>
              <CopyButton value={response?.prompt}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    onClick={copy}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <IconCheck size={18} />
                    ) : (
                      <IconClipboard size={18} />
                    )}
                  </ActionIcon>
                )}
              </CopyButton>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => textToSpeech(response?.prompt, open, close)}
                title="Read Aloud"
              >
                {speaking ? (
                  <IconPlayerStopFilled size={18} />
                ) : (
                  <IconVolume size={18} />
                )}
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => editPrompt(response?.prompt)}
                title="Edit Prompt"
              >
                <IconPencil size={18} />
              </ActionIcon>
            </Group>
            <Divider variant="dashed" />
            <Text
              style={{ whiteSpace: "pre-wrap" }}
              fw={500}
              dangerouslySetInnerHTML={{ __html: response?.response }}
            />
            <Group>
              <CopyButton value={response?.response}>
                {({ copied, copy }) => (
                  <ActionIcon
                    variant="transparent"
                    color="gray"
                    onClick={copy}
                    title="Copy to clipboard"
                  >
                    {copied ? (
                      <IconCheck size={18} />
                    ) : (
                      <IconClipboard size={18} />
                    )}
                  </ActionIcon>
                )}
              </CopyButton>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => textToSpeech(response?.response, open, close)}
                title="Read Aloud"
              >
                {speaking ? (
                  <IconPlayerStopFilled size={18} />
                ) : (
                  <IconVolume size={18} />
                )}
              </ActionIcon>
              <ActionIcon
                variant="transparent"
                color="gray"
                onClick={() => sendMessage(response?.prompt)}
                title="Regenerate"
              >
                <IconReload size={18} />
              </ActionIcon>
            </Group>
          </Stack>
        </Paper>
      )}
    </Container>
  );
};

export default Page;
