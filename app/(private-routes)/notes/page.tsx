"use client";
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
import { useListState } from "@mantine/hooks";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
const Page = () => {
  const { status } = useSession();
  const [notes, handlers] = useListState<NoteType>([]);

  const getNotes = async () => {
    const res = await axios.get("/api/notes");
    handlers.setState(res.data);
  };

  useEffect(() => {
    getNotes();
  }, []);

  return (
    <Container size="lg">
      <LoadingOverlay visible={status === "loading"} />
      <Group justify="space-between" wrap="nowrap">
        <Text fz={rem(40)} fw={700}>
          Notes
        </Text>
        <NewNote getNotes={getNotes} />
      </Group>
      <Grid align="flex-start">
        {notes.map((note) => (
          <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={String(note._id)}>
            <Note note={note} />
          </Grid.Col>
        ))}
      </Grid>
    </Container>
  );
};

export default Page;