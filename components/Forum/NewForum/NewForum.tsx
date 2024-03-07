import TextEditor from "@/components/TextEditor";
import {
  Button,
  Center,
  InputLabel,
  Modal,
  TagsInput,
  TextInput,
  rem,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconHash } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";

const NewForum = ({ getForums }: any) => {
  const [forum, setForum] = useState({
    question: "",
    description: "",
    tags: [],
  });

  const [opened, { open, close }] = useDisclosure();

  const handleQuestion = (name: string, text: string | string[]) => {
    if (name === "tags" && Array.isArray(text)) {
      text = text.map((tag) => tag.replace(/\s/g, ""));
    }
    setForum((old) => ({ ...old, [name]: text }));
  };

  const submitForum = () => {
    axios.post("/api/forum", forum).then(() => {
      close();
      getForums();
      setForum({
        question: "",
        description: "",
        tags: [],
      });
    });
  };

  return (
    <>
      <Button onClick={open}>Ask Question</Button>
      <Modal size="xl" opened={opened} onClose={close} title="Ask Question">
        <TextInput
          value={forum.question}
          onChange={(e) => handleQuestion("question", e.currentTarget.value)}
          placeholder="Forum Title"
          label="Forum Title"
        />
        <InputLabel>Forum Description</InputLabel>
        <TextEditor
          placeholder="Forum Description"
          name="description"
          text={forum.description}
          style={{ marginTop: -20 }}
          handleText={handleQuestion}
        />
        <TagsInput
          leftSection={<IconHash style={{ width: rem(16), height: rem(16) }} />}
          label="Your favorite libraries"
          placeholder="Pick value"
          onChange={(v) => handleQuestion("tags", v)}
          value={forum.tags}
          splitChars={[",", " "]}
        />
        <Center>
          <Button
            mt="xs"
            onClick={submitForum}
            disabled={!forum.question && !forum.description}
          >
            Submit
          </Button>
        </Center>
      </Modal>
    </>
  );
};

export default NewForum;
