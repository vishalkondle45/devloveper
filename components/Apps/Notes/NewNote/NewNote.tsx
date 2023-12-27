import TextEditor from "@/components/TextEditor";
import { Badge, Button, Group, Modal, Stack, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { Props, Values } from "./NewNote.types";

const NewNote = ({ getNotes, labels }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

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

  const removeLabel = (_id: Types.ObjectId) => {
    let labels = form.values.labels.filter((id) => id !== _id);
    form.setFieldValue("labels", labels);
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
            <Group>
              {form.values.labels?.map((label) => (
                <Badge
                  variant="dot"
                  size="lg"
                  rightSection={
                    <IconX onClick={() => removeLabel(label._id)} size={18} />
                  }
                >
                  {labels?.find(({ _id }) => _id === label._id)?.title}
                </Badge>
              ))}
            </Group>
            <Group wrap="nowrap" my="xs">
              <Button color="red" onClick={close} fullWidth>
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
