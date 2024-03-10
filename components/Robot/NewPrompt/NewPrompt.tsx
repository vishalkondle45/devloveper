import { ActionIcon, Group, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { IconPrompt, IconSend } from "@tabler/icons-react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface Props {
  handlers: {
    readonly open: () => void;
    readonly close: () => void;
    readonly toggle: () => void;
  };
}

const NewPrompt = ({ handlers }: Props) => {
  const form = useForm({
    initialValues: {
      prompt: "",
    },
    validate: {
      prompt: (value) => (value ? null : "This field is required."),
    },
  });

  const router = useRouter();

  const sendMessage = async () => {
    if (form.values.prompt.trim() === "") {
      form.setFieldError("prompt", "This field is required.");
      return;
    }
    handlers.open();
    await axios
      .post(`/api/robot`, { prompt: form.values.prompt.trim() })
      .then((response) => {
        router.push(`/robot/${response.data._id}`);
      })
      .catch((error) => {
        router.push(`/robot`);
      });
  };
  return (
    <>
      <form onSubmit={form.onSubmit(sendMessage)}>
        <Group wrap="nowrap" gap={0}>
          <Textarea
            rows={3}
            w="100%"
            placeholder="Enter a prompt..."
            autosize
            {...form.getInputProps("prompt")}
            leftSection={<IconPrompt />}
            rightSection={
              <ActionIcon variant="light" size="lg" type="submit">
                <IconSend />
              </ActionIcon>
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
          />
        </Group>
      </form>
    </>
  );
};

export default NewPrompt;
