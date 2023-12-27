import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconHash, IconTag } from "@tabler/icons-react";
import axios from "axios";
import { Props, Values } from "./NewLabel.types";

const NewLabel = ({ getLabels }: Props) => {
  const [opened, { open, close }] = useDisclosure(false);

  const form = useForm({
    initialValues: {
      title: "",
    },

    validate: {
      title: (value) => (value.length ? null : "This field is required."),
    },
  });

  const handleSubmit = (values: Values) => {
    axios
      .post("/api/notes/labels", values)
      .then((res) => {
        getLabels();
        notifications.show({
          message: "Label created successfully",
          icon: <IconCheck />,
          color: "green",
        });
        close();
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  const handleClose = () => {
    close();
    form.reset();
  };

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={handleClose}
        title={
          <Text fw={700} fz={28}>
            New Label
          </Text>
        }
        centered
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack gap="xs">
            <TextInput
              leftSection={<IconHash />}
              label="Title"
              fw={700}
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <Group wrap="nowrap" my="xs">
              <Button onClick={handleClose} color="red" fullWidth>
                Cancel
              </Button>
              <Button type="submit" fullWidth>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
      <Button onClick={open} leftSection={<IconTag />}>
        New Label
      </Button>
    </>
  );
};

export default NewLabel;
