import TextEditor from "@/components/TextEditor";
import { Button, Group, Modal, MultiSelect, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useEffect } from "react";
import { NoteType, Props } from "./EditNote.types";

const EditNote = ({ getNotes, opened, note, editClose }: Props) => {
  const form = useForm({
    initialValues: {
      title: "",
      note: "",
      labels: [] as Types.ObjectId[],
    },

    validate: {
      note: (value) =>
        value.length
          ? null
          : notifications.show({
              message: "Please enter note field.",
              icon: <IconX />,
              color: "red",
            }),
    },
  });

  const handleText = (name: string, text: string) => {
    form.setFieldValue(name, text);
  };

  const handleSubmit = (values: NoteType) => {
    axios
      .put(`/api/notes?_id=${note?._id}`, values)
      .then((res) => {
        getNotes();
        notifications.show({
          message: "Note updated successfully",
          icon: <IconCheck />,
          color: "green",
        });
        editClose();
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    form.setFieldValue("title", note?.title || "");
    form.setFieldValue("note", note?.note || "");
    form.setFieldValue("labels", note?.labels || []);
  }, [note]);

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={editClose}
        title={
          <Text fw={700} fz={28}>
            New Note
          </Text>
        }
        centered
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack gap="xs">
            <TextEditor
              text={form.values.title}
              name="title"
              label="Title"
              placeholder="Title"
              handleText={handleText}
              withImage={false}
              withParagraph={false}
            />
            <TextEditor
              text={form.values.note}
              name={"note"}
              label="Note"
              placeholder="Note"
              handleText={handleText}
            />
            <MultiSelect searchable {...form.getInputProps("labels")} />
            <Group wrap="nowrap" my="xs">
              <Button onClick={editClose} fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default EditNote;
