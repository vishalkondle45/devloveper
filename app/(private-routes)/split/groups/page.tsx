"use client";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import GroupItem from "@/components/Split/Group/Group";
import { GroupType } from "@/components/Split/Group/Group.Types";
import { groupTypes } from "@/lib/constants";
import {
  Button,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Modal,
  SegmentedControl,
  Stack,
  TextInput,
  Title,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons-react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [opened, { open, close }] = useDisclosure(false);
  const [groups, setGroups] = useState<GroupType[]>([]);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Split", href: "/split" },
    { title: "Groups", href: "/split/groups" },
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

  const closeModal = () => {
    close();
    form.reset();
  };

  const newGroup = async () => {
    await axios
      .post("/api/split/groups", form.values)
      .then((res) => {
        getGroups();
        form.reset();
        close();
        notifications.show({
          message: "New group created",
          icon: <IconCheck />,
          color: "green",
        });
      })
      .catch((error) => console.log(error));
  };

  const getGroups = async () => {
    const res = await axios.get("/api/split/groups");
    setGroups(res.data);
  };

  useEffect(() => {
    getGroups();
  }, []);

  if (status === "loading") {
    return <LoadingOverlay visible />;
  }

  return (
    <Container mt="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group my="xs" justify="space-between">
        <Title order={2}>Groups</Title>
        <Button variant="transparent" size="compact-sm" onClick={open}>
          New a group
        </Button>
      </Group>
      <Container size="xs" px={0}>
        <Stack>
          {groups.map((group: GroupType) => (
            <GroupItem key={String(group._id)} group={group} />
          ))}
        </Stack>
      </Container>
      <Modal size="sm" opened={opened} onClose={close} title="New Group">
        <form onSubmit={form.onSubmit(newGroup)}>
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
            <Button color="red" onClick={closeModal}>
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
