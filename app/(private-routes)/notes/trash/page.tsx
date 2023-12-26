"use client";
import Note from "@/components/Apps/Notes/Note";
import { NoteType } from "@/components/Apps/Notes/Note/Note.types";
import { Container, Grid, LoadingOverlay, Text, rem } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { modals } from "@mantine/modals";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Page = () => {
  const { status } = useSession();
  const [notes, handlers] = useListState<NoteType>([]);

  const getNotes = async () => {
    const res = await axios.get("/api/notes?trashed");
    handlers.setState(res.data);
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

  return (
    <Container size="md">
      {status === "loading" && <LoadingOverlay visible />}
      <Text my="md" fz={rem(40)} fw={700}>
        Trash
      </Text>
      <Grid align="flex-start">
        {notes.map((note) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={String(note._id)}>
            <Note
              note={note}
              deleteNote={deleteNote}
              recoverNote={recoverNote}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;
