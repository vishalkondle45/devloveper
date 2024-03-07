import TextEditor from "@/components/TextEditor";
import { Button, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useParams } from "next/navigation";

const YourAnswer = ({ getForum, handlers }: any) => {
  const params = useParams();

  const form = useForm({
    initialValues: {
      answer: "",
    },
    validate: {
      answer: (val) =>
        val.length > 2 ? null : "Please enter answer atlease of 3 characters.",
    },
  });

  const handleAnswer = (name: string, text: string) => {
    form.setFieldValue(name, text);
  };

  const handleSubmit = async (values: any) => {
    handlers.open();
    handleAnswer("answer", "");
    await axios
      .post(`/api/forum/${params?.forum_id}/answer`, values)
      .then(() => {
        getForum();
      })
      .finally(() => handlers.close());
  };

  return (
    <>
      <Title order={3}>Your Answer</Title>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        <TextEditor
          placeholder="Your answer"
          name="answer"
          text={form.values.answer}
          style={{ marginTop: -20 }}
          handleText={handleAnswer}
        />
        <Button type="submit" mt="lg">
          Post Your Answer
        </Button>
      </form>
    </>
  );
};

export default YourAnswer;
