"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import NewPrompt from "@/components/Robot/NewPrompt";
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
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconRobot } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
  ];

  const [opened, handlers] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      prompt: "",
    },
    validate: {
      prompt: (value) => (value ? null : "This field is required."),
    },
  });

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
      <Center h={500}>
        <Stack align="center">
          <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
            <IconRobot style={{ width: rem(100), height: rem(100) }} />
          </ThemeIcon>
          <Text size="xl">How can I help you today?</Text>
        </Stack>
      </Center>
    </Container>
  );
};

export default Page;
