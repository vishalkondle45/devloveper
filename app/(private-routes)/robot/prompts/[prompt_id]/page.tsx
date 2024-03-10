"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import NewPrompt from "@/components/Robot/NewPrompt";
import { Prompt } from "@/components/Robot/Prompt.types";
import {
  errorNotification,
  renderBoldText,
  textToSpeech,
} from "@/lib/functions";
import { CodeHighlight } from "@mantine/code-highlight";
import {
  ActionIcon,
  Box,
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
import { notifications } from "@mantine/notifications";
import {
  IconCheck,
  IconClipboard,
  IconPencil,
  IconPlayerStopFilled,
  IconReload,
  IconVolume,
  IconX,
} from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CodeRenderer = ({ text }: { text: string }) => {
  const codeRegex = /```([\s\S]*?)```/g;
  return text.split(codeRegex).map((part, index) => {
    if (index % 2 === 0) {
      return <Text key={index} dangerouslySetInnerHTML={{ __html: part }} />;
    } else {
      const [firstLine, ...remainingLines] = part.split("\n");
      return (
        <Box key={index}>
          <Text
            key={index}
            dangerouslySetInnerHTML={{ __html: firstLine }}
            fw={700}
          />
          <CodeHighlight
            code={remainingLines.join("\n")}
            language={firstLine}
          />
        </Box>
      );
    }
  });
};

const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [response, setResponse] = useState<Prompt | null>(null);
  const router = useRouter();
  const [opened, handlers] = useDisclosure(false);
  const [speakingPrompt, speakingPromptHandlers] = useDisclosure(false);
  const [speakingResponse, speakingResponseHandlers] = useDisclosure(false);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
    {
      title: String(response?.prompt) || String(params?.prompt_id),
      href: String(params?.prompt_id),
    },
  ];

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      .catch(() => {
        notifications.show({
          message: "Prompt not found.",
          icon: <IconX />,
          color: "red",
        });
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
        router.push(`/robot/prompts/${response.data._id}`);
      })
      .catch((error) => {
        errorNotification(error.response.data.error);
        router.push(`/robot`);
      });
    // .finally(() => handlers.close());
  };

  const editPrompt = (prompt: string) => {
    if (textareaRef.current) {
      textareaRef?.current?.focus();
      textareaRef?.current.setSelectionRange(
        textareaRef?.current.value.length,
        textareaRef?.current.value.length
      );
    }
    form.setFieldValue("prompt", prompt);
  };

  const closeEditPrompt = () => textareaRef?.current?.blur();

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
        closeEditPrompt={closeEditPrompt}
        refEle={textareaRef}
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
                onClick={() =>
                  textToSpeech(
                    response?.prompt,
                    speakingPromptHandlers.open,
                    speakingPromptHandlers.close
                  )
                }
                title="Read Aloud"
              >
                {speakingPrompt ? (
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
            <CodeRenderer text={renderBoldText(response.response).join("")} />
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
                onClick={() =>
                  textToSpeech(
                    response?.response,
                    speakingResponseHandlers.open,
                    speakingResponseHandlers.close
                  )
                }
                title="Read Aloud"
              >
                {speakingResponse ? (
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
