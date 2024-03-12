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
const Page = () => {
  const { status } = useSession();
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
            <Menu.Item leftSection={<IconUser size={16} />}>Player</Menu.Item>
            <Menu.Item leftSection={<IconUsersGroup size={16} />}>
              Team
            </Menu.Item>
            <Menu.Item leftSection={<IconCricket size={16} />}>Match</Menu.Item>
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
