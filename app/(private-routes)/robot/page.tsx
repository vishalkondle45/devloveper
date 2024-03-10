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
import { useDisclosure } from "@mantine/hooks";
import { IconRobot } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
const Page = () => {
  const { status } = useSession();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Robot", href: "/robot" },
  ];

  const [opened, handlers] = useDisclosure(false);

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
