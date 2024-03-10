import { ActionIcon, Group, Textarea } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconArrowUp, IconPrompt } from "@tabler/icons-react";
import { RefObject } from "react";

interface Props {
  sendMessage: (prompt: string) => Promise<void>;
  form: UseFormReturnType<
    {
      prompt: string;
    },
    (values: { prompt: string }) => {
      prompt: string;
    }
  >;
  closeEditPrompt?: () => void | undefined;
  refEle?: RefObject<HTMLTextAreaElement>;
}

const NewPrompt = ({ sendMessage, form, refEle, closeEditPrompt }: Props) => {
  return (
    <>
      <form onSubmit={form.onSubmit(({ prompt }) => sendMessage(prompt))}>
        <Group wrap="nowrap" gap={0}>
          <Textarea
            rows={3}
            w="100%"
            placeholder="Enter a prompt..."
            autosize
            {...form.getInputProps("prompt")}
            leftSection={<IconPrompt />}
            rightSection={
              <ActionIcon variant="filled" size="lg" type="submit">
                <IconArrowUp />
              </ActionIcon>
            }
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendMessage(form.values.prompt);
              }
            }}
            data-autofocus
            onBlur={closeEditPrompt}
            ref={refEle}
          />
        </Group>
      </form>
    </>
  );
};

export default NewPrompt;
