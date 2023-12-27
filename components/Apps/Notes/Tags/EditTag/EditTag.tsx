import { Button, Group, Modal, Stack, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useEffect } from "react";
import { Props, TagType } from "./EditTag.types";

const EditTag = ({ getTags, opened, tag, editClose }: Props) => {
  const form = useForm({
    initialValues: {
      title: tag?.title,
    },

    validate: {
      title: (value) =>
        value?.length
          ? null
          : notifications.show({
              message: "Please enter title field.",
              icon: <IconX />,
              color: "red",
            }),
    },
  });

  const handleSubmit = (values: TagType) => {
    axios
      .put(`/api/notes/tags?_id=${tag?._id}`, values)
      .then((res) => {
        getTags();
        notifications.show({
          message: "Tag updated successfully",
          icon: <IconCheck />,
          color: "green",
        });
        editClose();
        form.reset();
      })
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    form.setFieldValue("title", tag?.title || "");
  }, [tag]);

  return (
    <>
      <Modal
        size="md"
        opened={opened}
        onClose={editClose}
        title={
          <Text fw={700} fz={28}>
            Edit Tag
          </Text>
        }
        centered
      >
        <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
          <Stack gap="xs">
            <TextInput
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

export default EditTag;
