"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import NewPrompt from "@/components/Robot/NewPrompt";
import { Prompt } from "@/components/Robot/Prompt.types";
import {
  Container,
  Divider,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const params = useParams();
  const [response, setResponse] = useState<Prompt | null>(null);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
    {
      title: String(response?.prompt) || String(params?.prompt_id),
      href: String(params?.prompt_id),
    },
  ];

  const [opened, handlers] = useDisclosure(false);

  const getPrompt = async () => {
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
      <NewPrompt handlers={handlers} />
      {response && (
        <Paper key={String(response?._id)} p="xs" mt="xl" withBorder>
          <Stack gap="xs">
            <Text
              style={{ whiteSpace: "pre-wrap" }}
              fw={700}
              dangerouslySetInnerHTML={{ __html: response?.prompt }}
            />
            <Divider variant="dashed" />
            <Text
              style={{ whiteSpace: "pre-wrap" }}
              fw={500}
              dangerouslySetInnerHTML={{ __html: response?.response }}
            />
          </Stack>
        </Paper>
      )}
    </Container>
  );
};

export default Page;
