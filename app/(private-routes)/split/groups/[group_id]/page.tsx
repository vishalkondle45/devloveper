"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { GroupType, GroupUser } from "@/components/Split/Group/Group.Types";
import { colors, groupTypes } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  SegmentedControl,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconSettings, IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);

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
      .then((res) => {
        setGroup(res?.data);
        form.setValues(res?.data);
      })
      .catch((error) => router.push("/split/groups"));
  };

  const groupType = groupTypes.find(({ type }) => type === group?.type);

  const deleteGroup = async () => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete group forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      confirmProps: { color: "red" },
      centered: true,
      onConfirm: async () => {
        await axios.delete(`/api/split/groups/${params?.group_id}`).then(() => {
          notifications.show({
            message: "Group deleted",
            icon: <IconCheck />,
            color: "green",
          });
          router.push("/split/groups");
        });
      },
    });
  };

  const upateGroup = async () => {
    await axios
      .put(`/api/split/groups/${params?.group_id}`, form.values)
      .then((res) => {
        form.reset();
        close();
        getGroup();
        notifications.show({
          message: "Group updated",
          icon: <IconCheck />,
          color: "green",
        });
      })
      .catch((error) => console.log(error));
  };

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
              <Group gap={rem(6)}>
                <Text>Created by</Text>
                <Tooltip label={data?.user?.name} withArrow>
                  <Avatar
                    size="sm"
                    src={null}
                    alt={data?.user?.name || ""}
                    variant="filled"
                    color={colors[getDigitByString(data?.user?.name)]}
                  >
                    {getInitials(data?.user?.name)}
                  </Avatar>
                </Tooltip>
                <Text fw={700}>
                  {group?.user === data?.user?._id ? "You" : "Others"}
                </Text>
              </Group>
            </Stack>
          </Group>
          <Group wrap="nowrap" gap="xs">
            <ActionIcon onClick={open} radius="xl">
              <IconSettings style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
            <ActionIcon color="red" onClick={deleteGroup} radius="xl">
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
      <Modal opened={opened} onClose={close} withCloseButton={false}>
        <form onSubmit={form.onSubmit(upateGroup)}>
          <TextInput
            label="Group name"
            placeholder="Enter a group name"
            {...form.getInputProps("title")}
            mb="xs"
          />
          <SegmentedControl
            w={rem("100%")}
            color="teal"
            size="xs"
            data={groupTypes.map((group) => ({
              key: group.type,
              value: group.type,
              label: (
                <Center>
                  <group.icon />
                </Center>
              ),
            }))}
            {...form.getInputProps("type")}
          />
          <Group mt="sm" justify="right">
            <Button color="red" onClick={close}>
              Cancel
            </Button>
            <Button color="green" type="submit">
              Submit
            </Button>
          </Group>
        </form>
      </Modal>
    </Container>
  );
};

export default Page;
