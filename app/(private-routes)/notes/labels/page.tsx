"use client";
import EditLabel from "@/components/Apps/Notes/Labels/EditLabel";
import NewLabel from "@/components/Apps/Notes/Labels/NewLabel";
import { Values } from "@/components/Apps/Notes/Labels/NewLabel/NewLabel.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  ActionIcon,
  Center,
  Container,
  Group,
  LoadingOverlay,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconPencil, IconTags, IconTrash, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [labels, setLabels] = useState<Values[] | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [label, setLabel] = useState(null);
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
    { title: "Labels", href: "/labels" },
  ];
  const editClose = () => {
    close();
    setLabel(null);
  };

  const editLabel = (label: any) => {
    open();
    setLabel(label);
  };

  const getLabels = async () => {
    axios
      .get("/api/notes/labels")
      .then((res) => {
        setLabels(res.data);
      })
      .catch((err) => {
        notifications.show({
          message: "Error while fetching labels",
          icon: <IconX />,
          color: "red",
        });
      });
  };

  useEffect(() => {
    getLabels();
  }, []);

  const deleteNote = async (_id?: Types.ObjectId) => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete label forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      centered: true,
      onConfirm: async () => {
        await axios.delete(`/api/notes/labels?_id=${_id}`);
        getLabels();
      },
    });
  };

  return (
    <Container my="md" size="md">
      <LoadingOverlay visible={status === "loading" || !labels} />
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Group justify="space-between">
        <Text fz={rem(40)} fw={700}>
          Labels
        </Text>
        <NewLabel getLabels={getLabels} />
        {label && (
          <EditLabel
            getLabels={getLabels}
            opened={opened}
            label={label}
            editClose={editClose}
          />
        )}
      </Group>
      {!labels?.length ? (
        <>
          <Center h={500}>
            <Stack align="center">
              <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
                <IconTags style={{ width: rem(100), height: rem(100) }} />
              </ThemeIcon>
              <Text size="xl">No labels created yet</Text>
            </Stack>
          </Center>
        </>
      ) : (
        <Container size="xs">
          <Stack>
            {labels?.map((item) => (
              <Paper key={item?.title} shadow="xl" withBorder>
                <Group px="xl" py="md" justify="space-between">
                  <Text fw={700}>#{item?.title}</Text>
                  <Group>
                    <ActionIcon
                      onClick={() => editLabel(item)}
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
      )}
    </Container>
  );
};

export default Page;
