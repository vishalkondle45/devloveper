import TextEditor from "@/components/TextEditor";
import { Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Props, Values } from "./NewNote.types";

const NewNote = ({ getNotes }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
      note: "",
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

  const handleSubmit = (values: Values) => {
    axios
      .post("/api/notes", values)
      .then((res) => {
        getNotes();
        notifications.show({
          message: "Note created successfully",
          icon: <IconCheck />,
          color: "green",
        });
        close();
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={close}
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
            />
            <TextEditor
              text={form.values.note}
              name={"note"}
              label="Note"
              placeholder="Note"
              handleText={handleText}
            />
            <Group wrap="nowrap" my="xs">
              <Button onClick={close} fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Button onClick={open} leftSection={<IconPlus />}>
        New Note
      </Button>
    </>
  );
};

export default NewNote;
