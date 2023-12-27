"use client";
import Note from "@/components/Apps/Notes/Note";
import { NoteType } from "@/components/Apps/Notes/Note/Note.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Center,
  Container,
  Grid,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const Page = () => {
  const { status } = useSession();
  const [notes, setNotes] = useState<NoteType[] | null>(null);
  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
    { title: "Trash", href: "/trash" },
  ];

  const getNotes = async () => {
    const res = await axios.get("/api/notes?trashed");
    setNotes(res.data);
  };

  const deleteNote = async (_id: Types.ObjectId) => {
    modals.openConfirmModal({
      title: <Text size="lg">Delete note forever?</Text>,
      labels: { confirm: "Delete", cancel: "Cancel" },
      centered: true,
      onConfirm: async () => {
        await axios.delete(`/api/notes?_id=${_id}`);
        getNotes();
      },
    });
  };

  const recoverNote = async (_id: Types.ObjectId) => {
    await axios.put(`/api/notes?_id=${_id}`, { trashed: false });
    getNotes();
  };

  useEffect(() => {
    getNotes();
  }, []);

  if (status === "loading" || !notes) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      <Text fz={rem(40)} fw={700}>
        Trash
      </Text>
      {!notes.length ? (
        <Center h={500}>
          <Stack align="center">
            <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
              <IconTrash style={{ width: rem(100), height: rem(100) }} />
            </ThemeIcon>
            <Text size="xl">No notes in Trash</Text>
          </Stack>
        </Center>
      ) : (
        <Grid align="flex-start">
          {notes?.map((note) => (
            <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={String(note._id)}>
              <Note
                note={note}
                deleteNote={deleteNote}
                recoverNote={recoverNote}
              />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Page;
