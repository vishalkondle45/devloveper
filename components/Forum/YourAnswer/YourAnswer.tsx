import TextEditor from "@/components/TextEditor";
import { Button, Loader, LoadingOverlay, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";

const YourAnswer = ({ getForum }: any) => {
  const params = useParams();
  const [value, setValue] = useState(true);

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
    setValue(false);
    handleAnswer("answer", "");
    await axios
      .post(`/api/forum/${params?.forum_id}/answer`, values)
      .then(() => {
        getForum();
      });
    setValue(true);
  };

  return (
    <>
      <Title order={3}>Your Answer</Title>
      <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>
        {value ? (
          <TextEditor
            placeholder="Your answer"
            name="answer"
            text={form.values.answer}
            style={{ marginTop: -20 }}
            handleText={handleAnswer}
          />
        ) : (
          <Loader />
        )}
        <Button type="submit" mt="lg">
          Post Your Answer
        </Button>
      </form>
    </>
  );
};

export default YourAnswer;
