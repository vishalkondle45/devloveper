import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconHash, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";
import { Props, LabelType } from "./EditLabel.types";

const EditLabel = ({ getLabels, opened, label, editClose }: Props) => {
  const form = useForm({
    initialValues: {
      title: label?.title,
    },

    validate: {
      title: (value) => (value?.length ? null : "Please enter title field."),
    },
  });

  const handleSubmit = (values: LabelType) => {
    axios
      .put(`/api/notes/labels?_id=${label?._id}`, values)
      .then((res) => {
        getLabels();
        notifications.show({
          message: "Label updated successfully",
          icon: <IconCheck />,
          color: "green",
        });
        editClose();
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    form.setFieldValue("title", label?.title || "");
  }, [label]);

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={editClose}
        title={
          <Text fw={700} fz={28}>
            Edit Label
          </Text>
        }
        centered
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack gap="xs">
            <TextInput
              leftSection={<IconHash />}
              name="title"
              label="Title"
              placeholder="Title"
              {...form.getInputProps("title")}
            />
            <Group wrap="nowrap" my="xs">
              <Button color="red" onClick={editClose} fullWidth>
                Cancel
              </Button>
              <Button type="submit" disabled={!form.isDirty("title")} fullWidth>
                Submit
              </Button>
            </Group>
          </Stack>
        </form>
      </Modal>
    </>
  );
};

export default EditLabel;
