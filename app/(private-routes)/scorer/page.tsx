"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Button,
  Container,
  Group,
  LoadingOverlay,
  Menu,
  Text,
  rem,
} from "@mantine/core";
import {
  IconChevronDown,
  IconCricket,
  IconTrophy,
  IconUser,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
const Page = () => {
  const { status } = useSession();
  const router = useRouter();
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Scorer", href: "/scorer" },
  ];

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Scorer
        </Text>
        <Menu>
          <Menu.Target>
            <Button rightSection={<IconChevronDown />}>Actions</Button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>New</Menu.Label>
            <Menu.Item
              leftSection={<IconUser size={16} />}
              onClick={() => router.push("/scorer/players/create")}
            >
              Player
            </Menu.Item>
            <Menu.Item
              leftSection={<IconUsersGroup size={16} />}
              onClick={() => router.push("/scorer/teams/create")}
            >
              Team
            </Menu.Item>
            <Menu.Item
              leftSection={<IconCricket size={16} />}
              onClick={() => router.push("/scorer/match/new")}
            >
              Match
            </Menu.Item>
            <Menu.Item leftSection={<IconTrophy size={16} />}>
              Tournament
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Container>
  );
};

export default Page;
