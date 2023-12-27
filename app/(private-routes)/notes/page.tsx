"use client";
import EditNote from "@/components/Apps/Notes/EditNote";
import NewNote from "@/components/Apps/Notes/NewNote";
import Note from "@/components/Apps/Notes/Note";
import { NoteType } from "@/components/Apps/Notes/Note/Note.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Badge,
  Box,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Text,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = () => {
  const { status } = useSession();
  const [notes, setNotes] = useState<NoteType[] | null>(null);
  const [opened, { open, close }] = useDisclosure(false);
  const [note, setNote] = useState(null);

  const getNotes = async () => {
    const res = await axios.get("/api/notes");
    setNotes(res.data);
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
    await axios.put(`/api/notes?_id=${_id}`, { trashed: true });
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

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
  ];

  return (
    <Container my="md" size="md">
      {!notes ? (
        <LoadingOverlay visible={status === "loading"} />
      ) : (
        <>
          <BreadcrumbsComp breadcrumbs={breadcrumbs} />
          <Group justify="space-between">
            <Text fz={rem(40)} fw={700}>
              Notes
            </Text>
            <NewNote getNotes={getNotes} />
          </Group>
          {Boolean(notes?.filter(({ pinned }) => pinned).length) && (
            <Badge variant="transparent">Pinned</Badge>
          )}
          {note && (
            <EditNote
              getNotes={getNotes}
              opened={opened}
              note={note}
              editClose={editClose}
            />
          )}
          <Grid align="flex-start">
            {notes
              .filter(({ pinned }) => pinned)
              .map((note) => (
                <Grid.Col
                  span={{ base: 12, sm: 6, md: 4 }}
                  key={String(note._id)}
                >
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
          <Box mt="xs">
            {Boolean(notes.filter(({ pinned }) => pinned).length) && (
              <Badge variant="transparent">Others</Badge>
            )}
            {note && (
              <EditNote
                getNotes={getNotes}
                opened={opened}
                note={note}
                editClose={editClose}
              />
            )}
            <Grid align="flex-start">
              {notes
                .filter(({ pinned }) => !pinned)
                .map((note) => (
                  <Grid.Col
                    span={{ base: 12, sm: 6, md: 4 }}
                    key={String(note._id)}
                  >
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
          </Box>
        </>
      )}
    </Container>
  );
};

export default Page;
