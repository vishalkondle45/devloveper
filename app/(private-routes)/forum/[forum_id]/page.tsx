"use client";
import Answer from "@/components/Forum/Answer";
import Forum from "@/components/Forum/Forum";
import { AnswerTypes, ForumType } from "@/components/Forum/Forum.Types";
import YourAnswer from "@/components/Forum/YourAnswer";
import BreadcrumbsComp from "@/components/Navbar/Breadcrumbs";
import { Container, Divider, LoadingOverlay } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import axios from "axios";
import { Types } from "mongoose";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const { status, data } = useSession();
  const userId = data?.user?._id;
  const params = useParams();
  const [forum, setForum] = useState<ForumType | null>(null);
  const [answers, setAnswers] = useState<AnswerTypes | null>(null);
  const router = useRouter();
  const [opened, handlers] = useDisclosure(true);

  const breadcrumbs = [
    { title: "Home", href: "/" },
    { title: "Forum", href: "/forum" },
    { title: forum?.question || "", href: `/forum/${forum?._id}` },
  ];

  const getForum = async () => {
    handlers.open();
    await axios
      .get(`/api/forum/${params?.forum_id}`)
      .then(({ data }) => setForum(data))
      .catch(() => {
        notifications.show({
          icon: <IconX />,
          color: "red",
          message: "Forum not found.",
        });
        router.push("/forum");
      });
    await axios
      .get(`/api/forum/${params?.forum_id}/answer`)
      .then(({ data }) => setAnswers(data))
      .catch(() => router.push("/forum"));
    handlers.close();
  };

  useEffect(() => {
    getForum();
  }, []);

  if (status === "loading" || !forum || opened) {
    return <LoadingOverlay visible />;
  }

  return (
    <Container my="md" size="md">
      <BreadcrumbsComp breadcrumbs={breadcrumbs} />
      {forum && <Forum forum={forum} getForum={getForum} handlers={handlers} />}
      <Divider my="xl" />
      {answers?.map((answer) => (
        <Answer answer={answer} getForum={getForum} handlers={handlers} />
      ))}
      <YourAnswer getForum={getForum} handlers={handlers} />
    </Container>
  );
};

export default Page;
