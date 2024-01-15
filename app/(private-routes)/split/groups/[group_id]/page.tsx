"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { GroupType, GroupUser } from "@/components/Split/Group/Group.Types";
import { groupTypes } from "@/lib/constants";
import {
  ActionIcon,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const [group, setGroup] = useState<GroupType | null>(null);

  const params = useParams();
  const router = useRouter();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Group", href: "/split/groups" },
    {
      title: String(group?.title) || String(params?.group_id),
      href: String(params?.group_id),
    },
  ];

  const form = useForm({
    initialValues: {
      title: "",
      type: "home",
    },
    validate: {
      title: (value) => (value ? null : "This field is required."),
    },
  });

  const getGroup = async () => {
    await axios
      .get(`/api/split/groups/${params?.group_id}`)
      .then((res) => setGroup(res?.data))
      .catch((error) => router.push("/split/groups"));
  };

  const groupType = groupTypes.find(({ type }) => type === group?.type);

  useEffect(() => {
    getGroup();
  }, []);

  if (status === "loading" || !group) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Paper my="md" p="xs" withBorder>
        <Group wrap="nowrap" justify="space-between">
          <Group wrap="nowrap">
            <ThemeIcon variant="light" radius="xl" size="xl">
              {groupType && <groupType.icon />}
            </ThemeIcon>
            <Stack gap={0}>
              <Text fw={700}>{group.title}</Text>
              <Group gap="xs">
                <Text>Created by</Text>
                <Text fw={700}>
                  {group?.user === data?.user?._id ? "You" : "Others"}
                </Text>
              </Group>
            </Stack>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <ActionIcon radius="xl">
              <IconSettings style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
            <ActionIcon radius="xl">
              <IconTrash style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          </Group>
        </Group>
      </Paper>
      <Container size="xs" px={0}>
        {group.users.map((user: GroupUser) => (
          <Text>{user?.name}</Text>
        ))}
      </Container>
    </Container>
  );
};

export default Page;
