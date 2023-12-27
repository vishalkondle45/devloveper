"use client";
import EditNote from "@/components/Apps/Notes/EditNote";
import NewNote from "@/components/Apps/Notes/NewNote";
import Note from "@/components/Apps/Notes/Note";
import { NoteType } from "@/components/Apps/Notes/Note/Note.types";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import {
  Badge,
  Box,
  Center,
  Container,
  Grid,
  Group,
  LoadingOverlay,
  Stack,
  Text,
  ThemeIcon,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconTag } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
const Page = ({ params }: { params: any }) => {
  const { status } = useSession();
  const [notes, setNotes] = useState<NoteType[] | null>(null);
  const [labels, setLabels] = useState<any[]>([]);
  const [opened, { open, close }] = useDisclosure(false);
  const [note, setNote] = useState(null);

  const getNotes = async () => {
    const res = await axios.get(`/api/notes?label=${params.id}`);
    setNotes(res.data);
  };

  const getLabels = async () => {
    const res = await axios.get("/api/notes/labels");
    setLabels(res.data);
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
    getLabels();
  }, []);

  let labelTitle = labels.find(({ _id }) => _id === params.id)?.title;

  const [breadcrumbs, setBreadcrumbs] = useState([
    { title: "Home", href: "/" },
    { title: "Notes", href: "/notes" },
  ]);

  useEffect(() => {
    if (labels && labelTitle)
      setBreadcrumbs((values) => [
        ...values,
        {
          title: labelTitle,
          href: "/notes/labels/" + params.id,
        },
      ]);
  }, [params._id, labels]);

  if (!notes || status === "loading") {
    return <LoadingOverlay visible />;
  }
  if (!notes.length) {
    return (
      <Center h={500}>
        <Stack align="center">
          <ThemeIcon color="gray" variant="transparent" size={rem(100)}>
            <IconTag style={{ width: rem(100), height: rem(100) }} />
          </ThemeIcon>
          <Text size="xl">No notes with this label yet</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Container my="md" size="md">
      <>
        {note && (
          <EditNote
            getNotes={getNotes}
            opened={opened}
            note={note}
            editClose={editClose}
          />
        )}
        <BreadcrumbsComp breadcrumbs={breadcrumbs} />
        <Group justify="space-between">
          <Text fz={rem(40)} fw={700}>
            {labelTitle}
          </Text>
          <NewNote getNotes={getNotes} labels={labels} />
        </Group>
        {Boolean(notes?.filter(({ pinned }) => pinned).length) && (
          <Badge variant="transparent">Pinned</Badge>
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
                  labels={labels}
                  getNotes={getNotes}
                />
              </Grid.Col>
            ))}
        </Grid>
        <Box mt="xs">
          {Boolean(notes.filter(({ pinned }) => pinned).length) && (
            <Badge variant="transparent">Others</Badge>
          )}
          <Grid align="flex-start">
            {labels &&
              notes
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
                      labels={labels}
                      getNotes={getNotes}
                    />
                  </Grid.Col>
                ))}
          </Grid>
        </Box>
      </>
    </Container>
  );
};

export default Page;
