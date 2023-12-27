"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ActionIcon,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useSession } from "next-auth/react";

const Page = () => {
  const { status } = useSession();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
    { title: "Tags", href: "/tags" },
  ];

  return (
    <Container my="md" size="md">
      <LoadingOverlay visible={status === "loading"} />
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Text fz={rem(40)} fw={700}>
        Tags
      </Text>
      <Container size="xs">
        <Stack>
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Paper key={item} shadow="xl" withBorder>
              <Group px="xl" py="md" justify="space-between">
                <Text fw={700}>#{`Tag${item}`}</Text>
                <Group>
                  <ActionIcon variant="transparent" color="blue">
                    <IconPencil />
                  </ActionIcon>
                  <ActionIcon variant="transparent" color="red">
                    <IconTrash />
                  </ActionIcon>
                </Group>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Container>
    </Container>
  );
};

export default Page;
