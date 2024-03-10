"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import NewPrompt from "@/components/Robot/NewPrompt";
import { useResponsiveness } from "@/hooks/useResonsiveness";
import { promptExamples } from "@/lib/constants";
import { getRandomElements } from "@/lib/functions";
import {
  Center,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconRobot } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const [opened, handlers] = useDisclosure(false);
  const { isDesktop } = useResponsiveness();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
  ];

  const form = useForm({
    initialValues: {
      prompt: "",
    },
    validate: {
      prompt: (value) => (value ? null : "This field is required."),
    },
  });

  const visibleTodos = useMemo(() => getRandomElements(promptExamples), []);

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
      <NewPrompt form={form} sendMessage={sendMessage} />
      <Center w="100%" h={500}>
        <Stack align="center">
          <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
            <IconRobot style={{ width: rem(100), height: rem(100) }} />
          </ThemeIcon>
          <Stack gap={0}>
            <Text c="teal" size="xl">
              Hello, Vishal
            </Text>
            <Text size="xl">How can I help you today?</Text>
          </Stack>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="sm"
            verticalSpacing="sm"
          >
            {visibleTodos.slice(0, isDesktop ? 4 : 2).map((prompt) => (
              <Paper
                radius="md"
                w="100%"
                p="sm"
                withBorder
                onClick={() => sendMessage(prompt.prompt)}
                style={{ cursor: "pointer" }}
                shadow="xs"
              >
                <Text
                  style={{ whiteSpace: "nowrap", overflow: "hidden" }}
                  fw={700}
                >
                  {prompt.header}
                </Text>
                <Text c="gray">{prompt.subheader}</Text>
              </Paper>
            ))}
          </SimpleGrid>
        </Stack>
      </Center>
    </Container>
  );
};

export default Page;
