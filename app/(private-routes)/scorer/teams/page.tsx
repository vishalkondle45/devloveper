"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  Text,
  rem,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
    { title: "Players", href: "/players" },
  ];

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Players
        </Text>
        <Button
          leftSection={<IconPlus />}
          onClick={() => router.push("/scorer/players/create")}
        >
          Add Player
        </Button>
      </Group>
    </Container>
  );
};

export default Page;
