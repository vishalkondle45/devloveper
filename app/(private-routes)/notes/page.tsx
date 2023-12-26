"use client";
import EditNote from "@/components/Apps/Notes/EditNote";
import NewNote from "@/components/Apps/Notes/NewNote";
import Note from "@/components/Apps/Notes/Note";
import { NoteType } from "@/components/Apps/Notes/Note/Note.types";
import {
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure, useListState } from "@mantine/hooks";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [notes, handlers] = useListState<NoteType>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [note, setNote] = useState(null);

  const getNotes = async () => {
    const res = await axios.get("/api/notes");
    handlers.setState(res.data);
  };

  const updateNote = async (_id: Types.ObjectId, values: any) => {
    await axios.put(`/api/notes?_id=${_id}`, values);
    getNotes();
  };

  const cloneNote = async (values: any) => {
    await axios.post(`/api/notes`, values);
    getNotes();
  };

  const deleteNote = async (_id: Types.ObjectId) => {
    await axios.delete(`/api/notes?_id=${_id}`);
    getNotes();
  };

  const editNote = (note: any) => {
    open();
    setNote(note);
  };

  const editClose = () => {
    close();
    setNote(null);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <Container size="md">
      {status === "loading" && <LoadingOverlay visible />}
      <Group my="md" justify="space-between" wrap="nowrap">
        <Text fz={rem(40)} fw={700}>
          Notes
        </Text>
        <NewNote getNotes={getNotes} />
        {note && (
          <EditNote
            getNotes={getNotes}
            opened={opened}
            note={note}
            editClose={editClose}
          />
        )}
      </Group>
      <Grid align="flex-start">
        {notes.map((note) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={String(note._id)}>
            <Note
              note={note}
              updateNote={updateNote}
              cloneNote={cloneNote}
              deleteNote={deleteNote}
              editNote={editNote}
            />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;
