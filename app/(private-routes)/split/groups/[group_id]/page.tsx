"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { GroupType } from "@/components/Split/Group/Group.Types";
import GroupUser from "@/components/Split/Group/User/GroupUser";
import {
  AutoCompleteDataType,
  GroupUserType,
} from "@/components/Split/Group/User/User.Types";
import { colors, groupTypes } from "@/lib/constants";
import { getDigitByString, getInitials } from "@/lib/functions";
import {
  ActionIcon,
  Avatar,
  Center,
  ComboboxItem,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  Paper,
  SegmentedControl,
  Select,
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
import mongoose from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const [group, setGroup] = useState<GroupType | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState<ComboboxItem | null>(null);
  const [friends, setFriends] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const params = useParams();
  const router = useRouter();

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Groups", href: "/split/groups" },
    {
      title: String(group?.title) || String(params?.group_id),
      href: String(params?.group_id),
    },
  ];

  const form = useForm({
    initialValues: {
      title: "",
      type: "home",
      users: [],
      user: new mongoose.Types.ObjectId(),
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

  const update = async (
    property: "title" | "type" | "users",
    value: string | never[]
  ) => {
    await axios
      .put(`/api/split/groups/${params?.group_id}`, { [property]: value })
      .then((res) => getGroup())
      .catch((error) => console.log(error));
  };

  const getFriends = async () => {
    const res = await axios.get("/api/split/friends");
    setFriends(
      res.data.map((item: AutoCompleteDataType) => ({
        value: item._id,
        label: item.name,
      }))
    );
  };

  const updateUser = async (user: string | null) => {
    await axios
      .put(`/api/split/groups/${params?.group_id}/users`, {
        user,
      })
      .then(() => setSearchValue(""))
      .then(() => getGroup());
  };

  useEffect(() => {
    getGroup();
    getFriends();
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
      <Modal opened={opened} title="Edit Group" onClose={close}>
        <TextInput
          label="Group name"
          placeholder="Enter a group name"
          {...form.getInputProps("title")}
          mb="xs"
          onBlur={() => update("title", form.values.title)}
        />
        <Text fw={500} fz="sm">
          Type
        </Text>
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
          mb="xs"
          {...form.getInputProps("type")}
          onChange={(value) => update("type", value)}
        />
        <Text fw={500} fz="sm">
          Users
        </Text>
        <Paper p="sm" withBorder>
          <Select
            searchable
            searchValue={searchValue}
            onSearchChange={setSearchValue}
            data={friends}
            value={value ? value.value : null}
            onChange={(_value) => updateUser(_value)}
            mb="sm"
          />
          <Stack gap={0}>
            {form.values.users.map((user: GroupUserType, index) => (
              <GroupUser
                form={form}
                index={index}
                user={user}
                key={String(user._id)}
                updateUser={updateUser}
              />
            ))}
          </Stack>
        </Paper>
      </Modal>
    </Container>
  );
};

export default Page;
