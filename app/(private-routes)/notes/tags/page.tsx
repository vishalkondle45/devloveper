"use client";
import EditTag from "@/components/Apps/Notes/Tags/EditTag";
import NewTag from "@/components/Apps/Notes/Tags/NewTag";
import { Values } from "@/components/Apps/Notes/Tags/NewTag/NewTag.types";
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
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [tags, setTags] = useState<Values[] | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [tag, setTag] = useState(null);
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
    { title: "Tags", href: "/tags" },
  ];
  const editClose = () => {
    close();
    setTag(null);
  };

  const editTag = (tag: any) => {
    open();
    setTag(tag);
  };

  const getTags = async () => {
    axios
      .get("/api/notes/tags")
      .then((res) => {
        setTags(res.data);
      })
      .catch((err) => {
        notifications.show({
          message: "Error while fetching tags",
          icon: <IconX />,
          color: "red",
        });
      });
  };

  useEffect(() => {
    getTags();
  }, []);

  const deleteNote = async (_id?: Types.ObjectId) => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete tag forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      centered: true,
      onConfirm: async () => {
        await axios.delete(`/api/notes/tags?_id=${_id}`);
        getTags();
      },
    });
  };

  return (
    <Container my="md" size="md">
      <LoadingOverlay visible={status === "loading"} />
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Tags
        </Text>
        <NewTag getTags={getTags} />
        {tag && (
          <EditTag
            getTags={getTags}
            opened={opened}
            tag={tag}
            editClose={editClose}
          />
        )}
      </Group>
      <Container size="xs">
        <Stack>
          {tags?.map((item) => (
            <Paper key={item?.title} shadow="xl" withBorder>
              <Group px="xl" py="md" justify="space-between">
                <Text fw={700}>#{item?.title}</Text>
                <Group>
                  <ActionIcon
                    onClick={() => editTag(item)}
                    variant="transparent"
                    color="blue"
                  >
                    <IconPencil />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() => deleteNote(item?._id)}
                    variant="transparent"
                    color="red"
                  >
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
